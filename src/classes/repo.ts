import type { Scope } from "../types"

// biome-ignore lint/complexity/noStaticOnlyClass: base class
export abstract class BaseRepo {
  static readonly __vla_layer = "repo" as const
  static readonly __vla_module: string = "none"
  static readonly __vla_visibility = "module" as const

  static readonly scope: Scope = "invoke"
  static readonly parentLayers = ["action", "service", "repo"] as const

  static ScopeInvoke: Scope = "invoke"
  static ScopeTransient: Scope = "transient"
  static ScopeSingleton: Scope = "singleton"
}
