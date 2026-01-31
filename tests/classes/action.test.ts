import { describe, expect, test, vi } from "vitest"
import { Kernel, Vla } from "../../src"

const handleFn = vi.fn((..._args: unknown[]) => Promise.resolve(1))

class TestAction extends Vla.Action {
  handle = handleFn
}

describe("concerns", () => {
  test("has injectable", () => {
    expect(TestAction.prototype.inject).toBeDefined()
  })
})

describe("layers", () => {
  test("has the action layer", () => {
    expect(TestAction.__vla_layer).toBe("action")
  })

  test("has no parent layers", () => {
    expect(TestAction.parentLayers).toHaveLength(0)
  })
})

describe("visibility", () => {
  test("has private visibility", () => {
    expect(TestAction.__vla_visibility).toBe("private")
  })
})

describe("scope", () => {
  test("is transient scope", () => {
    expect(TestAction.scope).toBe("transient")
  })

  test("has no ScopeInvoke helper", () => {
    expect(TestAction).not.toHaveProperty("ScopeInvoke")
  })

  test("has no ScopeTransient helper", () => {
    expect(TestAction).not.toHaveProperty("ScopeTransient")
  })

  test("has no ScopeSingleton helper", () => {
    expect(TestAction).not.toHaveProperty("ScopeSingleton")
  })
})

describe("invoke()", () => {
  test("has an invoke static method", () => {
    expect(TestAction.invoke).toBeDefined()
  })

  test("calls the handle method with args", async () => {
    await TestAction.invoke("some", "args")
    expect(handleFn).toHaveBeenCalledWith("some", "args")
  })

  test("returns the value returned from handle()", async () => {
    await expect(TestAction.invoke("some", "args")).resolves.toBe(1)
  })
})

describe("withKernel()", () => {
  test("has a withKernel static method", () => {
    expect(TestAction.withKernel).toBeDefined()
  })

  test("returns an invoke method", () => {
    expect(TestAction.withKernel(new Kernel()).invoke).toBeDefined()
  })

  test("calls the handle method with args", async () => {
    await expect(
      TestAction.withKernel(new Kernel()).invoke("some", "args"),
    ).resolves.toBe(1)
    expect(handleFn).toHaveBeenCalledWith("some", "args")
  })
})
