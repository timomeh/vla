import { describe, expect, test } from "vitest"
import { Kernel, Vla } from "../../src"

const TestContext = Vla.createContext<{ foo: number }>()

test("set a context on a kernel", () => {
  const kernel = new Kernel()
  kernel.context(TestContext, { foo: 1 })
})

test("get the unwrapped context", () => {
  const kernel = new Kernel()
  kernel.context(TestContext, { foo: 1 })

  const ctx = kernel.get(TestContext)
  expect(ctx).toEqual({ foo: 1 })
})

describe("injected", () => {
  test("can be injected", () => {
    class TestService extends Vla.Service {
      ctx = this.inject(TestContext)
    }

    const kernel = new Kernel()
    kernel.context(TestContext, { foo: 1 })
    expect(kernel.get(TestService).ctx).toEqual({ foo: 1 })
  })

  test("is invoke-scoped", () => {
    class FooService extends Vla.Service {
      ctx = this.inject(TestContext)
    }
    class BarService extends Vla.Service {
      ctx = this.inject(TestContext)
    }

    const kernel = new Kernel()
    const scopedKernel = kernel.scoped()
    const ctxValue = { foo: 1 }
    scopedKernel.context(TestContext, ctxValue)

    const fooService = scopedKernel.get(FooService)
    const barService = scopedKernel.get(BarService)
    expect(fooService.ctx).toBe(ctxValue)
    expect(barService.ctx).toBe(ctxValue)

    const nextScopedKernel = kernel.scoped()
    const nextCtxValue = { foo: 2 }
    nextScopedKernel.context(TestContext, nextCtxValue)

    const nextFooService = nextScopedKernel.get(FooService)
    expect(nextFooService.ctx).toBe(nextCtxValue)

    const prevFooService = scopedKernel.get(FooService)
    expect(prevFooService.ctx).toBe(ctxValue)
  })
})
