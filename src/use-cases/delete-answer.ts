import { AnswerRepository } from '@/repositories/answer-repository'
import { UserRepository } from '@/repositories/user-repository'
import { UserNotExistsError } from './errors/user-not-exists-error'
import { AnswerNotExistsError } from './errors/answer-not-exists-error'
import { UserNotHavePermissionError } from './errors/user-not-have-permission-error'

interface DeleteAnswerUseCaseRequest {
  answerId: string
  userId: string
}

export class DeleteAnswerUseCase {
  constructor(
    private userRepository: UserRepository,
    private answerRepository: AnswerRepository,
  ) {}

  async execute({ answerId, userId }: DeleteAnswerUseCaseRequest) {
    const answerExits = await this.answerRepository.findById(answerId)

    const userExists = await this.userRepository.findById(userId)

    if (!userExists) {
      throw new UserNotExistsError()
    }

    if (!answerExits) {
      throw new AnswerNotExistsError()
    }

    if (userId !== answerExits.authorId) {
      throw new UserNotHavePermissionError()
    }

    await this.answerRepository.delete(answerId)
  }
}
