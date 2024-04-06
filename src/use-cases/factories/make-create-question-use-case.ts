import { PrismaQuestionRepository } from '@/repositories/prisma/prisma-question-repository'
import { CreateQuestionUseCase } from '../create-question'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'

export function makeCreateQuestionUseCase() {
  const questionRepository = new PrismaQuestionRepository()
  const userRepository = new PrismaUserRepository()

  const createQuestionUseCase = new CreateQuestionUseCase(
    questionRepository,
    userRepository,
  )

  return createQuestionUseCase
}
