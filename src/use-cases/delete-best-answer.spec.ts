import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryBestAnswerRepository } from '@/repositories/in-memory/in-memory-best-answer-repository'
import { DeleteBestAnswerUseCase } from './delete-best-answer'
import { BestAnswerNotExistsError } from './errors/best-answer-not-exists-error'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { InMemoryQuestionRepository } from '@/repositories/in-memory/in-memory-question-repository'
import { InMemoryAnswerRepository } from '@/repositories/in-memory/in-memory-answer-repository'
import { hash } from 'bcryptjs'
import { UserNotExistsError } from './errors/user-not-exists-error'
import { UserNotHavePemissionError } from './errors/user-not-have-permission-error'

let bestAnswerRepository: InMemoryBestAnswerRepository
let userRepository: InMemoryUserRepository
let questionRepository: InMemoryQuestionRepository
let answerRepository: InMemoryAnswerRepository
let sut: DeleteBestAnswerUseCase

describe('Delete Best Answer Use Case', () => {
  beforeEach(() => {
    bestAnswerRepository = new InMemoryBestAnswerRepository()
    userRepository = new InMemoryUserRepository()
    questionRepository = new InMemoryQuestionRepository()
    answerRepository = new InMemoryAnswerRepository()
    sut = new DeleteBestAnswerUseCase(
      bestAnswerRepository,
      userRepository,
      answerRepository,
      questionRepository,
    )
  })

  it('should be able delete a best answer', async () => {
    const user = await userRepository.create({
      email: 'varlesse04@gmail.com',
      name: 'Matteus',
      password: await hash('123456', 8),
    })

    const question = await questionRepository.create({
      authorId: user.id,
      content: 'content',
      slug: 'slug',
      title: 'title',
    })

    const answer = await answerRepository.create({
      authorId: user.id,
      content: 'content',
      questionId: question.id,
      slug: 'slug',
    })

    const bestAnswer = await bestAnswerRepository.create({
      answerId: answer.id,
      questionId: question.id,
    })

    await sut.execute({
      bestAnswerId: bestAnswer.id,
      userId: user.id,
    })

    const bestAnswerDelete = await bestAnswerRepository.findById(bestAnswer.id)
    expect(bestAnswerDelete!.delete).toEqual(true)
  })

  it('not should be able delete a best answer without bestAnswerId', async () => {
    const user = await userRepository.create({
      email: 'varlesse04@gmail.com',
      name: 'Matteus',
      password: await hash('123456', 8),
    })
    await expect(() =>
      sut.execute({ bestAnswerId: 'answerNotExists', userId: user.id }),
    ).rejects.toBeInstanceOf(BestAnswerNotExistsError)
  })

  it('not should be able delete a best answer without userId', async () => {
    const question = await questionRepository.create({
      authorId: 'user-01',
      content: 'content',
      slug: 'slug',
      title: 'title',
    })

    const answer = await answerRepository.create({
      authorId: 'user-01',
      content: 'content',
      questionId: question.id,
      slug: 'slug',
    })

    const bestAnswer = await bestAnswerRepository.create({
      answerId: answer.id,
      questionId: question.id,
    })

    await expect(() =>
      sut.execute({
        bestAnswerId: bestAnswer.id,
        userId: 'userNotExists',
      }),
    ).rejects.toBeInstanceOf(UserNotExistsError)
  })

  it('it shouldn`t be possible to delete the best answer if the userId is not the same as the answer author', async () => {
    const user = await userRepository.create({
      email: 'varlesse04@gmail.com',
      name: 'Matteus',
      password: await hash('123456', 8),
    })

    const question = await questionRepository.create({
      authorId: user.id,
      content: 'content',
      slug: 'slug',
      title: 'title',
    })

    const answer = await answerRepository.create({
      authorId: 'user-01',
      content: 'content',
      questionId: question.id,
      slug: 'slug',
    })

    const bestAnswer = await bestAnswerRepository.create({
      answerId: answer.id,
      questionId: question.id,
    })

    await expect(() =>
      sut.execute({
        bestAnswerId: bestAnswer.id,
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(UserNotHavePemissionError)
  })
})
