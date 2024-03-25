import { Answer, Prisma } from '@prisma/client'
import { AnswerRepository } from '../answer-repository'
import { randomUUID } from 'crypto'

export class InMemoryAnswerRepository implements AnswerRepository {
  public items: Answer[] = []

  async create(data: Prisma.AnswerUncheckedCreateInput) {
    const answer = {
      id: randomUUID(),
      slug: data.slug,
      content: data.content,
      questionId: data.questionId,
      authorId: data.authorId,
      delete: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(answer)
    return answer
  }

  async findById(id: string) {
    const answer = this.items.find((item) => item.id === id)

    if (!answer) {
      return null
    }
    return answer
  }

  async delete(id: string) {
    const answerInIndex = this.items.findIndex((item) => item.id === id)

    if (answerInIndex) {
      this.items.slice(answerInIndex, 1)
    }
  }
}
