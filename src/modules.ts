import { tokenizedDependency } from "./dependencies"
import type { Kernel } from "./kernel"
import { getInvokeKernel } from "./kernel-invoke"
import {
  type AllowedDependency,
  BRAND,
  ClassBrand,
  isAllowedLayerInject,
  type ModuleClass,
} from "./layers"
import { Memoizable } from "./memo"
import type { Resolved, Scope } from "./types"

export function createModule<const ModuleName extends string>(
  moduleName: ModuleName,
) {
  function inject<TKey extends ModuleClass<string>>(
    key: AllowedDependency<ModuleName, TKey>,
    scope?: Scope,
  ): Resolved<TKey> {
    if (
      key[BRAND].moduleName !== moduleName &&
      !isAllowedLayerInject(key[BRAND].layerName)
    ) {
      throw new Error(
        `Cross-module ${key[BRAND].layerName} dependency is not allowed.` +
          ` Use a Facade.` +
          ` (Tried to inject a ${key[BRAND].layerName} from ${key[BRAND].moduleName} into ${moduleName})`,
      )
    }

    const token = tokenizedDependency(key, scope ?? key.scope)
    return token as unknown as Resolved<TKey>
  }

  // biome-ignore-start lint/complexity/noStaticOnlyClass: abstract classes
  abstract class BaseClass {
    static InvokeScope: Scope = "invoke"
    static TransientScope: Scope = "transient"
    static SingletonScope: Scope = "singleton"
    inject = inject.bind(this)
  }
  abstract class Facade extends BaseClass {
    static readonly [BRAND] = new ClassBrand(moduleName, "facade")
    static scope: Scope = "transient"
  }
  abstract class Service extends BaseClass {
    static readonly [BRAND] = new ClassBrand(moduleName, "service")
    static scope: Scope = "invoke"
  }
  abstract class Repo extends Memoizable(BaseClass) {
    static readonly [BRAND] = new ClassBrand(moduleName, "repo")
    static scope: Scope = "invoke"
  }
  abstract class Action extends BaseClass {
    static readonly [BRAND] = new ClassBrand(moduleName, "action")
    static scope: Scope = "transient"

    abstract handle(...args: unknown[]): unknown | Promise<unknown>

    static async invoke<
      TAction extends Action,
      TResult = ReturnType<TAction["handle"]>,
    >(
      this: new () => TAction,
      ...args: Parameters<TAction["handle"]>
    ): Promise<TResult> {
      const kernel = await getInvokeKernel()
      // biome-ignore lint/complexity/noThisInStatic: it's fine
      const instance = kernel.create(this)
      return instance.handle(...args) as TResult
    }

    static withKernel<TAction extends Action>(
      this: new () => TAction,
      kernel: Kernel,
    ) {
      // biome-ignore lint/complexity/noThisInStatic: it's fine
      const ActionClass = this
      return {
        async invoke<TResult = ReturnType<TAction["handle"]>>(
          ...args: Parameters<TAction["handle"]>
        ): Promise<TResult> {
          const scoped = kernel.scoped()
          const instance = scoped.create(ActionClass)
          return instance.handle(...args) as TResult
        },
      }
    }
  }
  abstract class Resource extends BaseClass {
    static readonly [BRAND] = new ClassBrand(moduleName, "resource")
    static scope: Scope = "singleton"
  }
  abstract class Singleton extends BaseClass {
    static readonly [BRAND] = new ClassBrand(moduleName, "other")
    static scope: Scope = "singleton"
  }
  abstract class Class extends BaseClass {
    static readonly [BRAND] = new ClassBrand(moduleName, "other")
    static scope: Scope = "transient"
  }
  // biome-ignore-end lint/complexity/noStaticOnlyClass: abstract classes

  return {
    Facade,
    Service,
    Repo,
    Action,
    Resource,
    Singleton,
    Class,
  }
}

function isObject(v: unknown): v is Record<PropertyKey, unknown> {
  return (typeof v === "object" || typeof v === "function") && v !== null
}

type Class = abstract new (...args: readonly unknown[]) => unknown
export function isClass(v: unknown): v is { constructor: Class } {
  return (
    isObject(v) && "constructor" in v && typeof v.constructor === "function"
  )
}
