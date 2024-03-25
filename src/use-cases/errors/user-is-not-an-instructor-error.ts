export class UserIsNotAnInstructorError extends Error {
  constructor() {
    super('User is not an instructor.')
  }
}
