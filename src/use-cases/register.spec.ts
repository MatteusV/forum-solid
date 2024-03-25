import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUserRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able register user', async () => {
    const { user } = await sut.execute({
      email: 'varlesse04@gmail.com',
      name: 'Matteus Varlesse',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be able register user with role instructor', async () => {
    const { user } = await sut.execute({
      email: 'varlesse04@gmail.com',
      name: 'Matteus Varlesse',
      password: '123456',
      role: 'INSTRUCTOR',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      email: 'varlesse04@gmail.com',
      name: 'matteus',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.password)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'varlesse04@gmail.com'

    await sut.execute({
      name: 'Matteus',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'Matteus',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
