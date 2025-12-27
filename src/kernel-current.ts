import type { Kernel } from "./kernel"

type CurrentKernelFn = () => Kernel | Promise<Kernel>
let currentKernelFn: CurrentKernelFn | null = null

export function setCurrentKernelFn(fnKernel: CurrentKernelFn) {
  currentKernelFn = fnKernel
}

export async function getCurrentKernelFromFn() {
  return currentKernelFn ? await currentKernelFn() : undefined
}
