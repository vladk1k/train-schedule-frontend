import axios from "axios"
import Cookies from "js-cookie"
import { useAuthStore } from "../store/authStore"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const token =
      useAuthStore.getState().auth.accessToken || Cookies.get("9594de67-7859-4334-9b37-0e0d402431c6") // delete cookie later

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/sign-in"
    }
    return Promise.reject(error)
  }
)

export const useApi = () => {
    const registration = (data: { username: string; password: string }) => {
      return api.post("/auth/register", data)
    }
    const login = (data: { username: string; password: string }) => {   
      return api.post("/auth/login", data)
    }
    const getSchedules = () => {
      return api.get("/schedules")
    }
    const createSchedule = (data: unknown) => {
      return api.post("/schedules", data)
    }
    const updateSchedule = (id: number, data: unknown) => {
      return api.put(`/schedules/${id}`, data)
    }
    const deleteSchedule = (id: number) => {
      return api.delete(`/schedules/${id}`)
    }
    return { registration, login, getSchedules, createSchedule, updateSchedule, deleteSchedule }
}