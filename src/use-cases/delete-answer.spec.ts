import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryQuestionRepository } from '@/repositories/in-memory/in-memory-question-repository'
import { InMemoryAnswerRepository } from '@/repositories/in-memory/in-memory-answer-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { AnswerNotExistsError } from './errors/answer-not-exists-error'

let usersRepository: InMemoryUserRepository
let answerRepository: InMemoryAnswerRepository
let questionRepository: InMemoryQuestionRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer Use Case', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    usersRepository = new InMemoryUserRepository()
    answerRepository = new InMemoryAnswerRepository()
    sut = new DeleteAnswerUseCase(answerRepository)
  })

  it('should be able delete a answer', async () => {
    const user = await usersRepository.create({
      email: 'varlesse04@gmail.com',
      name: 'matteus',
      password: await hash('123456', 8),
      role: 'INSTRUCTOR',
    })

    const question = await questionRepository.create({
      authorId: 'user-01',
      content: 'content a question',
      title: 'Nova pergunta',
      slug: 'nova-pergunta',
    })

    const answer = await answerRepository.create({
      authorId: user.id,
      content: 'content a answer',
      questionId: question.id,
      slug: 'new-answer',
    })

    await sut.execute({
      answerId: answer.id,
    })

    const answerDelete = await answerRepository.findById(answer.id)

    expect(answerDelete?.delete).toEqual(true)
  })

  it('not should be able delete a answer without answer id', async () => {
    await expect(() =>
      sut.execute({ answerId: 'answerNotExists' }),
    ).rejects.toBeInstanceOf(AnswerNotExistsError)
  })
})
