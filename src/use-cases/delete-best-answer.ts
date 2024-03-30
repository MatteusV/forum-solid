import { BestAnswerRepository } from '@/repositories/best-answer-repository'
import { BestAnswerNotExistsError } from './errors/best-answer-not-exists-error'
import { UserRepository } from '@/repositories/user-repository'
import { UserNotExistsError } from './errors/user-not-exists-error'
import { AnswerRepository } from '@/repositories/answer-repository'
import { QuestionRepository } from '@/repositories/question-repository'
import { AnswerNotExistsError } from './errors/answer-not-exists-error'
import { QuestionNotExistsError } from './errors/question-not-exists-error'
import { UserNotHavePemissionError } from './errors/user-not-have-permission-error'

interface DeleteBestAnswerUseCaseRequest {
  bestAnswerId: string
  userId: string
}

export class DeleteBestAnswerUseCase {
  constructor(
    private bestAnswerRepository: BestAnswerRepository,
    private userRepository: UserRepository,
    private answerRepository: AnswerRepository,
    private questionRepository: QuestionRepository,
  ) {}

  async execute({ bestAnswerId, userId }: DeleteBestAnswerUseCaseRequest) {
    const bestAnswerExits =
      await this.bestAnswerRepository.findById(bestAnswerId)

    const userExists = await this.userRepository.findById(userId)

    if (!userExists) {
      throw new UserNotExistsError()
    }

    if (!bestAnswerExits) {
      throw new BestAnswerNotExistsError()
    }

    const answer = await this.answerRepository.findById(
      bestAnswerExits.answerId,
    )

    const question = await this.questionRepository.findById(
      bestAnswerExits.questionId,
    )

    if (!answer) {
      throw new AnswerNotExistsError()
    }

    if (!question) {
      throw new QuestionNotExistsError()
    }

    if (userId !== answer.authorId || userId !== question.authorId) {
      throw new UserNotHavePemissionError()
    }

    await this.bestAnswerRepository.delete(bestAnswerId)
  }
}
