import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { defineTheBestAnswer } from './define-the-best-answer'
import { deleteAnswer } from './delete'

export async function answersRoute(app: FastifyInstance) {
  app.post(
    '/answers/:questionId',
    { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] },
    create,
  )

  app.patch(
    '/answers/:questionId/:answerId',
    { onRequest: [verifyJwt] },
    defineTheBestAnswer,
  )

  app.delete(
    '/bestAnswer/:bestAnswerId',
    { onRequest: [verifyJwt] },
    deleteAnswer,
  )
}
