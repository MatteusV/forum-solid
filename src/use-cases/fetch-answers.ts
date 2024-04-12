import { AnswerRepository } from '@/repositories/answer-repository'
import { QuestionRepository } from '@/repositories/question-repository'
import { Answer } from '@prisma/client'
import { QuestionNotExistsError } from './errors/question-not-exists-error'
import { AnswerNotExistsError } from './errors/answer-not-exists-error'

interface FetchAnswersUseCaseRequest {
  questionId: string
}

interface FetchAnswersUseCaseResponse {
  answers: Answer[]
}

export class FetchAnswersUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private questionRepository: QuestionRepository,
  ) {}

  async execute({
    questionId,
  }: FetchAnswersUseCaseRequest): Promise<FetchAnswersUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      throw new QuestionNotExistsError()
    }

    const answers = await this.answerRepository.fetchByQuestionId(questionId)

    if (!answers) {
      throw new AnswerNotExistsError()
    }

    return { answers }
  }
}
