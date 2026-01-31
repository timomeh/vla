import { describe, expect, test } from "vitest"
import { Kernel, Vla } from "../../src"

class Service extends Vla.Service {
  foo = 1
}

describe("dependency resolution", () => {
  test("returns the default implementation", () => {
    const kernel = new Kernel()
    const service = kernel.get(Service)
    expect(service).toBeInstanceOf(Service)
    expect(service.foo).toBe(1)
  })

  test("can bind an implementation", () => {
    const kernel = new Kernel()
    kernel.bind(
      Service,
      class BarService {
        foo = 2
      },
    )
    const service = kernel.get(Service)
    expect(service).not.toBeInstanceOf(Service)
    expect(service.foo).toBe(2)

    const service2 = kernel.get(Service)
    expect(service).not.toBe(service2)
  })

  test("can bind an implementation with a scope", () => {
    const kernel = new Kernel()
    kernel.bind(
      Service,
      class BarService {
        foo = 2
      },
      "singleton",
    )
    const service = kernel.get(Service)
    expect(service).not.toBeInstanceOf(Service)
    const service2 = kernel.get(Service)
    expect(service).toBe(service2)
  })

  test("can bind an unwrapped value", () => {
    class Resource extends Vla.Resource {
      static readonly unwrap = "foo"
      foo = { bar: 1 }
    }
    const kernel = new Kernel()
    kernel.bindValue(Resource, { bar: 2 })
    const resource = kernel.get(Resource)
    expect(resource).not.toBeInstanceOf(Resource)
    expect(resource).toEqual({ bar: 2 })
  })
})
