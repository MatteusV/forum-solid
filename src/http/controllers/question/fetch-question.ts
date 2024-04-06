import { makeFetchQuestionUseCase } from '@/use-cases/factories/make-fetch-question-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchQuestions(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const fetchQuestionsUseCase = makeFetchQuestionUseCase()

    const { questions } = await fetchQuestionsUseCase.execute()

    return reply.status(200).send({ questions })
  } catch (error) {
    if (error) {
      return reply.status(500)
    }
  }
}
