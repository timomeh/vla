import { Vla } from "vla"
import type { Session } from "../lib/session.server"

export const AppContext = Vla.createContext<{
  session: Session
}>()
