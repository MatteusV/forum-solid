import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryQuestionRepository } from '@/repositories/in-memory/in-memory-question-repository'
import { GetQuestionByIdUseCase } from './get-question-by-id'
import { QuestionNotExistsError } from './errors/question-not-exists-error'


let questionRepository: InMemoryQuestionRepository
let sut: GetQuestionByIdUseCase

describe('Get Question By Id Use Case', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    sut = new GetQuestionByIdUseCase(questionRepository)
  })

  it('should be able get a question with id', async () => {
    const createdQuestion = await questionRepository.create({
      authorId: 'user-01',
      content: 'content a question',
      slug: 'new-question',
      title: 'New Question',
    })

    const { question } = await sut.execute({
      questionId: createdQuestion.id,
    })

    expect(question.id).toEqual(expect.any(String))
  })

  it('not should be able a get question with wrong id', async () => {
    await expect(() =>
      sut.execute({questionId: 'questionNotExist'})
    ).rejects.toBeInstanceOf(QuestionNotExistsError)
  })
})
