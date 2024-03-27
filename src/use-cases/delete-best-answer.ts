import { BestAnswerRepository } from '@/repositories/best-answer-repository'
import { BestAnswerNotExistsError } from './errors/best-answer-not-exists-error'

interface DeleteBestAnswerUseCaseRequest {
  bestAnswerId: string
}

export class DeleteBestAnswerUseCase {
  constructor(private bestAnswerRepository: BestAnswerRepository) {}

  async execute({ bestAnswerId }: DeleteBestAnswerUseCaseRequest) {
    const bestAnswerExits =
      await this.bestAnswerRepository.findById(bestAnswerId)

    if (!bestAnswerExits) {
      throw new BestAnswerNotExistsError()
    }

    await this.bestAnswerRepository.delete(bestAnswerId)
  }
}
