import { create } from 'zustand'

const useNotificationStore = create((set) => ({
    notification: '',
    timeoutId: null,
    actions: {
    setNotification: (message) => {
        set(() => ({ notification: message }))
        setTimeout(() => {
            set(() => ({ notification: ''}))
        }, 5000)
    }}})
)

export const useNotification = () => useNotificationStore((state) => state.notification)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)