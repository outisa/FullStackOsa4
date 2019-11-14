const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name==='JdonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  }

}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    request.token = token
    next()
    
  } else {
   request.token = null
   next()
  } 
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor
}