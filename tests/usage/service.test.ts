import { describe, expect, test } from "vitest"
import { Kernel, Vla } from "../../src"

class FooService extends Vla.Service {
  foo = 1
}

test("get the service", () => {
  const kernel = new Kernel()
  const service = kernel.get(FooService)
  expect(service).toBeInstanceOf(FooService)
  expect(service.foo).toBe(1)
})

describe("injected", () => {
  test("can be injected", () => {
    class BarService extends Vla.Service {
      foo = this.inject(FooService)
    }

    const kernel = new Kernel()
    const barService = kernel.get(BarService)
    expect(barService.foo).toBeInstanceOf(FooService)
    expect(barService.foo).toEqual({ foo: 1 })
  })

  test("is invoke-scoped", () => {
    class BarService extends Vla.Service {
      foo = this.inject(FooService)
    }
    class BazService extends Vla.Service {
      foo = this.inject(FooService)
    }

    const kernel = new Kernel()
    const scopedKernel = kernel.scoped()

    const fooService = scopedKernel.get(FooService)
    const barService = scopedKernel.get(BarService)
    const bazService = scopedKernel.get(BazService)
    expect(barService.foo).toBe(fooService)
    expect(barService.foo).toBe(bazService.foo)

    fooService.foo = 2
    expect(barService.foo).toEqual({ foo: 2 })

    const baz2Service = scopedKernel.scoped().get(BazService)
    expect(baz2Service.foo).not.toBe(fooService)
    expect(baz2Service.foo).not.toBe(bazService.foo)
    expect(baz2Service.foo).toEqual({ foo: 1 })
  })

  test("disallows action injection", () => {
    class Action extends Vla.Action {
      handle = async () => 1
    }
    class Service extends Vla.Service {
      // @ts-expect-error
      action = this.inject(Action)
    }
    const kernel = new Kernel()
    expect(() => kernel.get(Service).action).toThrow(
      "Layer service is not allowed to inject action",
    )
  })

  test("allows service injection", () => {
    class FooService extends Vla.Service {}
    class Service extends Vla.Service {
      foo = this.inject(FooService)
    }
    const kernel = new Kernel()
    expect(kernel.get(Service).foo).toBeInstanceOf(FooService)
  })

  test("allows repo injection", () => {
    class Repo extends Vla.Repo {}
    class Service extends Vla.Service {
      repo = this.inject(Repo)
    }
    const kernel = new Kernel()
    expect(kernel.get(Service).repo).toBeInstanceOf(Repo)
  })

  test("allows facade injection", () => {
    class Facade extends Vla.Facade {}
    class Service extends Vla.Service {
      facade = this.inject(Facade)
    }
    const kernel = new Kernel()
    expect(kernel.get(Service).facade).toBeInstanceOf(Facade)
  })

  test("allows resource injection", () => {
    class Resource extends Vla.Resource {}
    class Service extends Vla.Service {
      resource = this.inject(Resource)
    }
    const kernel = new Kernel()
    expect(kernel.get(Service).resource).toBeInstanceOf(Resource)
  })
})
