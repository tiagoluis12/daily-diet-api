import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { env } from './env'
import { mealsRoutes } from './routes/meals'
import { usersRoutes } from './routes/users'

export const app = fastify()

app.register(cookie)

app.register(usersRoutes, {
  prefix: 'users',
})

app.register(mealsRoutes, {
  prefix: 'meals',
})
