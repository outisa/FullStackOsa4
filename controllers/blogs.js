const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  
  try {
    if (request.token !== null) {
      const decodedToken = jwt.verify(request.token, process.env.SECRET)
    
      if (!request.token || !decodedToken.id) {
        return response.status(401).json( { error: 'token missing or invalid' } )
      }    
 
      const user = await User.findById(decodedToken.id)

      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        user: user._id
      })

      if ( blog.likes === null) {
        blog.likes = 0
      }

      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
      return response.json(savedBlog.toJSON())
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
      if (!request.token || !decodedToken.id ) {
        return response.status(401).json( { error: 'token missing or invalid' } )
      }
      const blog = await Blog.findById(request.params.id)
      if (blog === null) {
        return response.status(404).send({ error: 'blog already deleted' })
      }
      if (blog.user.toString() === decodedToken.id) {
        await Blog.findByIdAndDelete(request.params.id)
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
    likes: body.likes
  }

  try {
    const updatetBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatetBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})
module.exports = blogsRouter