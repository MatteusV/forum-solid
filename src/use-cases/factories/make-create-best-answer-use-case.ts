import { PrismaAnswerRepository } from '@/repositories/prisma/prisma-answer-repository'
import { PrismaQuestionRepository } from '@/repositories/prisma/prisma-question-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { CreateBestAnswerUseCase } from '../create-best-answer'
import { PrismaBestAnswerRepository } from '@/repositories/prisma/prisma-best-answer-repository'

export function makeCreateBestAnswerUseCase() {
  const answerRepository = new PrismaAnswerRepository()
  const questionRepository = new PrismaQuestionRepository()
  const userRepository = new PrismaUserRepository()
  const bestAnswerRepository = new PrismaBestAnswerRepository()

  const createBestAnswerUseCase = new CreateBestAnswerUseCase(
    questionRepository,
    userRepository,
    bestAnswerRepository,
    answerRepository,
  )

  return createBestAnswerUseCase
}
