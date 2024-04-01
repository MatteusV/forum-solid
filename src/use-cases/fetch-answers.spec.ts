import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryQuestionRepository } from '@/repositories/in-memory/in-memory-question-repository'
import { InMemoryAnswerRepository } from '@/repositories/in-memory/in-memory-answer-repository'
import { FetchAnswersUseCase } from './fetch-answers'
import { QuestionNotExistsError } from './errors/question-not-exists-error'


let questionRepository: InMemoryQuestionRepository
let answerRepository: InMemoryAnswerRepository
let sut: FetchAnswersUseCase

describe('Fetch Answers Use Case', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    answerRepository = new InMemoryAnswerRepository()
    sut = new FetchAnswersUseCase(answerRepository, questionRepository)
  })

  it('should be able fetch answers', async () => {
 
   const question = await questionRepository.create({
      authorId: 'user-01',
      content: 'content a question',
      slug: 'new-question',
      title: 'New Question',
    })

    await answerRepository.create({
        authorId: 'user-02',
        content: 'content',
        questionId: question.id,
        slug: 'slug',
    })

    const questions = await sut.execute({
        questionId: question.id
    })



    expect(questions).toEqual(expect.any(Object))
  })

  it('not should be able fetch answers with wrong question id', async () => {
    await answerRepository.create({
        authorId: 'user-02',
        content: 'content',
        questionId: 'question-01',
        slug: 'slug',
    })


    await expect(() => 
        sut.execute({
            questionId: 'questionNotExists'
        })
    ).rejects.toBeInstanceOf(QuestionNotExistsError)

  })
})
