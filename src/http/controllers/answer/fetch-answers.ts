import { QuestionNotExistsError } from '@/use-cases/errors/question-not-exists-error'
import { makeFetchAnswersUseCase } from '@/use-cases/factories/make-fetch-answers-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchAnswers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    questionId: z.string().uuid(),
  })
  const { questionId } = requestParamsSchema.parse(request.params)
  try {
    const fetchAnswersUseCase = makeFetchAnswersUseCase()
    const { answers } = await fetchAnswersUseCase.execute({
      questionId,
    })

    reply.status(200).send({ answers })
  } catch (error) {
    if (error instanceof QuestionNotExistsError) {
      reply.status(400).send({ message: error.message })
    }
    throw error
  }
}
