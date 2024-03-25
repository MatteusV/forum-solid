import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryQuestionRepository } from '@/repositories/in-memory/in-memory-question-repository'
import { UserNotExistsError } from './errors/user-not-exists-error'
import { CreateQuestionCommentUseCase } from './create-question-comment'
import { InMemoryQuestionComments } from '@/repositories/in-memory/in-memory-question-comments-repository'
import { QuestionNotExistsError } from './errors/question-not-exists-error'

let usersRepository: InMemoryUserRepository
let questionRepository: InMemoryQuestionRepository
let questionCommentRepository: InMemoryQuestionComments
let sut: CreateQuestionCommentUseCase

describe('Create Question Comment Use Case', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    usersRepository = new InMemoryUserRepository()
    questionCommentRepository = new InMemoryQuestionComments()
    sut = new CreateQuestionCommentUseCase(
      questionCommentRepository,
      usersRepository,
      questionRepository,
    )
  })

  it('should be able create a comment in question', async () => {
    const user = await usersRepository.create({
      email: 'varlesse04@gmail.com',
      name: 'matteus',
      password: await hash('123456', 8),
    })

    const question = await questionRepository.create({
      authorId: 'user-01',
      content: 'content a question',
      slug: 'new-question',
      title: 'New Question',
    })

    const { comment } = await sut.execute({
      authorId: user.id,
      content: 'Comment a question',
      questionId: question.id,
    })

    expect(comment.id).toEqual(expect.any(String))
  })

  it('not should be able without author id', async () => {
    const question = await questionRepository.create({
      authorId: 'user-01',
      content: 'content a question',
      slug: 'new-question',
      title: 'New Question',
    })

    await expect(() =>
      sut.execute({
        authorId: 'userNotExists',
        content: 'content the a question',
        questionId: question.id,
      }),
    ).rejects.toBeInstanceOf(UserNotExistsError)
  })

  it('not should be able without question id', async () => {
    const user = await usersRepository.create({
      email: 'varlesse04@gmail.com',
      name: 'matteus',
      password: await hash('123456', 8),
    })

    await expect(() =>
      sut.execute({
        authorId: user.id,
        content: 'content the a question',
        questionId: 'notExists',
      }),
    ).rejects.toBeInstanceOf(QuestionNotExistsError)
  })
})
