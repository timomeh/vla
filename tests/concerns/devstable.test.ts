import { describe, expect, test } from "vitest"
import { DevStable } from "../../src/concerns/devstable"

test("adds a devStable() method", () => {
  abstract class BaseClass {}
  expect(DevStable(BaseClass).prototype.devStable).toBeDefined()
})

abstract class BaseClass {}
class Foo extends DevStable(BaseClass) {
  bar = this.devStable("some_key", () => 1)
}

describe("devStable()", () => {
  test("returns the value", () => {
    const foo = new Foo()
    expect(foo.bar).toBe(1)
  })

  test("stores the value in a global", () => {
    new Foo()
    const g = globalThis as unknown as Record<string, unknown>
    expect(g.__vla_dev_stable__some_key).toBe(1)
  })
})
