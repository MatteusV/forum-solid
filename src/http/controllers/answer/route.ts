import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { defineTheBestAnswer } from './define-the-best-answer'
import { deleteAnswer } from './delete'
import { fetchAnswers } from './fetch-answers'
import { deleteBestAnswer } from './delete-the-best-answer'

export async function answersRoute(app: FastifyInstance) {
  app.post(
    '/answers/:questionId',
    { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] },
    create,
  )

  app.patch(
    '/best-answer/:questionId/:answerId',
    { onRequest: [verifyJwt] },
    defineTheBestAnswer,
  )

  app.delete(
    '/best-answer/:bestAnswerId',
    {
      onRequest: [verifyJwt],
    },
    deleteBestAnswer,
  )
  app.get('/answers/:questionId', fetchAnswers)

  app.delete('/answers/:answerId', { onRequest: [verifyJwt] }, deleteAnswer)
}
