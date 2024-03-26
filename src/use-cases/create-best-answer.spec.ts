import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryQuestionRepository } from '@/repositories/in-memory/in-memory-question-repository'
import { InMemoryAnswerRepository } from '@/repositories/in-memory/in-memory-answer-repository'
import { QuestionNotExistsError } from './errors/question-not-exists-error'
import { UserNotExistsError } from './errors/user-not-exists-error'
import { CreateBestAnswerUseCase } from './create-best-answer'
import { InMemoryBestAnswerRepository } from '@/repositories/in-memory/in-memory-best-answer-repository'
import { UserNotHavePemissionError } from './errors/user-not-have-permission-error'
import { AnswerNotExistsError } from './errors/answer-not-exists-error'

let usersRepository: InMemoryUserRepository
let answerRepository: InMemoryAnswerRepository
let questionRepository: InMemoryQuestionRepository
let bestAnswerRepository: InMemoryBestAnswerRepository
let sut: CreateBestAnswerUseCase

describe('Create Best Answer Question Use Case', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    usersRepository = new InMemoryUserRepository()
    answerRepository = new InMemoryAnswerRepository()
    bestAnswerRepository = new InMemoryBestAnswerRepository()
    sut = new CreateBestAnswerUseCase(
      questionRepository,
      usersRepository,
      bestAnswerRepository,
      answerRepository,
    )
  })

  it('should be able create a best answer', async () => {
    const user = await usersRepository.create({
      email: 'varlesse04@gmail.com',
      name: 'matteus',
      password: await hash('123456', 8),
    })

    const question = await questionRepository.create({
      authorId: user.id,
      content: 'content a question',
      title: 'Nova pergunta',
      slug: 'nova-pergunta',
    })

    const answer = await answerRepository.create({
      authorId: 'user-01',
      content: 'content a answer',
      questionId: question.id,
      slug: 'slug-a-answer',
    })

    const { bestAnswer } = await sut.execute({
      answerId: answer.id,
      questionId: question.id,
      userId: user.id,
    })

    expect(bestAnswer.id).toEqual(expect.any(String))
  })

  it('should not be possible to create a better answer without the userId being the same as the authorId of the question', async () => {
    const user = await usersRepository.create({
      email: 'varlesse04@gmail.com',
      name: 'matteus',
      password: await hash('123456', 8),
    })

    const question = await questionRepository.create({
      authorId: 'user-02',
      content: 'content a question',
      title: 'Nova pergunta',
      slug: 'nova-pergunta',
    })

    const answer = await answerRepository.create({
      authorId: 'user-01',
      content: 'content a answer',
      questionId: question.id,
      slug: 'slug-a-answer',
    })

    await expect(() =>
      sut.execute({
        answerId: answer.id,
        questionId: question.id,
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(UserNotHavePemissionError)
  })

  it('should not be able to create a better answer without the userId', async () => {
    const question = await questionRepository.create({
      authorId: 'user-02',
      content: 'content a question',
      title: 'Nova pergunta',
      slug: 'nova-pergunta',
    })

    const answer = await answerRepository.create({
      authorId: 'user-01',
      content: 'content a answer',
      questionId: question.id,
      slug: 'slug-a-answer',
    })

    await expect(() =>
      sut.execute({
        answerId: answer.id,
        questionId: question.id,
        userId: 'userNotExits',
      }),
    ).rejects.toBeInstanceOf(UserNotExistsError)
  })

  it('should not be able to create a better answer without the answerId', async () => {
    const user = await usersRepository.create({
      email: 'varlesse04@gmail.com',
      name: 'matteus',
      password: await hash('123456', 8),
    })

    const question = await questionRepository.create({
      authorId: user.id,
      content: 'content a question',
      title: 'Nova pergunta',
      slug: 'nova-pergunta',
    })

    await expect(() =>
      sut.execute({
        answerId: 'answerNotExits',
        questionId: question.id,
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(AnswerNotExistsError)
  })

  it('should not be possible to create a better answer without the questionId', async () => {
    const user = await usersRepository.create({
      email: 'varlesse04@gmail.com',
      name: 'matteus',
      password: await hash('123456', 8),
    })

    const answer = await answerRepository.create({
      authorId: 'user-01',
      content: 'content a answer',
      questionId: 'question-01',
      slug: 'slug-a-answer',
    })

    await expect(() =>
      sut.execute({
        answerId: answer.id,
        questionId: 'questioNotExits',
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(QuestionNotExistsError)
  })
})
