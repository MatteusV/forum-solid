import { PrismaAnswerRepository } from '@/repositories/prisma/prisma-answer-repository'
import { FetchAnswersUseCase } from '../fetch-answers'
import { PrismaQuestionRepository } from '@/repositories/prisma/prisma-question-repository'

export function makeFetchAnswersUseCase() {
  const answerRepository = new PrismaAnswerRepository()
  const questionRepository = new PrismaQuestionRepository()

  const fetchAnswersUseCase = new FetchAnswersUseCase(
    answerRepository,
    questionRepository,
  )

  return fetchAnswersUseCase
}
