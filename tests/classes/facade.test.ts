import { describe, expect, test } from "vitest"
import { Vla } from "../../src"

class TestFacade extends Vla.Facade {}

describe("concerns", () => {
  test("has injectable", () => {
    expect(TestFacade.prototype.inject).toBeDefined()
  })
})

describe("layers", () => {
  test("has the service layer", () => {
    expect(TestFacade.__vla_layer).toBe("service")
  })

  test("has itself and upper layers as parent layer", () => {
    expect(TestFacade.parentLayers).toContain("resource")
    expect(TestFacade.parentLayers).toContain("action")
    expect(TestFacade.parentLayers).toContain("service")
    expect(TestFacade.parentLayers).toContain("repo")
  })
})

describe("visibility", () => {
  test("has global visibility", () => {
    expect(TestFacade.__vla_visibility).toBe("global")
  })
})

describe("scope", () => {
  test("is transient scope", () => {
    expect(TestFacade.scope).toBe("transient")
  })

  test("has ScopeInvoke helper", () => {
    expect(TestFacade.ScopeInvoke).toBe("invoke")
  })

  test("has ScopeTransient helper", () => {
    expect(TestFacade.ScopeTransient).toBe("transient")
  })

  test("has ScopeSingleton helper", () => {
    expect(TestFacade.ScopeSingleton).toBe("singleton")
  })
})
