import Cookies from 'js-cookie'
import { create } from 'zustand'

const ACCESS_TOKEN = '9594de67-7859-4334-9b37-0e0d402431c6'
const USER_DATA = 'user_data'

export interface AuthUser {
  userName: string
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
    checkCookies: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const checkCookiesAndInitialize = () => {
    const cookieToken = Cookies.get(ACCESS_TOKEN) || ''
    const cookieUser = Cookies.get(USER_DATA)
    
    if ((!cookieToken) || !cookieUser) {
      Cookies.remove(ACCESS_TOKEN)
      Cookies.remove(USER_DATA)
      return { user: null, accessToken: '' }
    }
    return {
      user: cookieUser ? JSON.parse(cookieUser) : null,
      accessToken: cookieToken ? JSON.parse(cookieToken) : '',
    };
  }

  const initialState = checkCookiesAndInitialize()
  
  return {
    auth: {
      user: initialState.user,
      setUser: (user) => {
        if (user) {
          Cookies.set(USER_DATA, JSON.stringify(user), { expires: 1 })
        } else {
          Cookies.remove(USER_DATA)
        }
        set((state) => ({ ...state, auth: { ...state.auth, user } }))
      },
      accessToken: initialState.accessToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          Cookies.set(
            ACCESS_TOKEN,
            JSON.stringify(accessToken),
            { expires: new Date(Date.now() + 60 * 1000) }
          )
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          Cookies.remove(USER_DATA)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
      checkCookies: () => 
        set((state) => {
          const cookieToken = Cookies.get(ACCESS_TOKEN)
          const cookieUser = Cookies.get(USER_DATA)
          
          if ((!cookieToken) || !cookieUser) {
            Cookies.remove(ACCESS_TOKEN)
            Cookies.remove(USER_DATA)
            return {
              ...state,
              auth: { ...state.auth, user: null, accessToken: '' },
            }
          }
          return state
        })
    },
  }
})