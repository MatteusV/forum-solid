import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryBestAnswerRepository } from '@/repositories/in-memory/in-memory-best-answer-repository'
import { DeleteBestAnswerUseCase } from './delete-best-answer'
import { BestAnswerNotExistsError } from './errors/best-answer-not-exists-error'

let bestAnswerRepository: InMemoryBestAnswerRepository
let sut: DeleteBestAnswerUseCase

describe('Delete Best Answer Use Case', () => {
  beforeEach(() => {
    bestAnswerRepository = new InMemoryBestAnswerRepository()
    sut = new DeleteBestAnswerUseCase(bestAnswerRepository)
  })

  it('should be able delete a best answer', async () => {
    const bestAnswer = await bestAnswerRepository.create({
      answerId: 'answer-01',
      questionId: 'question-01',
    })

    await sut.execute({
      bestAnswerId: bestAnswer.id,
    })

    const bestAnswerDelete = await bestAnswerRepository.findById(bestAnswer.id)
    expect(bestAnswerDelete!.delete).toEqual(true)
  })

  it('not should be able delete a best answer without bestAnswerId', async () => {
    await expect(() =>
      sut.execute({ bestAnswerId: 'answerNotExists' }),
    ).rejects.toBeInstanceOf(BestAnswerNotExistsError)
  })
})
