import { QuestionRepository } from '@/repositories/question-repository'
import { Question } from '@prisma/client'
import { QuestionNotExistsError } from './errors/question-not-exists-error'

interface FetchQuestionsUseCaseResponse {
  questions: Question[]
}

export class FetchQuestionsUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute(): Promise<FetchQuestionsUseCaseResponse> {
    const questions = await this.questionRepository.fetchMany()

    if (!questions) {
      throw new QuestionNotExistsError()
    }

    return { questions }
  }
}
