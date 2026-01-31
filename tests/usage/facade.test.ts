import { describe, expect, test } from "vitest"
import { Kernel, Vla } from "../../src"

class FooFacade extends Vla.Facade {
  foo = 1
}

test("get the facade", () => {
  const kernel = new Kernel()
  const facade = kernel.get(FooFacade)
  expect(facade).toBeInstanceOf(FooFacade)
  expect(facade.foo).toBe(1)
})

describe("injected", () => {
  test("can be injected", () => {
    class BarService extends Vla.Service {
      foo = this.inject(FooFacade)
    }

    const kernel = new Kernel()
    const barService = kernel.get(BarService)
    expect(barService.foo).toBeInstanceOf(FooFacade)
    expect(barService.foo).toEqual({ foo: 1 })
  })

  test("is transient-scoped", () => {
    class BarService extends Vla.Service {
      foo = this.inject(FooFacade)
    }
    class BazService extends Vla.Service {
      foo = this.inject(FooFacade)
    }

    const kernel = new Kernel()
    const scopedKernel = kernel.scoped()

    const fooFacade = scopedKernel.get(FooFacade)
    const barService = scopedKernel.get(BarService)
    const bazService = scopedKernel.get(BazService)
    expect(barService.foo).not.toBe(fooFacade)
    expect(barService.foo).not.toBe(bazService.foo)

    fooFacade.foo = 2
    expect(barService.foo).toEqual({ foo: 1 })
  })

  test("disallows action injection", () => {
    class Action extends Vla.Action {
      handle = async () => 1
    }
    class Facade extends Vla.Facade {
      // @ts-expect-error
      action = this.inject(Action)
    }
    const kernel = new Kernel()
    expect(() => kernel.get(Facade).action).toThrow(
      "Layer service is not allowed to inject action",
    )
  })

  test("allows service injection", () => {
    class FooService extends Vla.Service {}
    class Facade extends Vla.Facade {
      foo = this.inject(FooService)
    }
    const kernel = new Kernel()
    expect(kernel.get(Facade).foo).toBeInstanceOf(FooService)
  })

  test("allows repo injection", () => {
    class FooRepo extends Vla.Repo {}
    class Facade extends Vla.Facade {
      foo = this.inject(FooRepo)
    }
    const kernel = new Kernel()
    expect(kernel.get(Facade).foo).toBeInstanceOf(FooRepo)
  })

  test("allows facade injection", () => {
    class FooFacade extends Vla.Facade {}
    class Facade extends Vla.Facade {
      foo = this.inject(FooFacade)
    }
    const kernel = new Kernel()
    expect(kernel.get(Facade).foo).toBeInstanceOf(FooFacade)
  })

  test("allows resource injection", () => {
    class Resource extends Vla.Resource {}
    class Facade extends Vla.Facade {
      resource = this.inject(Resource)
    }
    const kernel = new Kernel()
    expect(kernel.get(Facade).resource).toBeInstanceOf(Resource)
  })
})
