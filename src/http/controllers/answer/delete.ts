import { AnswerNotExistsError } from '@/use-cases/errors/answer-not-exists-error'
import { makeDeleteAnswerUseCase } from '@/use-cases/factories/make-delete-answer-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteAnswer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    answerId: z.string().uuid(),
  })
  const userId = request.user.role
  const { answerId } = requestParamsSchema.parse(request.params)

  try {
    const deleteAnswerUseCase = makeDeleteAnswerUseCase()

    deleteAnswerUseCase.execute({
      answerId,
      userId,
    })
  } catch (error) {
    if (error instanceof AnswerNotExistsError) {
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }
}
