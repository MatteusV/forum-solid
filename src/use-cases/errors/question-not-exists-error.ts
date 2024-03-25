export class QuestionNotExistsError extends Error {
  constructor() {
    super('Question not exists.')
  }
}
