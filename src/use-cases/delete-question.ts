import { QuestionRepository } from '@/repositories/question-repository'
import { QuestionNotExistsError } from './errors/question-not-exists-error'

interface DeleteQuestionUseCaseRequest {
  questionId: string
}

export class DeleteQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({ questionId }: DeleteQuestionUseCaseRequest) {
    const questionExists = await this.questionRepository.findById(questionId)

    if (!questionExists) {
      throw new QuestionNotExistsError()
    }

    await this.questionRepository.delete(questionId)
  }
}
