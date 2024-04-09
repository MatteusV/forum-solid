import { QuestionRepository } from '@/repositories/question-repository'
import { QuestionNotExistsError } from './errors/question-not-exists-error'
import { UserRepository } from '@/repositories/user-repository'
import { UserNotExistsError } from './errors/user-not-exists-error'
import { UserNotHavePermissionError } from './errors/user-not-have-permission-error'

interface DeleteQuestionUseCaseRequest {
  questionId: string
  userId: string
}

export class DeleteQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({ questionId, userId }: DeleteQuestionUseCaseRequest) {
    const questionExists = await this.questionRepository.findById(questionId)
    const userExists = await this.userRepository.findById(userId)

    if (!questionExists) {
      throw new QuestionNotExistsError()
    }

    if (!userExists) {
      throw new UserNotExistsError()
    }

    if (questionExists.authorId !== userId) {
      throw new UserNotHavePermissionError()
    }

    await this.questionRepository.delete(questionId)
  }
}
