import type { InstantiableClass, Scope } from "./types"

export const BRAND = Symbol("_vla_brand")

export type Layer =
  | "facade"
  | "service"
  | "repo"
  | "action"
  | "resource"
  | "context"
  | "other"

type Branded<ModuleName extends string, LayerName extends Layer> = {
  readonly [BRAND]: ClassBrand<ModuleName, LayerName>
}
type Scoped = {
  readonly scope: Scope
}
type Wrapped = {
  readonly unwrap?: PropertyKey
}
export type ModuleClass<
  ModuleName extends string,
  LayerName extends Layer = Layer,
> = InstantiableClass<unknown> &
  Branded<ModuleName, LayerName> &
  Scoped &
  Wrapped

const allowedCrossModuleLayers = ["facade", "resource", "context"] as const
type AllowedCrossModuleLayers = (typeof allowedCrossModuleLayers)[number]

type LayerOf<T> = T extends ModuleClass<string, infer L> ? L : never
type ForbiddenCrossModuleClass = ModuleClass<
  string,
  Exclude<Layer, AllowedCrossModuleLayers>
>
export type AllowedDependency<
  ModuleName extends string,
  Key,
> = Key extends ModuleClass<ModuleName, Layer>
  ? Key
  : Key extends ForbiddenCrossModuleClass
    ? `Cross-module ${Capitalize<LayerOf<Key>>} injection is not allowed. Use a Facade.`
    : Key

export class ClassBrand<ModuleName extends string, LayerName extends Layer> {
  constructor(
    readonly moduleName: ModuleName,
    readonly layerName: LayerName,
  ) {}
}

export function isAllowedLayerInject(injectedLayer: Layer) {
  return (allowedCrossModuleLayers as readonly Layer[]).includes(injectedLayer)
}
