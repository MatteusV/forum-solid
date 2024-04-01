import { Prisma, Question } from '@prisma/client'
import { QuestionRepository } from '../question-repository'
import { randomUUID } from 'crypto'

export class InMemoryQuestionRepository implements QuestionRepository {
  public items: Question[] = []

async fetchQuestions() {
  const questions = this.items

  if(questions.length === 0) {
    return null
  }

  return questions
}

  async findById(id: string) {
    const question = this.items.find((item) => item.id === id)

    if (!question) {
      return null
    }

    return question
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug === slug)

    if (!question) {
      return null
    }

    return question
  }

  async create(data: Prisma.QuestionUncheckedCreateInput) {
    const question = {
      id: randomUUID(),
      title: data.title,
      slug: data.slug,
      content: data.content,
      authorId: data.authorId,
      delete: false,
      bestAnswerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(question)

    return question
  }

  async delete(id: string) {
    const questionIndex = this.items.findIndex((item) => item.id === id)

    const questionDelete = this.items.find((item) => item.id === id)

    if (questionDelete) {
      const question = {
        id: questionDelete.id,
        title: questionDelete.title,
        slug: questionDelete.slug,
        content: questionDelete.content,
        authorId: questionDelete.authorId,
        delete: true,
        bestAnswerId: questionDelete.bestAnswerId,
        createdAt: questionDelete.createdAt,
        updatedAt: new Date(),
      }

      this.items[questionIndex] = question
    }
  }
}
