import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { SUPPORTED_FIELDS } from "@/lib/constants";

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
          _count: {
            select: {
              questions: true,
            },
          },
        },
      });

      if (!isOwner?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to access this form",
        });
      }

      // How can i get last order

      const res = await ctx.db.question.create({
        data: {
          order: isOwner._count.questions + 1,
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
        })
        ,
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
});
