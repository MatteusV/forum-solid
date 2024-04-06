export class BestAnswerAlreadyExistsError extends Error {
  constructor() {
    super('Best answer already exists.')
  }
}
