import { BestAnswer, Prisma } from '@prisma/client'

export interface FindByIdsProps {
  questionId: string
  answerId: string
}

export interface BestAnswerRepository {
  create(data: Prisma.BestAnswerUncheckedCreateInput): Promise<BestAnswer>
  findById(id: string): Promise<BestAnswer | null>
  delete(id: string): Promise<void>
  findByUniqueIds(data: FindByIdsProps): Promise<BestAnswer | null>
}
