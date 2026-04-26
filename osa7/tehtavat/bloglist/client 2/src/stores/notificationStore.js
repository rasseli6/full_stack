import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  notification: '',
  actions: {
    setNotification: (message) => {
      set(() => ({ notification: message }))
      setTimeout(() => {
        set(() => ({ notification: '' }))
      }, 7000)
    },
    clearNotification: () => {
      set({ notification: '' })
    }
  }
}))

export const useNotification = () => useNotificationStore((state) => state.notification)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)
