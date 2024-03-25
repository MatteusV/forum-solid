import { Prisma } from '@prisma/client'
import { AnswerRepository } from '../answer-repository'
import { prisma } from '@/lib/prisma'

export class PrismaAnswerRepository implements AnswerRepository {
  async create(data: Prisma.AnswerUncheckedCreateInput) {
    const answer = await prisma.answer.create({
      data: {
        content: data.content,
        slug: data.slug,
        authorId: data.authorId,
        questionId: data.questionId,
      },
    })

    return answer
  }

  async findById(id: string) {
    const answer = await prisma.answer.findUnique({
      where: {
        id,
      },
    })

    if (!answer) {
      return null
    }

    return answer
  }

  async delete(id: string) {
    await prisma.answer.update({
      where: {
        id,
      },
      data: {
        delete: true,
      },
    })
  }
}
