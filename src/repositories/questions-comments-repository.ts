import { Prisma, Comment } from '@prisma/client'

export interface QuestionCommentRepository {
  findById(id: string): Promise<Comment | null>
  create(data: Prisma.CommentUncheckedCreateInput): Promise<Comment>
  delete(id: string): Promise<void>
  fetchMany(): Promise<Comment[] | null>
}
