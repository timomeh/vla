import { createContext, createModule } from "./factories"
import {
  getKernelFromContext,
  getKernelFromGlobal,
  getKernelFromProvider,
  Kernel,
  setGlobalInvokeKernel,
  setInvokeKernelProvider,
  withKernel,
} from "./kernel"

export * from "./factories"
export * from "./kernel"
export * from "./types"

export const Vla = {
  ...createModule("Vla"),
  createModule,
  createContext,
  withKernel,
  getKernel: {
    fromContext: getKernelFromContext,
    fromGlobal: getKernelFromGlobal,
    fromProvider: getKernelFromProvider,
  },
  setGlobalInvokeKernel,
  setInvokeKernelProvider,
  Kernel,
}
