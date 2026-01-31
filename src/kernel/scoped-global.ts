import type { Kernel } from "./kernel"

let globalKernel: Kernel | null = null

export function setGlobalInvokeKernel(kernel: Kernel) {
  globalKernel = kernel
}

export function getKernelFromGlobal() {
  return globalKernel
}
