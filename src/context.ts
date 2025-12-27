import { BRAND, ClassBrand, type ModuleClass } from "./layers"
import type { Scope } from "./types"

type VlaContext<TCtx extends Record<PropertyKey, unknown>> = ModuleClass<
  "VlaGlobal",
  "context"
> & {
  readonly unwrap: "value"
} & (abstract new (
    // biome-ignore lint/suspicious/noExplicitAny: needs ts abstract constructor
    ...args: any[]
  ) => { value: TCtx })

export function createContext<TCtx extends Record<PropertyKey, unknown>>() {
  abstract class Context {
    static readonly [BRAND] = new ClassBrand("VlaGlobal", "context")
    static scope: Scope = "invoke"
    static readonly unwrap = "value" as const
    declare value: TCtx
  }
  return Context as unknown as VlaContext<TCtx>
}
