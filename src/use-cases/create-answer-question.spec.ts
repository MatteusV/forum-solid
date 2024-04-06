import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryQuestionRepository } from '@/repositories/in-memory/in-memory-question-repository'
import { CreateAnswerQuestionUseCase } from './create-answer-question'
import { InMemoryAnswerRepository } from '@/repositories/in-memory/in-memory-answer-repository'
import { UserIsNotAnInstructorError } from './errors/user-is-not-an-instructor-error'
import { QuestionNotExistsError } from './errors/question-not-exists-error'
import { UserNotExistsError } from './errors/user-not-exists-error'

let usersRepository: InMemoryUserRepository
let answerRepository: InMemoryAnswerRepository
let questionRepository: InMemoryQuestionRepository
let sut: CreateAnswerQuestionUseCase

describe('Create Answer Question Use Case', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    usersRepository = new InMemoryUserRepository()
    answerRepository = new InMemoryAnswerRepository()
    sut = new CreateAnswerQuestionUseCase(
      answerRepository,
      questionRepository,
      usersRepository,
    )
  })

  it('should be able create a answer', async () => {
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

    const { answer } = await sut.execute({
      authorId: user.id,
      content: 'content a answer',
      questionId: question.id,
    })

    expect(answer.id).toEqual(expect.any(String))
  })

  it('not should be able create a answer without question', async () => {
    const user = await usersRepository.create({
      email: 'varlesse04@gmail.com',
      name: 'matteus',
      password: await hash('123456', 8),
      role: 'INSTRUCTOR',
    })

    await expect(() =>
      sut.execute({
        content: 'content a answer',
        questionId: 'questionNotExists',
        authorId: user.id,
      }),
    ).rejects.toBeInstanceOf(QuestionNotExistsError)
  })

  it('not should be able create a answer with user role a student', async () => {
    const user = await usersRepository.create({
      email: 'varlesse04@gmail.com',
      name: 'matteus',
      password: await hash('123456', 8),
      role: 'STUDENT',
    })

    const question = await questionRepository.create({
      authorId: 'user-01',
      content: 'content a question',
      title: 'Nova pergunta',
      slug: 'nova-pergunta',
    })

    await expect(() =>
      sut.execute({
        content: 'content a answer',
        questionId: question.id,
        authorId: user.id,
      }),
    ).rejects.toBeInstanceOf(UserIsNotAnInstructorError)
  })

  it('not should be able create a answer without user', async () => {
    const question = await questionRepository.create({
      authorId: 'user-01',
      content: 'content a question',
      title: 'Nova pergunta',
      slug: 'nova-pergunta',
    })

    await expect(() =>
      sut.execute({
        content: 'content a answer',
        questionId: question.id,
        authorId: 'userNotExists',
      }),
    ).rejects.toBeInstanceOf(UserNotExistsError)
  })
})
