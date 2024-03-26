export class BestAnswerNotExistsError extends Error {
  constructor() {
    super('Best answer not exists.')
  }
}
