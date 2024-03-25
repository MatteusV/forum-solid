import { QuestionRepository } from '@/repositories/question-repository'
import { QuestionCommentRepository } from '@/repositories/questions-comments-repository'
import { UserRepository } from '@/repositories/user-repository'
import { Comment } from '@prisma/client'
import { UserNotExistsError } from './errors/user-not-exists-error'
import { QuestionNotExistsError } from './errors/question-not-exists-error'

interface CreateQuestionCommentUseCaseRequest {
  authorId: string
  content: string
  questionId: string
}

interface CreateQuestionCommentUseCaseResponse {
  comment: Comment
}

export class CreateQuestionCommentUseCase {
  constructor(
    private questionCommentRepository: QuestionCommentRepository,
    private userRepository: UserRepository,
    private questionRepository: QuestionRepository,
  ) {}

  async execute({
    authorId,
    content,
    questionId,
  }: CreateQuestionCommentUseCaseRequest): Promise<CreateQuestionCommentUseCaseResponse> {
    const userExists = await this.userRepository.findById(authorId)

    if (!userExists) {
      throw new UserNotExistsError()
    }

    const questionExists = await this.questionRepository.findById(questionId)

    if (!questionExists) {
      throw new QuestionNotExistsError()
    }

    const comment = await this.questionCommentRepository.create({
      authorId,
      content,
      questionId,
    })

    return { comment }
  }
}
