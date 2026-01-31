import { describe, expect, test } from "vitest"
import { createModule, Kernel } from "../src"

test("returns classes for module", () => {
  const mod = createModule("Foo")

  expect(mod.Facade).toHaveProperty("__vla_module", "Foo")
  expect(mod.Service).toHaveProperty("__vla_module", "Foo")
  expect(mod.Repo).toHaveProperty("__vla_module", "Foo")
  expect(mod.Action).toHaveProperty("__vla_module", "Foo")
  expect(mod.Resource).toHaveProperty("__vla_module", "Foo")
})

test("returns concerns", () => {
  const mod = createModule("Foo")

  expect(mod.Memoizable).toBeDefined()
  expect(mod.DevStable).toBeDefined()
})

describe("cross-module injections", () => {
  test("forbids deep injections", async () => {
    const Foo = createModule("Foo")
    const Bar = createModule("Bar")

    class FooRepo extends Foo.Repo {}
    class BarService extends Bar.Service {
      // @ts-expect-error
      foo = this.inject(FooRepo)
    }

    const kernel = new Kernel()
    expect(() => kernel.get(BarService)).toThrow(
      "Cross-module repo dependency is not allowed",
    )
  })

  test("allows facades", async () => {
    const Foo = createModule("Foo")
    const Bar = createModule("Bar")

    class FooFacade extends Foo.Facade {}
    class BarService extends Bar.Service {
      foo = this.inject(FooFacade)
    }

    const kernel = new Kernel()
    expect(kernel.get(BarService).foo).toBeInstanceOf(FooFacade)
  })
})
