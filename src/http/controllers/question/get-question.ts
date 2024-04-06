import { QuestionNotExistsError } from '@/use-cases/errors/question-not-exists-error'
import { makeGetQuestionByIdUseCase } from '@/use-cases/factories/make-get-question-by-id-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getQuestion(request: FastifyRequest, reply: FastifyReply) {
  const requestParamsSchema = z.object({
    questionId: z.string().uuid()
  })

  const { questionId } = requestParamsSchema.parse(request.params)

  try {
    const getQuestionByIdUseCase = makeGetQuestionByIdUseCase()

    const { question } = await getQuestionByIdUseCase.execute({
     questionId
    })

    return reply.status(201).send({ question })
  } catch (error) {
    if(error instanceof QuestionNotExistsError) {
      return reply.status(400).send({message: error.message})
    }
    throw error
  }
}
