import { useSession } from "@tanstack/react-start/server"

type SessionData = {
  userId?: string
}

export type Session = Awaited<ReturnType<typeof useAppSession>>

export function useAppSession() {
  return useSession<SessionData>({
    name: "app-session",
    password: "change-this-to-a-random-string-of-at-least-32-characters",
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    },
  })
}
