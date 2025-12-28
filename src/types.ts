export type Scope = "singleton" | "invoke" | "transient"

export type InstantiableClass<T> = new () => T

export type Token<T = unknown> = InstantiableClass<T> & {
  readonly scope?: Scope
  readonly unwrap?: PropertyKey
}

export type UnwrapKey<TKey> = TKey extends { readonly unwrap: infer K }
  ? K extends PropertyKey
    ? K
    : never
  : never

export type Resolved<TKey extends Token> = [UnwrapKey<TKey>] extends [never]
  ? InstanceType<TKey>
  : UnwrapKey<TKey> extends keyof InstanceType<TKey>
    ? InstanceType<TKey>[UnwrapKey<TKey>]
    : InstanceType<TKey>

export type Layer = "service" | "repo" | "action" | "resource" | "context"
export type Visibility = "public" | "private" | "global" | "module"

export type ModuleClass<
  ModuleName extends string,
  LayerName extends Layer = Layer,
  TVisibility extends Visibility = Visibility,
> = InstantiableClass<unknown> & {
  readonly __vla_layer: LayerName
  readonly __vla_module: ModuleName
  readonly __vla_visibility: TVisibility
  readonly scope: Scope
  readonly unwrap?: PropertyKey
  readonly parentLayers: readonly Layer[]
}

export type VlaInternalKeys = "inject" | "memo" | "devStable"
export type UserSurface<T> = T extends object ? Omit<T, VlaInternalKeys> : T
