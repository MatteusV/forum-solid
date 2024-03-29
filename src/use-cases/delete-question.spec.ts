import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryQuestionRepository } from '@/repositories/in-memory/in-memory-question-repository'
import { DeleteQuestionUseCase } from './delete-question'
import { QuestionNotExistsError } from './errors/question-not-exists-error'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { hash } from 'bcryptjs'
import { UserNotHavePemissionError } from './errors/user-not-have-permission-error'
import { UserNotExistsError } from './errors/user-not-exists-error'

let questionRepository: InMemoryQuestionRepository
let userRepository: InMemoryUserRepository
let sut: DeleteQuestionUseCase

describe('Delete Question Use Case', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    userRepository = new InMemoryUserRepository()
    sut = new DeleteQuestionUseCase(questionRepository, userRepository)
  })

  it('should be able delete question', async () => {
    const user = await userRepository.create({
      email: 'varlesse04@gmail.com',
      name: 'Matteus',
      password: await hash('123456', 8),
    })

    const createdQuestion = await questionRepository.create({
      authorId: user.id,
      content: 'content a question',
      slug: 'new-question',
      title: 'New Question',
    })

    await sut.execute({
      questionId: createdQuestion.id,
      userId: user.id,
    })

    const question = await questionRepository.findById(createdQuestion.id)

    expect(question!.delete).toEqual(true)
  })

  it('not should be able delete question without question id', async () => {
    const user = await userRepository.create({
      email: 'varlesse04@gmail.com',
      name: 'Matteus',
      password: await hash('123456', 8),
    })

    await expect(() =>
      sut.execute({
        questionId: 'questionNotExists',
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(QuestionNotExistsError)
  })

  it('not should be able delete question without user id', async () => {
    const createdQuestion = await questionRepository.create({
      authorId: 'user-01',
      content: 'content a question',
      slug: 'new-question',
      title: 'New Question',
    })

    await expect(() =>
      sut.execute({
        questionId: createdQuestion.id,
        userId: 'userNotExists',
      }),
    ).rejects.toBeInstanceOf(UserNotExistsError)
  })

  it('it shouldn`t be possible to delete the question if authorId is different from userId', async () => {
    const user = await userRepository.create({
      email: 'varlesse04@gmail.com',
      name: 'Matteus',
      password: await hash('123456', 8),
    })

    const createdQuestion = await questionRepository.create({
      authorId: 'user-01',
      content: 'content a question',
      slug: 'new-question',
      title: 'New Question',
    })

    await expect(() =>
      sut.execute({
        questionId: createdQuestion.id,
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(UserNotHavePemissionError)
  })
})
