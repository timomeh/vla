import { Kernel } from "./kernel"
import { getAlsKernel } from "./kernel-als"
import { getCurrentKernelFromFn } from "./kernel-current"
import { getGlobalKernel } from "./kernel-global"

export async function getInvokeKernel() {
  return (
    (await getCurrentKernelFromFn()) ??
    getAlsKernel() ??
    getGlobalKernel()?.scoped() ??
    new Kernel()
  )
}
