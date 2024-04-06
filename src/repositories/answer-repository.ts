import { Answer, Prisma } from '@prisma/client'

export interface AnswerRepository {
  create(data: Prisma.AnswerUncheckedCreateInput): Promise<Answer>
  findById(id: string): Promise<Answer | null>
  delete(id: string): Promise<void>
<<<<<<< HEAD
  fetchByQuestionId(questionId: string): Promise<Answer[] | null>
=======
  fetchMany(): Promise<Answer[] | null>
>>>>>>> 1e895fc (feat: create HTTP route for questions and create use-case the 'get-question-by-id')
}
