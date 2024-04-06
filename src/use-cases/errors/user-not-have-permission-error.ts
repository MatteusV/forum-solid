export class UserNotHavePermissionError extends Error {
  constructor() {
    super('User not have pemission.')
  }
}
