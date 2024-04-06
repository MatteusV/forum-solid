import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { getQuestion } from './get-question'

export async function questionsRoute(app: FastifyInstance) {
  app.post('/questions', { onRequest: [verifyJwt] }, create)
  app.get('/questions/:questionId', { onRequest: [verifyJwt] }, getQuestion)
}
