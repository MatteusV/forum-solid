import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryQuestionRepository } from '@/repositories/in-memory/in-memory-question-repository'
import { FetchQuestionsUseCase } from './fetch-question'


let questionRepository: InMemoryQuestionRepository
let sut: FetchQuestionsUseCase

describe('Fetch Questions Use Case', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    sut = new FetchQuestionsUseCase(questionRepository)
  })

  it('should be able fetch questions', async () => {
 
    await questionRepository.create({
      authorId: 'user-01',
      content: 'content a question',
      slug: 'new-question',
      title: 'New Question',
    })

    const questions = await sut.execute()



    expect(questions).toEqual(expect.any(Object))
  })
})
