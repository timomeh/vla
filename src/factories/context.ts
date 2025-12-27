import { BaseContext } from "../classes/context"
import type { ModuleClass } from "../types"

type VlaContext<TCtx extends Record<PropertyKey, unknown>> = ModuleClass<
  "VlaBuiltIn",
  "context"
> & {
  readonly unwrap: "value"
  readonly scope: "invoke"
  readonly __vla_visibility: "global"
  readonly parentLayers: ["action", "service", "repo", "resource", "context"]
} & (abstract new (
    // biome-ignore lint/suspicious/noExplicitAny: needs ts abstract constructor
    ...args: any[]
  ) => { value: TCtx })

/**
 * Create a context that can be injected and accessed in all Actions, Services,
 * Repos, Facades and Resources.
 * @example
 * const AppContext = createContext<{ userId: number }>()
 * const scopedKernel = kernel.scoped().context(AppContext, { userId: 123 })
 * ExampleAction.withKernel(scopedKernel).invoke()
 */
export function createContext<TCtx extends Record<PropertyKey, unknown>>() {
  abstract class Context extends BaseContext<TCtx> {}
  return Context as unknown as VlaContext<TCtx>
}
