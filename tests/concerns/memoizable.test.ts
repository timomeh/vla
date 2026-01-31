import { describe, expect, test, vi } from "vitest"
import { Memoizable } from "../../src/concerns/memo"

test("adds a memo() method", () => {
  abstract class BaseClass {}
  expect(Memoizable(BaseClass).prototype.memo).toBeDefined()
})

const memoFn = vi.fn((..._args: unknown[]) => "test")
abstract class BaseClass {}
class Foo extends Memoizable(BaseClass) {
  bar = this.memo(memoFn)
}

describe("memo()", () => {
  test("passes args to the inner function", () => {
    const foo = new Foo()
    foo.bar(1, 2)
    expect(memoFn).toHaveBeenCalledWith(1, 2)
  })

  test("returns the inner function value", () => {
    const foo = new Foo()
    expect(foo.bar()).toBe("test")
  })

  test("calls the inner function once for the same args", () => {
    const foo = new Foo()

    expect(foo.bar("some", "args")).toBe("test")
    expect(memoFn).toHaveBeenCalledTimes(1)

    expect(foo.bar("some", "args")).toBe("test")
    expect(memoFn).toHaveBeenCalledTimes(1)
  })

  test("calls the inner function for different args", () => {
    const foo = new Foo()

    expect(foo.bar("some", "args")).toBe("test")
    expect(memoFn).toHaveBeenCalledTimes(1)

    expect(foo.bar("other", "stuff")).toBe("test")
    expect(memoFn).toHaveBeenCalledTimes(2)
  })
})

describe("memo.fresh()", () => {
  test("has fresh()", () => {
    const foo = new Foo()
    expect(foo.bar.fresh).toBeDefined()
  })

  test("calls the unmemoized function", () => {
    const foo = new Foo()

    foo.bar("some", "args")
    foo.bar("some", "args")
    expect(memoFn).toHaveBeenCalledTimes(1)

    foo.bar.fresh("some", "args")
    expect(memoFn).toHaveBeenCalledTimes(2)
  })

  test("does not clear the cache", () => {
    const foo = new Foo()
    foo.bar("some", "args")
    foo.bar.fresh("some", "args")
    expect(memoFn).toHaveBeenCalledTimes(2)

    foo.bar("some", "args") // memoized call
    expect(memoFn).toHaveBeenCalledTimes(2)
  })
})

describe("memo.preload()", () => {
  // preload is just a way to mark code as "intenionally a dangling promise".
  // it otherwise doesn't behave anything different than calling memo()

  test("has preload()", () => {
    const foo = new Foo()
    expect(foo.bar.preload).toBeDefined()
  })

  test("returns the value", () => {
    const foo = new Foo()
    expect(foo.bar.preload("some", "args")).toBe("test")
  })
})

describe("memo.prime()", () => {
  test("has prime()", () => {
    const foo = new Foo()
    expect(foo.bar.prime).toBeDefined()
  })

  test("sets the memoized value for args", () => {
    const foo = new Foo()
    foo.bar.prime("some", "args").value("override")
    expect(foo.bar("some", "args")).toBe("override")
  })

  test("does not set the memoized value for other args", () => {
    const foo = new Foo()
    foo.bar.prime("some", "args").value("override")
    expect(foo.bar("other", "stuff")).toBe("test")
  })

  test("returns undefined", () => {
    const foo = new Foo()
    expect(foo.bar.prime("some", "args").value("override")).toBe(undefined)
  })
})

describe("memo.bust()", () => {
  test("has bust()", () => {
    const foo = new Foo()
    expect(foo.bar.bust).toBeDefined()
  })

  test("busts the cache for specific args", () => {
    const foo = new Foo()

    foo.bar("some", "args")
    foo.bar("other", "stuff")
    expect(memoFn).toHaveBeenCalledTimes(2)

    foo.bar.bust("some", "args")
    foo.bar("some", "args")
    foo.bar("other", "stuff")
    expect(memoFn).toHaveBeenCalledTimes(3)
  })

  test("returns undefined", () => {
    const foo = new Foo()
    expect(foo.bar.bust("some", "args")).toBe(undefined)
  })
})

describe("memo.bustAll()", () => {
  test("has bustAll()", () => {
    const foo = new Foo()
    expect(foo.bar.bustAll).toBeDefined()
  })

  test("busts the caches for all args", () => {
    const foo = new Foo()

    foo.bar("some", "args")
    foo.bar("other", "stuff")
    expect(memoFn).toHaveBeenCalledTimes(2)

    foo.bar.bustAll()
    foo.bar("some", "args")
    foo.bar("other", "stuff")
    expect(memoFn).toHaveBeenCalledTimes(4)
  })

  test("returns undefined", () => {
    const foo = new Foo()
    expect(foo.bar.bustAll()).toBe(undefined)
  })
})
