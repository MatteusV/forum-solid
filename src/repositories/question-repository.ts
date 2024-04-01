import { Prisma, Question } from '@prisma/client'

export interface QuestionRepository {
  findById(id: string): Promise<Question | null>
  findBySlug(slug: string): Promise<Question | null>
  create(data: Prisma.QuestionUncheckedCreateInput): Promise<Question>
  delete(id: string): Promise<void>
  fetchQuestions(): Promise<Question[] | null>
}
