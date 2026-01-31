import { describe, expect, test } from "vitest"
import { Kernel, Vla } from "../../src"

class FooService extends Vla.Service {
  foo = 1
}

class FooAction extends Vla.Action {
  service = this.inject(FooService)

  async handle() {
    return this.service.foo
  }
}

test("can invoke without a kernel", async () => {
  await expect(FooAction.invoke()).resolves.toBe(1)
})

test("can invoke with a kernel", async () => {
  const kernel = new Kernel()
  await expect(FooAction.withKernel(kernel).invoke()).resolves.toBe(1)
})

describe("injection", () => {
  test("disallows action injection", () => {
    class FooAction extends Vla.Action {
      handle = async () => 1
    }
    class Action extends Vla.Action {
      // @ts-expect-error
      action = this.inject(FooAction)
      handle = async () => 1
    }
    const kernel = new Kernel()
    expect(() => kernel.get(Action).action).toThrow(
      "Layer action is not allowed to inject action",
    )
  })

  test("allows service injection", () => {
    class Service extends Vla.Service {}
    class Action extends Vla.Action {
      service = this.inject(Service)
      handle = async () => 1
    }
    const kernel = new Kernel()
    expect(kernel.get(Action).service).toBeInstanceOf(Service)
  })

  test("allows repo injection", () => {
    class Repo extends Vla.Repo {}
    class Action extends Vla.Action {
      repo = this.inject(Repo)
      handle = async () => 1
    }
    const kernel = new Kernel()
    expect(kernel.get(Action).repo).toBeInstanceOf(Repo)
  })

  test("allows facade injection", () => {
    class Facade extends Vla.Facade {}
    class Action extends Vla.Action {
      facade = this.inject(Facade)
      handle = async () => 1
    }
    const kernel = new Kernel()
    expect(kernel.get(Action).facade).toBeInstanceOf(Facade)
  })

  test("allows resource injection", () => {
    class Resource extends Vla.Resource {}
    class Action extends Vla.Action {
      resource = this.inject(Resource)
      handle = async () => 1
    }
    const kernel = new Kernel()
    expect(kernel.get(Action).resource).toBeInstanceOf(Resource)
  })
})
