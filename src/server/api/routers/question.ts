import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { type Prisma } from "generated/prisma";
import { SUPPORTED_FIELDS } from "@/lib/constants";

type Db = Prisma.TransactionClient;

const MOVE_DIRECTIONS = ["up", "down"] as const;

type MoveDirection = (typeof MOVE_DIRECTIONS)[number];

/**
 * `Question` orders are unique per form and `Option` orders are unique per question
 * (`@@unique([formId, order])` / `@@unique([questionId, order])`), so the next order has to be
 * read from the last row instead of derived from a row count: deleting a row in the middle
 * leaves a gap behind and `count + 1` would collide with an order that still exists.
 */
async function nextQuestionOrder(db: Db, formId: string) {
  const last = await db.question.findFirst({
    where: { formId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  return (last?.order ?? 0) + 1;
}

async function nextOptionOrder(db: Db, questionId: string) {
  const last = await db.option.findFirst({
    where: { questionId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  return (last?.order ?? 0) + 1;
}

/**
 * Rewrites the orders of a scope to a gapless `1..n`, used after a delete closes the hole it
 * left behind. The unique indexes make a plain renumber collide halfway through, so every row
 * that has to move is first parked above the scope (all parked orders end up `> n`, so the
 * second pass can never run into a conflict) and only then written to its final position.
 * Rows already sitting at their final position are left untouched.
 *
 * Must be called from inside a transaction so a failure cannot leave a half renumbered scope.
 */
async function resequenceQuestions(db: Db, formId: string) {
  const questions = await db.question.findMany({
    where: { formId },
    orderBy: { order: "asc" },
    select: { id: true, order: true },
  });

  const pending = questions
    .map((question, index) => ({ id: question.id, order: index + 1 }))
    .filter((final, index) => final.order !== questions[index]?.order);

  if (pending.length === 0) return;

  // Above the highest order in the scope (so nothing is overwritten) and above `n` (so the
  // final orders `1..n` cannot collide with a parked one).
  const parkBase =
    Math.max(questions[questions.length - 1]?.order ?? 0, 0) + questions.length;

  for (const [index, final] of pending.entries()) {
    await db.question.update({
      where: { id: final.id },
      data: { order: parkBase + index + 1 },
    });
  }

  for (const final of pending) {
    await db.question.update({
      where: { id: final.id },
      data: { order: final.order },
    });
  }
}

async function resequenceOptions(db: Db, questionId: string) {
  const options = await db.option.findMany({
    where: { questionId },
    orderBy: { order: "asc" },
    select: { id: true, order: true },
  });

  const pending = options
    .map((option, index) => ({ id: option.id, order: index + 1 }))
    .filter((final, index) => final.order !== options[index]?.order);

  if (pending.length === 0) return;

  const parkBase =
    Math.max(options[options.length - 1]?.order ?? 0, 0) + options.length;

  for (const [index, final] of pending.entries()) {
    await db.option.update({
      where: { id: final.id },
      data: { order: parkBase + index + 1 },
    });
  }

  for (const final of pending) {
    await db.option.update({
      where: { id: final.id },
      data: { order: final.order },
    });
  }
}

/**
 * Neighbours are resolved by comparison instead of `order ± 1` so that a move still lands on the
 * closest row when the scope has gaps, and so both directions read the same way in every
 * procedure that moves something.
 */
function neighborQuery(direction: MoveDirection, order: number) {
  return direction === "up"
    ? { sortOrder: "desc" as const, where: { order: { lt: order } } }
    : { sortOrder: "asc" as const, where: { order: { gt: order } } };
}

function getQuestionNeighbor(
  db: Db,
  formId: string,
  direction: MoveDirection,
  order: number,
) {
  const { sortOrder, where } = neighborQuery(direction, order);

  return db.question.findFirst({
    where: { formId, ...where },
    orderBy: { order: sortOrder },
    select: { id: true, order: true },
  });
}

function getOptionNeighbor(
  db: Db,
  questionId: string,
  direction: MoveDirection,
  order: number,
) {
  const { sortOrder, where } = neighborQuery(direction, order);

  return db.option.findFirst({
    where: { questionId, ...where },
    orderBy: { order: sortOrder },
    select: { id: true, order: true },
  });
}

export const questionRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        form_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const isOwner = await ctx.db.form.findUnique({
        where: {
          id: input.form_id,
          createdById: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });

      if (!isOwner?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to access this form",
        });
      }

      const res = await ctx.db.question.findMany({
        where: {
          formId: input.form_id,
        },
        include: {
          options: true,
        },
        orderBy: {
          order: "asc",
        },
      });

      return res;
    }),

  addQuestion: protectedProcedure
    .input(
      z.object({
        form_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const isOwner = await ctx.db.form.findUnique({
        where: {
          id: input.form_id,
          createdById: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });

      if (!isOwner?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to access this form",
        });
      }

      const res = await ctx.db.question.create({
        data: {
          order: await nextQuestionOrder(ctx.db, input.form_id),
          form: {
            connect: {
              id: input.form_id,
            },
          },
        },
      });

      return res;
    }),

  updateQuestion: protectedProcedure
    .input(
      z
        .object({
          form_id: z.string(),
          question_id: z.string(),
          title: z.string(),
          description: z.string(),
          inlineImage: z.string(),
          type: z.enum(SUPPORTED_FIELDS),
          order: z.coerce.number().positive(),
          required: z.coerce.boolean(),
          shuffleOptionOrder: z.coerce.boolean(),
        })
        .partial()
        .required({
          form_id: true,
          question_id: true,
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const { form_id, question_id, ...partialInput } = input;

      const isOwner = await ctx.db.form.findUnique({
        where: {
          id: form_id,
          createdById: ctx.session.user.id,
        },
      });

      if (!isOwner?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to access this form",
        });
      }

      const res = await ctx.db.question.update({
        where: {
          id: question_id,
        },
        data: {
          ...partialInput,
        },
      });

      return res;
    }),

  deleteQuestion: protectedProcedure
    .input(
      z.object({
        form_id: z.string(),
        question_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const isOwner = await ctx.db.form.findUnique({
        where: {
          id: input.form_id,
          createdById: ctx.session.user.id,
        },
      });

      if (!isOwner?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to access this form",
        });
      }

      // The deleted question leaves a hole in the sequence, so the remaining ones are pulled
      // up to keep orders gapless.
      const res = await ctx.db.$transaction(async (tx) => {
        const deleted = await tx.question.delete({
          where: {
            id: input.question_id,
          },
        });

        await resequenceQuestions(tx, input.form_id);

        return deleted;
      });

      return res;
    }),

  moveQuestion: protectedProcedure
    .input(
      z.object({
        form_id: z.string(),
        question_id: z.string(),
        direction: z.enum(MOVE_DIRECTIONS),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const question = await ctx.db.question.findFirst({
        where: {
          id: input.question_id,
          formId: input.form_id,
          form: { createdById: ctx.session.user.id },
        },
        select: {
          id: true,
          order: true,
        },
      });

      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Question not found",
        });
      }

      const neighbor = await getQuestionNeighbor(
        ctx.db,
        input.form_id,
        input.direction,
        question.order,
      );

      if (!neighbor) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            input.direction === "up"
              ? "Question is already the first one in this form"
              : "Question is already the last one in this form",
        });
      }

      // A direct swap violates `@@unique([formId, order])` halfway through, so the question
      // being moved parks on a free order, its neighbour slides into the gap and the question
      // then settles on the order it took over. All three writes run in one transaction.
      const freeOrder = await nextQuestionOrder(ctx.db, input.form_id);

      const [res] = await ctx.db.$transaction([
        ctx.db.question.update({
          where: { id: question.id },
          data: { order: freeOrder },
        }),
        ctx.db.question.update({
          where: { id: neighbor.id },
          data: { order: question.order },
        }),
        ctx.db.question.update({
          where: { id: question.id },
          data: { order: neighbor.order },
        }),
      ]);

      return res;
    }),

  addOption: protectedProcedure
    .input(
      z.object({
        question_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const order = await nextOptionOrder(ctx.db, input.question_id);

      return await ctx.db.option.create({
        data: {
          name: `New option`,
          order,
          question: {
            connect: {
              id: input.question_id,
            },
          },
        },
      });
    }),

  moveOption: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        direction: z.enum(MOVE_DIRECTIONS),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const option = await ctx.db.option.findFirst({
        where: {
          id: input.id,
          question: { form: { createdById: ctx.session.user.id } },
        },
        select: {
          id: true,
          order: true,
          questionId: true,
        },
      });

      if (!option) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Option not found",
        });
      }

      const neighbor = await getOptionNeighbor(
        ctx.db,
        option.questionId,
        input.direction,
        option.order,
      );

      if (!neighbor) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            input.direction === "up"
              ? "Option is already the first one in this question"
              : "Option is already the last one in this question",
        });
      }

      // Same park / slide / settle dance as `moveQuestion`, because
      // `@@unique([questionId, order])` rejects a swap that overlaps halfway through.
      const freeOrder = await nextOptionOrder(ctx.db, option.questionId);

      const [res] = await ctx.db.$transaction([
        ctx.db.option.update({
          where: { id: option.id },
          data: { order: freeOrder },
        }),
        ctx.db.option.update({
          where: { id: neighbor.id },
          data: { order: option.order },
        }),
        ctx.db.option.update({
          where: { id: option.id },
          data: { order: neighbor.order },
        }),
      ]);

      return res;
    }),

  updateOption: protectedProcedure
    .input(
      z
        .object({
          id: z.string(),
          name: z.string(),
          order: z.coerce.number(),
        })
        .partial()
        .required({ id: true }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...partialInput } = input;

      const res = await ctx.db.option.update({
        where: {
          id,
        },
        data: partialInput,
      });

      return res;
    }),

  deleteOption: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const res = await ctx.db.$transaction(async (tx) => {
        const deleted = await tx.option.delete({
          where: {
            id,
          },
        });

        await resequenceOptions(tx, deleted.questionId);

        return deleted;
      });

      return res;
    }),
});
