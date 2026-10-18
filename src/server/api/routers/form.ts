import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const formRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const res = await ctx.db.form.create({
      data: {
        createdBy: { connect: { id: ctx.session.user.id } },
      },
    });

    return res.id
  }),
});
