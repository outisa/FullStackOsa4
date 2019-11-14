const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

const blog1 = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
]

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

const totalLikes = listHelper.totalLikes

describe('total likes', () => {
  test('empty list is returned right', () => {
    expect(totalLikes([])).toBe(0)
  })

  test('when list contains one blog, likes are returned right', () => {
    expect(totalLikes(blog1)).toBe(7)
  })

  test('likes are calculated correctly with more than one blog', () => {
    expect(totalLikes(blogs)).toBe(36)
  })
}) 

const favoriteBlog = listHelper.favoriteBlog

describe('most liked block', () => {
  test('an empty object is returned when list empty', () => {
    expect(favoriteBlog([])).toEqual({})
  })

  test('an empty object is returned when list empty', () => {
    expect(favoriteBlog(blogs)).toEqual({ title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    likes: 12,})
  })
})

const mostBlogs = listHelper.mostBlogs
const mostLikesAuthor = listHelper.mostLikesAuthor

describe('most blogs', () => {
  test('author  with most blogs is returned', () => {
    console.log(mostBlogs(blogs))
    expect(mostBlogs(blogs)).toEqual({ author: 'Robert C. Martin', blogs: 3 })
  })
  test('author with most likes is returned', () => {
    console.log(mostLikesAuthor(blogs))
    expect(mostLikesAuthor(blogs)).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
  })
})