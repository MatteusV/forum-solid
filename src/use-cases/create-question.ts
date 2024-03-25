import { QuestionRepository } from '@/repositories/question-repository'
import { UserRepository } from '@/repositories/user-repository'
import { Question } from '@prisma/client'
import { UserNotExistsError } from './errors/user-not-exists-error'
import { generateSlug } from '@/utils/generateSlug'

interface CreateQuestionUseCaseRequest {
  title: string
  content: string
  authorId: string
}

interface CreateQuestionUseCaseResponse {
  question: Question
}

export class CreateQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    authorId,
    content,
    title,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const authorExists = await this.userRepository.findById(authorId)

    if (!authorExists) {
      throw new UserNotExistsError()
    }

    const slug = generateSlug(title)

    const question = await this.questionRepository.create({
      authorId,
      content,
      slug,
      title,
    })

    return { question }
  }
}
