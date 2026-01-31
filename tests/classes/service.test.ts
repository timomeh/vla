import { describe, expect, test } from "vitest"
import { Vla } from "../../src"

class TestService extends Vla.Service {}

describe("concerns", () => {
  test("has injectable", () => {
    expect(TestService.prototype.inject).toBeDefined()
  })
})

describe("layers", () => {
  test("has the service layer", () => {
    expect(TestService.__vla_layer).toBe("service")
  })

  test("has itself and upper layers as parent layer", () => {
    expect(TestService.parentLayers).toContain("service")
    expect(TestService.parentLayers).toContain("action")
  })
})

describe("visibility", () => {
  test("has module visibility", () => {
    expect(TestService.__vla_visibility).toBe("module")
  })
})

describe("scope", () => {
  test("is invoke scope", () => {
    expect(TestService.scope).toBe("invoke")
  })

  test("has ScopeInvoke helper", () => {
    expect(TestService.ScopeInvoke).toBe("invoke")
  })

  test("has ScopeTransient helper", () => {
    expect(TestService.ScopeTransient).toBe("transient")
  })

  test("has ScopeSingleton helper", () => {
    expect(TestService.ScopeSingleton).toBe("singleton")
  })
})
