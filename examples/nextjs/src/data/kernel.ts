import { cookies } from "next/headers"
import { cache } from "react"
import { Kernel, Vla } from "vla"
import { AppContext } from "./context"

export const kernel = new Kernel()

Vla.setInvokeKernelProvider(
  cache(async () => {
    return kernel.scoped().context(AppContext, {
      cookies: await cookies(),
    })
  }),
)
