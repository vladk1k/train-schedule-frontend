import { useEffect } from "react"
import { useRouter } from "@tanstack/react-router"
import { useAuthStore } from "@/store/authStore"

export function useAuthGuard() {
  const { auth } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!auth.accessToken) {
      router.navigate({ to: "/login" })
    }
  }, [auth.accessToken, router])

  return !!auth.accessToken
}