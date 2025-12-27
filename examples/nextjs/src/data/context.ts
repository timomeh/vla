import type { cookies } from "next/headers"
import { Vla } from "vla"

export const AppContext = Vla.createContext<{
  cookies: Awaited<ReturnType<typeof cookies>>
}>()
