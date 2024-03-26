import { AnswerRepository } from '@/repositories/answer-repository'
import { QuestionRepository } from '@/repositories/question-repository'
import { UserRepository } from '@/repositories/user-repository'
import { Answer } from '@prisma/client'
import { UserNotExistsError } from './errors/user-not-exists-error'
import { UserIsNotAnInstructorError } from './errors/user-is-not-an-instructor-error'
import { QuestionNotExistsError } from './errors/question-not-exists-error'
import { generateSlug } from '@/utils/generateSlug'

interface CreateAnswerQuestionUseCaseRequest {
  slugText: string
  content: string
  questionId: string
  authorId: string
}

interface CreateAnswerQuestionUseCaseResponse {
  answer: Answer
}

export class CreateAnswerQuestionUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private questionRepository: QuestionRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
    slugText,
  }: CreateAnswerQuestionUseCaseRequest): Promise<CreateAnswerQuestionUseCaseResponse> {
    const userExist = await this.userRepository.findById(authorId)

    if (!userExist) {
      throw new UserNotExistsError()
    }

    if (userExist.role !== 'INSTRUCTOR') {
      throw new UserIsNotAnInstructorError()
    }

    const questionExists = await this.questionRepository.findById(questionId)

    if (!questionExists) {
      throw new QuestionNotExistsError()
    }

    const slug = generateSlug(slugText)

    const answer = await this.answerRepository.create({
      authorId,
      content,
      slug,
      questionId,
    })

    return { answer }
  }
}
