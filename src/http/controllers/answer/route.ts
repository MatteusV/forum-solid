import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function answersRoute(app: FastifyInstance) {
  app.post(
    '/answers/:questionId',
    { onRequest: [verifyJwt, verifyUserRole('INSTRUCTOR')] },
    create,
  )
}
