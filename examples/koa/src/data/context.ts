import type { Context } from "koa"
import { Vla } from "vla"

export const AppContext = Vla.createContext<{
  ctx: Context
}>()
