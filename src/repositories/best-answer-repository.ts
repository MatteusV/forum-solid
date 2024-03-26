import { BestAnswer, Prisma } from '@prisma/client'

export interface BestAnswerRepository {
  create(data: Prisma.BestAnswerUncheckedCreateInput): Promise<BestAnswer>
  findById(id: string): Promise<BestAnswer | null>
  delete(id: string): Promise<void>
}
