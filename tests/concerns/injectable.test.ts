import { describe, expect, test } from "vitest"
import { createInjectable } from "../../src/concerns/injectable"

const Injectable = createInjectable<"Foo">()

class InjectedClass {
  static readonly __vla_layer = "service" as const
  static readonly __vla_module = "Foo"
  static readonly __vla_visibility = "module" as const
  static readonly parentLayers = ["action", "service"] as const
  static readonly scope = "singleton"

  foo() {}
}

class CrossModuleInjectedClass {
  static readonly __vla_layer = "service" as const
  static readonly __vla_module = "Bar"
  static readonly __vla_visibility = "module" as const
  static readonly parentLayers = ["action", "service"] as const
  static readonly scope = "singleton"

  foo() {}
}

class ParentLayerInjectedClass {
  static readonly __vla_layer = "foo_layer" as const
  static readonly __vla_module = "Foo"
  static readonly __vla_visibility = "module" as const
  static readonly parentLayers = ["some", "thing"] as const
  static readonly scope = "singleton"

  foo() {}
}

class BaseClass {
  static readonly __vla_layer = "service" as const
  static readonly __vla_module = "Foo"
  static readonly __vla_visibility = "module" as const
  static readonly parentLayers = ["action", "service"] as const

  foo() {}
}
class Foo extends Injectable(BaseClass) {}

test("adds an injectable() method", () => {
  abstract class BaseClass {}
  expect(Injectable(BaseClass).prototype.inject).toBeDefined()
})

describe("inject()", () => {
  test("returns a tokenized dependency", () => {
    const foo = new Foo()

    // the tokenized dependency is untokenized in the Kernel,
    // and the types pretend as if its already untokenized (but here it's not)
    // @ts-expect-error
    expect(foo.inject(InjectedClass).token).toBe(InjectedClass)
  })

  test("defaults to the scope defined by the injected class", () => {
    const foo = new Foo()

    // @ts-expect-error
    expect(foo.inject(InjectedClass).scope).toBe("singleton")
  })

  test("can override the injected scope", () => {
    const foo = new Foo()

    // @ts-expect-error
    expect(foo.inject(InjectedClass, "invoke").scope).toBe("invoke")
  })

  test("throws when a protected class is injected", () => {
    const foo = new Foo()

    // @ts-expect-error
    expect(() => foo.inject(CrossModuleInjectedClass)).toThrowError(
      "Cross-module",
    )
  })

  test("throws when a parent layer is injected", () => {
    const foo = new Foo()

    // @ts-expect-error
    expect(() => foo.inject(ParentLayerInjectedClass)).toThrowError(
      "Layer service is not allowed to inject foo_layer",
    )
  })
})
