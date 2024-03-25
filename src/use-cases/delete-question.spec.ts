import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryQuestionRepository } from '@/repositories/in-memory/in-memory-question-repository'
import { DeleteQuestionUseCase } from './delete-question'
import { QuestionNotExistsError } from './errors/question-not-exists-error'

let questionRepository: InMemoryQuestionRepository
let sut: DeleteQuestionUseCase

describe('Delete Question Use Case', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    sut = new DeleteQuestionUseCase(questionRepository)
  })

  it('should be able delete question', async () => {
    const createdQuestion = await questionRepository.create({
      authorId: 'user-01',
      content: 'content a question',
      slug: 'new-question',
      title: 'New Question',
    })

    await sut.execute({
      questionId: createdQuestion.id,
    })

    const question = await questionRepository.findById(createdQuestion.id)

    expect(question!.delete).toEqual(true)
  })

  it('not should be able delete question without question id', async () => {
    await expect(() =>
      sut.execute({
        questionId: 'questionNotExists',
      }),
    ).rejects.toBeInstanceOf(QuestionNotExistsError)
  })
})
