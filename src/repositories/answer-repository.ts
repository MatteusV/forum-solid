import { Answer, Prisma } from '@prisma/client'

export interface AnswerRepository {
  create(data: Prisma.AnswerUncheckedCreateInput): Promise<Answer>
  findById(id: string): Promise<Answer | null>
  delete(id: string): Promise<void>
}
