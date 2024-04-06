import { AnswerRepository } from '@/repositories/answer-repository'
import { BestAnswerRepository } from '@/repositories/best-answer-repository'
import { QuestionRepository } from '@/repositories/question-repository'
import { BestAnswer } from '@prisma/client'
import { QuestionNotExistsError } from './errors/question-not-exists-error'
import { UserNotHavePermissionError } from './errors/user-not-have-permission-error'
import { AnswerNotExistsError } from './errors/answer-not-exists-error'
import { UserRepository } from '@/repositories/user-repository'
import { UserNotExistsError } from './errors/user-not-exists-error'
import { BestAnswerAlreadyExistsError } from './errors/best-answer-already-exists-error'

interface CreateBestAnswerUseCaseRequest {
  questionId: string
  answerId: string
  userId: string
}

interface CreateBestAnswerUseCaseResponse {
  bestAnswer: BestAnswer
}

export class CreateBestAnswerUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private userRepository: UserRepository,
    private bestAnswerRepository: BestAnswerRepository,
    private answerRepository: AnswerRepository,
  ) {}

  async execute({
    answerId,
    questionId,
    userId,
  }: CreateBestAnswerUseCaseRequest): Promise<CreateBestAnswerUseCaseResponse> {
    const bestAnswerExists = await this.bestAnswerRepository.findByUniqueIds({
      answerId,
      questionId,
    })

    if (bestAnswerExists) {
      throw new BestAnswerAlreadyExistsError()
    }

    const question = await this.questionRepository.findById(questionId)
    const answer = await this.answerRepository.findById(answerId)
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotExistsError()
    }

    if (!question) {
      throw new QuestionNotExistsError()
    }

    if (!answer) {
      throw new AnswerNotExistsError()
    }

    if (question.authorId !== userId) {
      throw new UserNotHavePermissionError()
    }

    const bestAnswer = await this.bestAnswerRepository.create({
      answerId,
      questionId,
    })

    return { bestAnswer }
  }
}
