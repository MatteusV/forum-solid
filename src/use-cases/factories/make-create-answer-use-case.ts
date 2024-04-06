import { PrismaAnswerRepository } from "@/repositories/prisma/prisma-answer-repository"
import { CreateAnswerQuestionUseCase } from "../create-answer-question"
import { PrismaQuestionRepository } from "@/repositories/prisma/prisma-question-repository"
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository"

export function makeCreateAnswerUseCase() {
  const answerRepository = new PrismaAnswerRepository()
  const questionRepository = new PrismaQuestionRepository()
  const userRepository = new PrismaUserRepository()

  const createAnswerUseCase = new CreateAnswerQuestionUseCase(
    answerRepository,
    questionRepository,
    userRepository,
  )

  return createAnswerUseCase
}
