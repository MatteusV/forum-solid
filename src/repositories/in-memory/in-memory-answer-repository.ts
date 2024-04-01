import { Answer, Prisma } from '@prisma/client'
import { AnswerRepository } from '../answer-repository'
import { randomUUID } from 'crypto'

export class InMemoryAnswerRepository implements AnswerRepository {
  public items: Answer[] = []


  async fetchByQuestionId(questionId: string): Promise<{ id: string; slug: string; content: string; delete: boolean; createdAt: Date; updatedAt: Date; authorId: string; questionId: string }[] | null> {
    const answers = this.items.filter((item) => item.questionId === questionId)

    if(!answers) {
      return null
    }

    return answers
  }



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
    const answerDelete = this.items.find((item) => item.id === id)

    if (answerDelete) {
      const answer = {
        id: answerDelete.id,
        slug: answerDelete.slug,
        content: answerDelete.content,
        createdAt: answerDelete.createdAt,
        delete: true,
        updatedAt: new Date(),
        authorId: answerDelete.authorId,
        questionId: answerDelete.questionId,
      }

      this.items[answerInIndex] = answer
    }
  }
}
