import { PrismaAnswerRepository } from '@/repositories/prisma/prisma-answer-repository'
import { PrismaQuestionRepository } from '@/repositories/prisma/prisma-question-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { DeleteAnswerUseCase } from '../delete-answer'

export function makeDeleteAnswerUseCase() {
  const answerRepository = new PrismaAnswerRepository()
  const questionRepository = new PrismaQuestionRepository()
  const userRepository = new PrismaUserRepository()

  const deleteAnswerUseCase = new DeleteAnswerUseCase(
    userRepository,
    answerRepository,
    questionRepository,
  )

  return deleteAnswerUseCase
}
