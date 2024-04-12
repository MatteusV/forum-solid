import { PrismaAnswerRepository } from '@/repositories/prisma/prisma-answer-repository'
import { PrismaQuestionRepository } from '@/repositories/prisma/prisma-question-repository'
import { DeleteBestAnswerUseCase } from '../delete-best-answer'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { PrismaBestAnswerRepository } from '@/repositories/prisma/prisma-best-answer-repository'

export function makeBestAnswerUseCase() {
  const answerRepository = new PrismaAnswerRepository()
  const questionRepository = new PrismaQuestionRepository()
  const userRepository = new PrismaUserRepository()
  const bestAnswerRepository = new PrismaBestAnswerRepository()

  const bestAnswerUseCase = new DeleteBestAnswerUseCase(
    bestAnswerRepository,
    userRepository,
    answerRepository,
    questionRepository,
  )

  return bestAnswerUseCase
}
