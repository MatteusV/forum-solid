import { PrismaQuestionRepository } from '@/repositories/prisma/prisma-question-repository'
import { GetQuestionByIdUseCase } from '../get-question-by-id'

export function makeGetQuestionByIdUseCase() {
  const questionRepository = new PrismaQuestionRepository()

  const getQuestionByIdUseCase = new GetQuestionByIdUseCase(
    questionRepository,
  )

  return getQuestionByIdUseCase
}
