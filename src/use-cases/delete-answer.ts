import { AnswerRepository } from '@/repositories/answer-repository'
import { UserRepository } from '@/repositories/user-repository'
import { UserNotExistsError } from './errors/user-not-exists-error'
import { QuestionRepository } from '@/repositories/question-repository'
import { AnswerNotExistsError } from './errors/answer-not-exists-error'
import { QuestionNotExistsError } from './errors/question-not-exists-error'
import { UserNotHavePemissionError } from './errors/user-not-have-permission-error'

interface DeleteAnswerUseCaseRequest {
  answerId: string
  userId: string
}

export class DeleteAnswerUseCase {
  constructor(
    private userRepository: UserRepository,
    private answerRepository: AnswerRepository,
    private questionRepository: QuestionRepository,
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

    const question = await this.questionRepository.findById(
      answerExits.questionId,
    )

    if (!question) {
      throw new QuestionNotExistsError()
    }

    if (userId !== answerExits.authorId) {
      throw new UserNotHavePemissionError()
    }

    await this.answerRepository.delete(answerId)
  }
}
