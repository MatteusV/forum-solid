import { Prisma } from '@prisma/client'
import { BestAnswerRepository, FindByIdsProps } from '../best-answer-repository'
import { prisma } from '@/lib/prisma'

export class PrismaBestAnswerRepository implements BestAnswerRepository {
  async create(data: Prisma.BestAnswerUncheckedCreateInput) {
    const bestAnswer = await prisma.bestAnswer.create({
      data,
    })

    return bestAnswer
  }

  async findById(id: string) {
    const bestAnswer = await prisma.bestAnswer.findUnique({
      where: {
        id,
      },
    })

    if (!bestAnswer) {
      return null
    }

    return bestAnswer
  }

  async delete(id: string) {
    await prisma.bestAnswer.update({
      where: {
        id,
      },
      data: {
        delete: true,
      },
    })
  }

  async findByUniqueIds(data: FindByIdsProps) {
    const { answerId, questionId } = data
    const bestAnswer = await prisma.bestAnswer.findUnique({
      where: {
        questionId_answerId: {
          questionId,
          answerId,
        },
      },
    })

    if (!bestAnswer) {
      return null
    }

    return bestAnswer
  }
}
