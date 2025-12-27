import { Kernel } from "./kernel"
import { getAlsInvokeKernel } from "./scoped-als"
import { getGlobalKernel } from "./scoped-global"
import { getKernelProvider } from "./scoped-provider"

export async function getInvokeKernel() {
  return (
    (await getKernelProvider()) ??
    getAlsInvokeKernel() ??
    getGlobalKernel()?.scoped() ??
    new Kernel()
  )
}
