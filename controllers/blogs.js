const blogsRouter = require('express').Router()
require('express-async-errors')
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')
const { json } = require('express')

blogsRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findOne({ _id: id })
    .populate('user', {username: 1, name: 1})
    .populate('comments', {content: 1})
  if (blog) {
    response.json(blog.toJSON())
  }
})

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
      .populate('user', {username: 1, name: 1})
      .populate('comments', {content: 1})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/:id/comments', async (request, response) => {
  if (request.token !== null) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
    if (!decodedToken.id) {
      return response.status(401).json( { error: 'token missing or invalid' } )
    }
    const comment = new Comment(request.body)
    console.log(comment)
    const id = request.params.id
    const blog = await Blog.findById(id)
    comment.blog = blog._id
    const savedComment = await comment.save()
    blog.comments = blog.comments.concat(savedComment._id)
    await blog.save()
    const savedBlog = await Blog.findOne({ _id: id })
      .populate('user', {username: 1, name: 1})
      .populate('comments', {content: 1})
    
    console.log(savedBlog)
    return response.status(201).json(savedBlog)
  }
  response.status(401).send({ error: 'not signed in' })

})

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)
   
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
 
})

blogsRouter.delete('/:id', async (request, response, next) => {  
  
  if(request.token !== null) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id ) {
      return response.status(401).json( { error: 'token missing or invalid' } )
    }
    const blog = await Blog.findById(request.params.id)
    console.log(blog)
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