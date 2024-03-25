import { Comment, Prisma } from '@prisma/client'
import { QuestionCommentRepository } from '../questions-comments-repository'
import { randomUUID } from 'crypto'

export class InMemoryQuestionComments implements QuestionCommentRepository {
  public items: Comment[] = []

  async findById(id: string) {
    const comment = this.items.find((item) => item.id === id)

    if (!comment) {
      return null
    }

    return comment
  }

  async create(data: Prisma.CommentUncheckedCreateInput) {
    const comment = {
      id: randomUUID(),
      content: data.content,
      authorId: data.authorId,
      questionId: data.questionId,
      delete: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(comment)

    return comment
  }

  async delete(id: string) {
    const commentIndex = this.items.findIndex((item) => item.id === id)

    if (commentIndex) {
      this.items.splice(commentIndex, 1)
    }
  }
}
