export abstract class BaseContext<TCtx extends Record<PropertyKey, unknown>> {
  static readonly __vla_layer = "context" as const
  static readonly __vla_module: string = "VlaBuiltIn"
  static readonly __vla_visibility = "global" as const

  static readonly scope = "invoke" as const
  static readonly parentLayers = [
    "action",
    "service",
    "repo",
    "resource",
    "context",
  ] as const
  static readonly unwrap = "value" as const
  declare value: TCtx
}
