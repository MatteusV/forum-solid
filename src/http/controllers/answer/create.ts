import { UserIsNotAnInstructorError } from '@/use-cases/errors/user-is-not-an-instructor-error'
import { makeCreateAnswerUseCase } from '@/use-cases/factories/make-create-answer-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = z.object({
    content: z.string(),
  })

  const requestParamsSchema = z.object({
    questionId: z.string().uuid(),
  })

  const { content } = requestBodySchema.parse(request.body)
  const { questionId } = requestParamsSchema.parse(request.params)
  const authorId = request.user.sub

  const createAnswerUseCase = makeCreateAnswerUseCase()

  try {
    const { answer } = await createAnswerUseCase.execute({
      authorId,
      content,
      questionId,
    })

    return reply.status(201).send({ answer })
  } catch (error) {
    if (error instanceof UserIsNotAnInstructorError) {
      return reply.status(401).send({ message: error.message })
    }

    throw error
  }
}
