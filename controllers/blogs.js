const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)
  
  try {
    if (request.token !== null) {
      const decodedToken = jwt.verify(request.token, process.env.SECRET)
    
      if (!decodedToken.id) {
        return response.status(401).json( { error: 'token missing or invalid' } )
      }    
 
      const user = await User.findById(decodedToken.id)

      blog.user = user.id

      if (!blog.likes) {
        blog.likes = 0
      }

      const bl = await blog.save()
      user.blogs = user.blogs.concat(bl._id)
      await user.save()
      const savedBlog = await Blog.findOne({ _id: bl._id }).populate('user', {username: 1, name: 1})
      return response.status(201).json(savedBlog)
    }
    response.status(401).send({ error: 'not signed in' })
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {  
  try {
    if(request.token !== null) {
      const decodedToken = jwt.verify(request.token, process.env.SECRET)
      if (!decodedToken.id ) {
        return response.status(401).json( { error: 'token missing or invalid' } )
      }
      const blog = await Blog.findById(request.params.id)
      if (blog === null) {
        return response.status(404).send({ error: 'blog already deleted' })
      }
      if (blog.user.toString() === decodedToken.id) {
        await Blog.findByIdAndRemove(request.params.id)
        return response.status(204).end()

      }
      return response.status(401).send({ error: 'not authorized' }).end()
    }
    response.status(401).send({ error: 'not signed in' })
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  
  const body = request.body

  const blog = {
    user: body.user,
    likes: body.likes,
    author: body.author,
    title: body.title,
    body: body.url
  }

  
  const update = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  const updatetBlog = await Blog.findOne({ _id: update._id }).populate('user', {username: 1, name: 1})
  response.json(updatetBlog.toJSON())
  
})
module.exports = blogsRouter