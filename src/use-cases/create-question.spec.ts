import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryQuestionRepository } from '@/repositories/in-memory/in-memory-question-repository'
import { CreateQuestionUseCase } from './create-question'
import { UserNotExistsError } from './errors/user-not-exists-error'

let usersRepository: InMemoryUserRepository
let questionRepository: InMemoryQuestionRepository
let sut: CreateQuestionUseCase

describe('Create Question Use Case', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    usersRepository = new InMemoryUserRepository()
    sut = new CreateQuestionUseCase(questionRepository, usersRepository)
  })

  it('should be able create a question', async () => {
    const user = await usersRepository.create({
      email: 'varlesse04@gmail.com',
      name: 'matteus',
      password: await hash('123456', 8),
    })

    const { question } = await sut.execute({
      authorId: user.id,
      content: 'content the a question',
      title: 'Nova pergunta',
    })

    expect(question.id).toEqual(expect.any(String))
  })

  it('should not be able to create a question without author id', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'userNotExists',
        content: 'content the a question',
        title: 'Nova pergunta',
      }),
    ).rejects.toBeInstanceOf(UserNotExistsError)
  })

  it('should create the slug from the title', async () => {
    const user = await usersRepository.create({
      email: 'varlesse04@gmail.com',
      name: 'matteus',
      password: await hash('123456', 8),
    })

    const { question } = await sut.execute({
      authorId: user.id,
      content: 'content the a question',
      title: 'Nova pergunta',
    })

    expect(question.slug).toEqual('nova-pergunta')
  })

  it('should not be able to create a question without author id', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'userNotExists',
        content: 'content the a question',
        title: 'Nova pergunta',
      }),
    ).rejects.toBeInstanceOf(UserNotExistsError)
  })
})
