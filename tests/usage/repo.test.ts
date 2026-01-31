import { describe, expect, test, vi } from "vitest"
import { Kernel, Vla } from "../../src"

class FooRepo extends Vla.Repo {
  foo = 1
}

test("get the repo", () => {
  const kernel = new Kernel()
  const repo = kernel.get(FooRepo)
  expect(repo).toBeInstanceOf(FooRepo)
  expect(repo.foo).toBe(1)
})

describe("injected", () => {
  test("can be injected", () => {
    class BarService extends Vla.Service {
      foo = this.inject(FooRepo)
    }

    const kernel = new Kernel()
    const barService = kernel.get(BarService)
    expect(barService.foo).toBeInstanceOf(FooRepo)
    expect(barService.foo).toEqual({ foo: 1 })
  })

  test("is invoke-scoped", () => {
    class BarService extends Vla.Service {
      repo = this.inject(FooRepo)
    }
    class BazService extends Vla.Service {
      repo = this.inject(FooRepo)
    }

    const kernel = new Kernel()
    const scopedKernel = kernel.scoped()

    const fooRepo = scopedKernel.get(FooRepo)
    const barService = scopedKernel.get(BarService)
    const bazService = scopedKernel.get(BazService)
    expect(barService.repo).toBe(fooRepo)
    expect(barService.repo).toBe(bazService.repo)

    fooRepo.foo = 2
    expect(barService.repo).toEqual({ foo: 2 })

    const baz2Service = scopedKernel.scoped().get(BazService)
    expect(baz2Service.repo).not.toBe(fooRepo)
    expect(baz2Service.repo).not.toBe(bazService.repo)
    expect(baz2Service.repo).toEqual({ foo: 1 })
  })

  test("keeps invoke-scoped memoization", () => {
    const memoFn = vi.fn((..._args: unknown[]) => 1)
    class MemoRepo extends Vla.Repo {
      foo = this.memo(memoFn)
    }

    class BarService extends Vla.Service {
      repo = this.inject(MemoRepo)
    }
    class BazService extends Vla.Service {
      repo = this.inject(MemoRepo)
    }

    const kernel = new Kernel()
    const scopedKernel = kernel.scoped()
    const barService = scopedKernel.get(BarService)
    const bazService = scopedKernel.get(BazService)

    expect(barService.repo.foo()).toBe(1)
    expect(bazService.repo.foo()).toBe(1)
    expect(memoFn).toHaveBeenCalledTimes(1)

    const baz2Service = scopedKernel.scoped().get(BazService)
    expect(baz2Service.repo.foo()).toBe(1)
    expect(memoFn).toHaveBeenCalledTimes(2)
  })

  test("disallows action injection", () => {
    class Action extends Vla.Action {
      handle = async () => 1
    }
    class Repo extends Vla.Repo {
      // @ts-expect-error
      action = this.inject(Action)
    }
    const kernel = new Kernel()
    expect(() => kernel.get(Repo).action).toThrow(
      "Layer repo is not allowed to inject action",
    )
  })

  test("disallows service injection", () => {
    class FooService extends Vla.Service {}
    class Repo extends Vla.Repo {
      // @ts-expect-error
      foo = this.inject(FooService)
    }
    const kernel = new Kernel()
    expect(() => kernel.get(Repo).foo).toThrow(
      "Layer repo is not allowed to inject service",
    )
  })

  test("allows repo injection", () => {
    class FooRepo extends Vla.Repo {}
    class Repo extends Vla.Repo {
      foo = this.inject(FooRepo)
    }
    const kernel = new Kernel()
    expect(kernel.get(Repo).foo).toBeInstanceOf(FooRepo)
  })

  test("allows facade injection", () => {
    class Facade extends Vla.Facade {}
    class Repo extends Vla.Repo {
      facade = this.inject(Facade)
    }
    const kernel = new Kernel()
    expect(kernel.get(Repo).facade).toBeInstanceOf(Facade)
  })

  test("allows resource injection", () => {
    class Resource extends Vla.Resource {}
    class Repo extends Vla.Repo {
      resource = this.inject(Resource)
    }
    const kernel = new Kernel()
    expect(kernel.get(Repo).resource).toBeInstanceOf(Resource)
  })
})
