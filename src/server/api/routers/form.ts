import z from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const formRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const res = await ctx.db.form.create({
      data: {
        createdBy: { connect: { id: ctx.session.user.id } },
      },
    });

    return res.id;
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.form.findMany({
      where: {
        createdById: ctx.session.user.id,
      },
    });

    return res;
  }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const res = await ctx.db.form.findUnique({
        where: {
          id: input.id,
          OR: [
            {
              createdById: ctx.session.user.id,
              published: false,
            },
            {
              published: true,
            },
          ],
        },
      });

      return res;
    }),

  renameForm: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db.form.update({
        data: {
          name: input.name,
        },
        where: {
          id: input.id,
          createdById: ctx.session.user.id,
        },
      });

      return res;
    }),

  starForm: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        state: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db.form.update({
        data: {
          starred: input.state,
        },
        where: {
          id: input.id,
          createdById: ctx.session.user.id,
        },
      });

      return res;
    }),

  updateForm: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
        starred: z.coerce.boolean().optional(),
        published: z.coerce.boolean().optional(),
        publishedAt: z.coerce.date().optional(),
        requireAuth: z.coerce.boolean().optional(),
        sendResponseEmail: z.coerce.boolean().optional(),
        allowResponseEditing: z.coerce.boolean().optional(),
        limitOneResponse: z.coerce.boolean().optional(),
        allQuestionsRequired: z.coerce.boolean().optional(),
        showProgressBar: z.coerce.boolean().optional(),
        shuffleQuestionOrder: z.coerce.boolean().optional(),
        confirmationMessage: z.string().optional(),
        showLinkFormAnotherResponse: z.coerce.boolean().optional(),
      }).partial(),
    )
    .mutation(async ({ ctx, input }) => {
      const {id, ...partialInput} = input;

      const res = await ctx.db.form.update({
        data: {
          ...partialInput
        },
        where: {
          id,
          createdById: ctx.session.user.id,
        },
      });

      return res;
    }),
});
