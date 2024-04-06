import { SlugAlreadyExistsError } from '@/use-cases/errors/slug-already-exists-error'
import { makeCreateQuestionUseCase } from '@/use-cases/factories/make-create-question-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = z.object({
    title: z.string(),
    content: z.string(),
  })

  const { content, title } = requestBodySchema.parse(request.body)

  try {
    const createQuestionUseCase = makeCreateQuestionUseCase()

    const authorId = request.user.sub

    const { question } = await createQuestionUseCase.execute({
      authorId,
      content,
      title,
    })

    return reply.status(201).send({ questionId: question.id })
  } catch (error) {
    if (error instanceof SlugAlreadyExistsError) {
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }
}
