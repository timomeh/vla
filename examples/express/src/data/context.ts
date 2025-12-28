import type { Request, Response } from "express"
import { Vla } from "vla"

export const AppContext = Vla.createContext<{
  req: Request
  res: Response
}>()
