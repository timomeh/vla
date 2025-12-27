import type { Kernel } from "./kernel"

type CurrentKernelFn = () => Kernel | Promise<Kernel>
let currentKernelFn: CurrentKernelFn | null = null

export function setInvokeKernelProvider(fn: CurrentKernelFn) {
  currentKernelFn = fn
}

export async function getKernelProvider() {
  return currentKernelFn ? await currentKernelFn() : undefined
}
