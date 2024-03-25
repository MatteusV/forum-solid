import { Prisma } from '@prisma/client'
import { QuestionRepository } from '../question-repository'
import { prisma } from '@/lib/prisma'

export class PrismaQuestionRepository implements QuestionRepository {
  async findById(id: string) {
    const question = await prisma.question.findUnique({
      where: {
        id,
      },
    })

    if (!question) {
      return null
    }

    return question
  }

  async findBySlug(slug: string) {
    const question = await prisma.question.findUnique({
      where: {
        slug,
      },
    })

    if (!question) {
      return null
    }

    return question
  }

  async create(data: Prisma.QuestionUncheckedCreateInput) {
    const question = await prisma.question.create({
      data: {
        content: data.content,
        slug: data.slug,
        title: data.title,
        authorId: data.authorId,
      },
    })

    return question
  }

  async delete(id: string) {
    await prisma.question.update({
      where: {
        id,
      },
      data: {
        delete: true,
      },
    })
  }
}
