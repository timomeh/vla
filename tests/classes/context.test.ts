import { describe, expect, test } from "vitest"
import { Vla } from "../../src"

const TestContext = Vla.createContext<{ foo: number }>()

describe("layers", () => {
  test("has the context layer", () => {
    expect(TestContext.__vla_layer).toBe("context")
  })

  test("has itself and all layers as parent layer", () => {
    expect(TestContext.parentLayers).toContain("action")
    expect(TestContext.parentLayers).toContain("service")
    expect(TestContext.parentLayers).toContain("repo")
    expect(TestContext.parentLayers).toContain("resource")
    expect(TestContext.parentLayers).toContain("context")
  })
})

describe("visibility", () => {
  test("has global visibility", () => {
    expect(TestContext.__vla_visibility).toBe("global")
  })
})

describe("scope", () => {
  test("is invoke scope", () => {
    expect(TestContext.scope).toBe("invoke")
  })

  test("has no ScopeInvoke helper", () => {
    expect(TestContext).not.toHaveProperty("ScopeInvoke")
  })

  test("has no ScopeTransient helper", () => {
    expect(TestContext).not.toHaveProperty("ScopeTransient")
  })

  test("has no ScopeSingleton helper", () => {
    expect(TestContext).not.toHaveProperty("ScopeSingleton")
  })
})

describe("unwrap", () => {
  test("sets 'value' as unwrap key by default", () => {
    expect(TestContext.unwrap).toBe("value")
  })
})
