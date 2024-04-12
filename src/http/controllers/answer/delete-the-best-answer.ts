import { BestAnswerNotExistsError } from '@/use-cases/errors/best-answer-not-exists-error'
import { makeBestAnswerUseCase } from '@/use-cases/factories/make-delete-best-answer-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteBestAnswer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    bestAnswerId: z.string().uuid(),
  })

  const { bestAnswerId } = requestParamsSchema.parse(request.params)
  const userId = request.user.sub
  try {
    const bestAnswerUseCase = makeBestAnswerUseCase()
    await bestAnswerUseCase.execute({
      bestAnswerId,
      userId,
    })

    reply.status(200).send()
  } catch (error) {
    if (error instanceof BestAnswerNotExistsError) {
      reply.status(400).send({ message: error.message })
    }
    throw error
  }
}
