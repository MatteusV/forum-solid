import { Prisma } from '@prisma/client'
import { QuestionCommentRepository } from '../questions-comments-repository'
import { prisma } from '@/lib/prisma'

export class PrismaQuestionCommentRepository
  implements QuestionCommentRepository
{
  async findById(id: string) {
    const comment = await prisma.comment.findUnique({
      where: {
        id,
      },
    })

    if (!comment) {
      return null
    }

    return comment
  }

  async create(data: Prisma.CommentUncheckedCreateInput) {
    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        authorId: data.authorId,
        questionId: data.questionId,
      },
    })

    return comment
  }

  async delete(id: string) {
    await prisma.comment.update({
      where: {
        id,
      },
      data: {
        delete: true,
      },
    })
  }
}
