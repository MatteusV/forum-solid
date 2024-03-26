export class AnswerNotExistsError extends Error {
  constructor() {
    super('Answer not exists.')
  }
}
