const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const total = blogs.reduce(function(sum, blog) {
    return sum + blog.likes
  }, 0)
  return total
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  const mostLikes = blogs.reduce(function(biggest, blog) {
    return biggest > blog.likes ? biggest :blog.likes
  })
  const blog = blogs.filter(blog => blog.likes === mostLikes)
  const likedBlog = 
    { 
      title: blog[0].title, 
      author: (blog[0].author), 
      likes: (blog[0].likes),
    }

  return likedBlog  
}
function groupBy(array, property) {
  return array.reduce(function(acc, obj) {
    const key = obj[property]
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(obj)
    return acc
  }, {})
}
const mostBlogs = (blogs) => {
  const authors = groupBy(blogs, 'author')
  
  const authorList = []
  for (x in authors) {
    const author = {
      author: (authors[x][0].author),
      blogs: authors[x].length,
    }
    authorList.push(author)
  }
  const mostBlogs = authorList.reduce(function(biggest, blogs) {
    return biggest > blogs.blogs ? biggest :blogs.blogs
  })

  const returnObject = authorList.filter(author => author.blogs === mostBlogs)
  return returnObject[0]
}

const mostLikesAuthor = (blogs) => {
  const authors = groupBy(blogs, 'author')
  
  const authorList = []
  for (x in authors) {
    let sum = 0
    for (y in authors[x])  {
      sum += authors[x][y].likes
    }
    const author = {
      author: (authors[x][0].author),
      likes: sum,
    }
    authorList.push(author)
  }
  const mostLikesAuthor = authorList.reduce(function(biggest, blogs) {
    return biggest > blogs.likes ? biggest :blogs.likes
  })

  const returnObject = authorList.filter(author => author.likes === mostLikesAuthor)
  return returnObject[0]
}
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikesAuthor,
}