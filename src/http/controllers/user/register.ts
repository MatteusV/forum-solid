import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string(),
    role: z.string().nullable(),
  })

  const { email, name, password, role } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    if (!role) {
      await registerUseCase.execute({
        email,
        name,
        password,
        role: 'STUDENT',
      })
    } else if (role === 'instructor') {
      await registerUseCase.execute({
        email,
        name,
        password,
        role: 'INSTRUCTOR',
      })
    } else {
      await registerUseCase.execute({
        email,
        name,
        password,
        role: 'STUDENT',
      })
    }
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
  }

  return reply.status(201).send()
}
