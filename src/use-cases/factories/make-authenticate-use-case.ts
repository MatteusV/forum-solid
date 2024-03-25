import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUserRepository()

  const registerUseCase = new AuthenticateUseCase(usersRepository)

  return registerUseCase
}
