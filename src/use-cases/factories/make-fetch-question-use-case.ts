import { PrismaQuestionRepository } from '@/repositories/prisma/prisma-question-repository'
import { FetchQuestionsUseCase } from '../fetch-question'

export function makeFetchQuestionUseCase() {
  const questionRepository = new PrismaQuestionRepository()

  const fetchQuestionsUseCase = new FetchQuestionsUseCase(questionRepository)

  return fetchQuestionsUseCase
}
