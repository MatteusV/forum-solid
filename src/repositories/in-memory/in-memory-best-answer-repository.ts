import { BestAnswer, Prisma } from '@prisma/client'
import { BestAnswerRepository } from '../best-answer-repository'
import { randomUUID } from 'crypto'

export class InMemoryBestAnswerRepository implements BestAnswerRepository {
  public items: BestAnswer[] = []

  async create(data: Prisma.BestAnswerUncheckedCreateInput) {
    const bestAnswer = {
      id: randomUUID(),
      answerId: data.answerId,
      questionId: data.questionId,
      delete: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(bestAnswer)

    return bestAnswer
  }

  async findById(id: string) {
    const bestAnswer = this.items.find((item) => item.id === id)

    if (!bestAnswer) {
      return null
    }

    return bestAnswer
  }

  async delete(id: string) {
    const bestAnswerIndex = this.items.findIndex((item) => item.id === id)
    const bestAnswer = this.items.find((item) => item.id === id)

    if (bestAnswer) {
      const bestAnswerDelete = {
        id: bestAnswer.id,
        answerId: bestAnswer.answerId,
        delete: true,
        questionId: bestAnswer.questionId,
        createdAt: bestAnswer.createdAt,
        updatedAt: new Date(),
      }

      this.items[bestAnswerIndex] = bestAnswerDelete
    }
  }
}
