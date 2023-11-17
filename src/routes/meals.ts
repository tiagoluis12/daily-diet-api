import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto, { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import moment from 'moment'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const meals = await knex('meals').where('session_id', sessionId).select()

      const formattedMeals = meals.map((meal) => {
        const formattedDate = moment(meal.date).format()

        return {
          id: meal.id,
          name: meal.name,
          description: meal.description,
          inDiet: !!meal.inDiet,
          date: formattedDate,
          updatedAt: meal.updated_at,
          createdAt: meal.created_at,
        }
      })

      return {
        total: meals.length,
        meals: formattedMeals,
      }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const meal = await knex('meals')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      if (!meal) {
        return reply.status(404).send({
          error: 'Meal not found',
        })
      }

      return {
        date: moment(meal?.date).format(),
        id: meal.id,
        name: meal.name,
        description: meal.description,
        inDiet: !!meal.inDiet,
        updatedAt: meal.updated_at,
        createdAt: meal.created_at,
      }
    },
  )

  app.post('/', async (request, replay) => {
    const createMealSchema = z.object({
      name: z.string().min(3, { message: 'Minimum 3 characters' }),
      description: z
        .string()
        .min(3, { message: 'Minimum 3 characters for description' }),
      inDiet: z.boolean(),
      date: z.coerce.date(),
    })

    const { name, description, inDiet, date } = createMealSchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId
    if (!sessionId) {
      sessionId = randomUUID()

      replay.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 100 * 60 * 60 * 24 * 7, // 7 Days
      })
    }

    await knex('meals').insert({
      id: crypto.randomUUID(),
      name,
      description,
      inDiet,
      date,
      session_id: sessionId,
    })
    return replay.status(201).send()
  })

  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const deleteMealSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = deleteMealSchema.parse(request.params)
      const { sessionId } = request.cookies

      const deleteMeal = await knex('meals')
        .where({ id, session_id: sessionId })
        .delete()

      if (deleteMeal === 0) {
        return reply.status(404).send({
          error: 'Meal not found',
        })
      }
      return reply.status(204).send()
    },
  )

  app.put('/:id', async (request, reply) => {
    const updateMealSchema = z.object({
      name: z.string().min(3, { message: 'Minimum 3 characters for name' }),
      description: z
        .string()
        .min(3, { message: 'Minimum 3 characters for description' }),
      inDiet: z.boolean(),
      date: z.coerce.date(),
    })

    const updateMealSchemaParams = z.object({
      id: z.string().uuid(),
    })
    const { name, description, inDiet, date } = updateMealSchema.parse(
      request.body,
    )
    const { id } = updateMealSchemaParams.parse(request.params)
    const sessionId = request.cookies.sessionId

    const meal = await knex('meals')
      .where({ id, session_id: sessionId })
      .first()

    if (!meal) {
      return reply.status(404).send({
        error: 'Meal not found',
      })
    }
    await knex('meals')
      .where({ id: meal.id })
      .update({ name, description, inDiet, date, updated_at: knex.fn.now() }, [
        'id',
        'name',
        'description',
        'inDiet',
        'date',
        'updated_at',
      ])
    return reply.status(204).send()
  })
}
