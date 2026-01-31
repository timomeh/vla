import { describe, expect, test } from "vitest"
import { Kernel, Vla } from "../../src"

class TestResource extends Vla.Resource {
  foo = 1
}

describe("non-unwrapped", () => {
  test("returns the resource instance", () => {
    const kernel = new Kernel()
    expect(kernel.get(TestResource)).toEqual({ foo: 1 })
    expect(kernel.get(TestResource)).toBeInstanceOf(TestResource)
  })

  test("can be injected", async () => {
    class TestService extends Vla.Service {
      resource = this.inject(TestResource)
    }

    const kernel = new Kernel()
    const service = kernel.get(TestService)
    expect(service.resource).toEqual({ foo: 1 })
    expect(service.resource).toBeInstanceOf(TestResource)
  })
})

describe("unwrapped", () => {
  class UnwrappedResource extends Vla.Resource {
    static readonly unwrap = "foo"
    foo = 1
  }

  test("returns the unwrapped resource", () => {
    const kernel = new Kernel()
    expect(kernel.get(UnwrappedResource)).toEqual(1)
  })

  test("can be injected", async () => {
    class TestService extends Vla.Service {
      resource = this.inject(UnwrappedResource)
    }

    const kernel = new Kernel()
    const service = kernel.get(TestService)
    expect(service.resource).toEqual(1)
  })
})

describe("injected", () => {
  test("is a singleton", () => {
    class FooService extends Vla.Service {
      resource = this.inject(TestResource)
    }
    class BarService extends Vla.Service {
      resource = this.inject(TestResource)
    }

    const kernel = new Kernel()
    const fooService = kernel.scoped().get(FooService)
    const barService = kernel.scoped().scoped().get(BarService)
    const testResource = kernel.get(TestResource)

    expect(fooService.resource).toBe(testResource)
    expect(fooService.resource).toBe(barService.resource)

    testResource.foo = 2
    expect(fooService.resource).toEqual({ foo: 2 })
  })

  test("disallows action injection", () => {
    class Action extends Vla.Action {
      handle = async () => 1
    }
    class Resource extends Vla.Resource {
      // @ts-expect-error
      action = this.inject(Action)
    }
    const kernel = new Kernel()
    expect(() => kernel.get(Resource).action).toThrow(
      "Layer resource is not allowed to inject action",
    )
  })

  test("disallows service injection", () => {
    class FooService extends Vla.Service {}
    class Resource extends Vla.Resource {
      // @ts-expect-error
      service = this.inject(FooService)
    }
    const kernel = new Kernel()
    expect(() => kernel.get(Resource).service).toThrow(
      "Layer resource is not allowed to inject service",
    )
  })

  test("disallows repo injection", () => {
    class Repo extends Vla.Repo {}
    class Resource extends Vla.Resource {
      // @ts-expect-error
      repo = this.inject(Repo)
    }
    const kernel = new Kernel()
    expect(() => kernel.get(Resource).repo).toThrow(
      "Layer resource is not allowed to inject repo",
    )
  })

  test("allows facade injection", () => {
    class Facade extends Vla.Facade {}
    class Resource extends Vla.Resource {
      facade = this.inject(Facade)
    }
    const kernel = new Kernel()
    expect(kernel.get(Resource).facade).toBeInstanceOf(Facade)
  })

  test("allows resource injection", () => {
    class FooResource extends Vla.Resource {}
    class Resource extends Vla.Resource {
      foo = this.inject(FooResource)
    }
    const kernel = new Kernel()
    expect(kernel.get(Resource).foo).toBeInstanceOf(FooResource)
  })
})
