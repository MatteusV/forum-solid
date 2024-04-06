import { BestAnswerAlreadyExistsError } from '@/use-cases/errors/best-answer-already-exists-error'
import { BestAnswerNotExistsError } from '@/use-cases/errors/best-answer-not-exists-error'
import { makeCreateBestAnswerUseCase } from '@/use-cases/factories/make-create-best-answer-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function defineTheBestAnswer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    questionId: z.string().uuid(),
    answerId: z.string().uuid(),
  })

  const { answerId, questionId } = requestParamsSchema.parse(request.params)

  const userId = request.user.sub
  try {
    const createBestAnswerUseCase = makeCreateBestAnswerUseCase()

    await createBestAnswerUseCase.execute({
      answerId,
      questionId,
      userId,
    })
  } catch (error) {
    if (
      error instanceof BestAnswerNotExistsError ||
      error instanceof BestAnswerAlreadyExistsError
    ) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
