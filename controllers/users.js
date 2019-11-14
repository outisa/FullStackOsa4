const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response, next) => {
  const users = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1})
  response.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body
    if (body.password.length < 3 || body.password.includes(' ')) {
      return response.status(400).json({ error: 'password is missing or includes a space' })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    
    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    })

    const newUser = await user.save()
    response.json(newUser)

  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter