import { it, expect, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'
import moment from 'moment'

describe('Meals Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      username: 'tiago',
      email: 'tiago@gmail.com',
      password: '12345678',
      confirmPassword: '12345678',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Breakfast',
        description: 'Toast, Mango Juice and fruits',
        inDiet: true,
        date: new Date(),
      })
      .expect(201)
  })

  it('should be able to edit a meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      username: 'tiago',
      email: 'tiago@gmail.com',
      password: '12345678',
      confirmPassword: '12345678',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Breakfast',
      description: 'Toast, Mango Juice and fruits',
      inDiet: true,
      date: new Date(),
    })

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        name: 'Breakfast',
        description: 'Toast, Orange Juice',
        inDiet: true,
        date: new Date(),
      })
      .expect(200)

    const mealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)

    expect(mealResponse.body).toEqual({
      id: mealId,
      name: 'Breakfast',
      description: 'Cake',
      inDiet: true,
      date: moment(mealResponse.body.date).format(),
      createdAt: mealResponse.body.createdAt,
      updatedAt: mealResponse.body.updatedAt,
    })
  })

  it('should be able to get all melas', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      username: 'tiago',
      email: 'tiago@gmail.com',
      password: '12345678',
      confirmPassword: '12345678',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Breakfast',
      description: 'Toast, Mango Juice and fruits',
      inDiet: true,
      date: new Date(),
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Lunch',
      description: 'Rice, Beans and Meat',
      inDiet: false,
      date: new Date(),
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Break',
      description: 'Bread, Orange Juice and fruits',
      inDiet: true,
      date: new Date(),
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Dinner',
      description: 'Rice, Beans and Meat',
      inDiet: true,
      date: new Date(),
    })

    const mealsListResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(mealsListResponse.body).toEqual({
      total: 4,
      meals: [
        {
          id: mealsListResponse.body.meals[0].id,
          name: 'Breakfast',
          description: 'Toast, Mango Juice and fruits',
          inDiet: true,
          date: moment(mealsListResponse.body.meals[0].date).format(),
          createdAt: mealsListResponse.body.meals[0].createdAt,
          updatedAt: mealsListResponse.body.meals[0].updatedAt,
        },
        {
          id: mealsListResponse.body.meals[1].id,
          name: 'Lunch',
          description: 'Rice, Beans and Meat',
          inDiet: false,
          date: moment(mealsListResponse.body.meals[1].date).format(),
          createdAt: mealsListResponse.body.meals[1].createdAt,
          updatedAt: mealsListResponse.body.meals[1].updatedAt,
        },
        {
          id: mealsListResponse.body.meals[2].id,
          name: 'Break',
          description: 'Bread, Orange Juice and fruits',
          inDiet: true,
          date: moment(mealsListResponse.body.meals[2].date).format(),
          createdAt: mealsListResponse.body.meals[2].createdAt,
          updatedAt: mealsListResponse.body.meals[2].updatedAt,
        },
        {
          id: mealsListResponse.body.meals[3].id,
          name: 'Dinner',
          description: 'Rice, Beans and Meat',
          inDiet: true,
          date: moment(mealsListResponse.body.meals[3].date).format(),
          createdAt: mealsListResponse.body.meals[3].createdAt,
          updatedAt: mealsListResponse.body.meals[3].updatedAt,
        },
      ],
    })
  })

  it('should be able to get a meal by id', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      username: 'tiago',
      email: 'tiago@gmail.com',
      password: '12345678',
      confirmPassword: '12345678',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Breakfast',
      description: 'Toast, Mango Juice and fruits',
      inDiet: true,
      date: new Date(),
    })

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    const mealId = listMealsResponse.body.meals[0].id

    const mealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(mealResponse.body).toEqual({
      id: mealId,
      name: 'Breakfast',
      description: 'Toast, Mango Juice and fruits',
      inDiet: true,
      date: moment(mealResponse.body.date).format(),
      createdAt: mealResponse.body.createdAt,
      updatedAt: mealResponse.body.updatedAt,
    })
  })

  it('should be able to delete meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      username: 'tiago',
      email: 'tiago@gmail.com',
      password: '12345678',
      confirmPassword: '12345678',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Breakfast',
      description: 'Toast, Mango Juice and fruits',
      inDiet: true,
      date: new Date(),
    })

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(204)
  })
})
