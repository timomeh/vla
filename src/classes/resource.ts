import type { Scope } from "../types"

// biome-ignore lint/complexity/noStaticOnlyClass: base class
export abstract class BaseResource {
  static readonly __vla_layer = "resource" as const
  static readonly __vla_module: string = "none"
  static readonly __vla_visibility = "global" as const

  static readonly scope: Scope = "singleton"
  static readonly parentLayers = [
    "action",
    "service",
    "repo",
    "resource",
  ] as const

  static ScopeInvoke: Scope = "invoke"
  static ScopeTransient: Scope = "transient"
  static ScopeSingleton: Scope = "singleton"
}
