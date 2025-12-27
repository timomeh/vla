import { AsyncLocalStorage } from "node:async_hooks"
import type { Kernel } from "./kernel"

const als = new AsyncLocalStorage<Kernel>()

export function withKernel<T>(scopedKernel: Kernel, fn: () => T): T {
  return als.run(scopedKernel, fn)
}

export function getAlsInvokeKernel() {
  return als.getStore() ?? null
}
