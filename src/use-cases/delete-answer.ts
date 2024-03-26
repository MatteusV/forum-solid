import { AnswerRepository } from '@/repositories/answer-repository'
import { AnswerNotExistsError } from './errors/answer-not-exists-error'

interface DeleteAnswerUseCaseRequest {
  answerId: string
}

export class DeleteAnswerUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({ answerId }: DeleteAnswerUseCaseRequest) {
    const answerExists = await this.answerRepository.findById(answerId)

    if (!answerExists) {
      throw new AnswerNotExistsError()
    }

    await this.answerRepository.delete(answerId)
  }
}
