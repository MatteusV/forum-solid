import { QuestionRepository } from "@/repositories/question-repository"
import { Question } from "@prisma/client"
import { QuestionNotExistsError } from "./errors/question-not-exists-error"

interface GetQuestionByIdUseCaseRequest {
  questionId: string
}

interface GetQuestionByIdUseCaseResponse {
  question: Question
}

export class GetQuestionByIdUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({questionId}: GetQuestionByIdUseCaseRequest): Promise<GetQuestionByIdUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if(!question) {
      throw new QuestionNotExistsError()
    }

    return {
      question
    }
  }
}