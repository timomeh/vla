import { createMiddleware, createStart } from "@tanstack/react-start"
import { Vla } from "vla"
import { AppContext } from "./data/context"
import { kernel } from "./data/kernel"
import { useAppSession } from "./lib/session.server"

const vlaMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await useAppSession()

  const scopedKernel = kernel.scoped().context(AppContext, {
    session,
  })

  return Vla.withKernel(scopedKernel, () => next())
})

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [vlaMiddleware],
  }
})
