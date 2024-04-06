import fastify from 'fastify'
import cookies from '@fastify/cookie'
import jwt from '@fastify/jwt'

import { usersRoutes } from './http/controllers/user/route'
import { env } from './env'
import { questionsRoute } from './http/controllers/question/route'
import { answersRoute } from './http/controllers/answer/route'

export const app = fastify()

app.register(cookies)
app.register(jwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refresh-token',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(usersRoutes)
app.register(questionsRoute)
app.register(answersRoute)
