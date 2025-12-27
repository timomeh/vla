import type { Scope } from "../types"

// biome-ignore lint/complexity/noStaticOnlyClass: base class
export abstract class BaseService {
  static readonly __vla_layer = "service" as const
  static readonly __vla_module: string = "none"
  static readonly __vla_visibility = "module" as const

  static readonly scope: Scope = "invoke"
  static readonly parentLayers = ["action", "service"] as const

  static ScopeInvoke: Scope = "invoke"
  static ScopeTransient: Scope = "transient"
  static ScopeSingleton: Scope = "singleton"
}
