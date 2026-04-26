import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create((set) => ({
  blogs: [],

  actions: {
    initializeBlogs: async () => {
      const blogs = await blogService.getAll()
      set({ blogs })
    },

    createBlog: async (blogObject, user) => {
      const returnedBlog = await blogService.create(blogObject)

      set((state) => ({
        blogs: state.blogs.concat({ ...returnedBlog, user })
      }))

      return returnedBlog
    },

    replaceBlog: (updatedBlog) => {
      set((state) => ({
        blogs: state.blogs.map((blog) => (blog.id !== updatedBlog.id ? blog : updatedBlog))
      }))
    },

    removeBlogById: (id) => {
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog.id !== id)
      }))
    },
    likeBlog: async (blog) => {
      const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      set((state) => ({
        blogs: state.blogs.map((b) => (b.id !== blog.id ? b : { ...returnedBlog, user: blog.user }))
      }))
    },
    deleteBlog: async (id) => {
      await blogService.remove(id)
      set((state) => ({ blogs: state.blogs.filter((blog) => blog.id !== id) }))
    }
  }
}))

export const useBlogs = () => useBlogStore((state) => state.blogs)
export const useBlogActions = () => useBlogStore((state) => state.actions)
