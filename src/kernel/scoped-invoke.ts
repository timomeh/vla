import { Kernel } from "./kernel"
import { getKernelFromContext } from "./scoped-als"
import { getKernelFromGlobal } from "./scoped-global"
import { getKernelFromProvider } from "./scoped-provider"

export async function getInvokeKernel() {
  return (
    (await getKernelFromProvider()) ??
    getKernelFromContext() ??
    getKernelFromGlobal()?.scoped() ??
    new Kernel()
  )
}
