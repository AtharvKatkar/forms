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
        state: z.boolean()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db.form.update({
        data: {
          stared: input.state
        },
        where: {
          id: input.id,
          createdById: ctx.session.user.id,
        },
      });

      return res;
    }),
});
