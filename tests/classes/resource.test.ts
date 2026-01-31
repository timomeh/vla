import { describe, expect, test } from "vitest"
import { Vla } from "../../src"

class TestResource extends Vla.Resource {}

describe("concerns", () => {
  test("has injectable", () => {
    expect(TestResource.prototype.inject).toBeDefined()
  })

  test("has devStable", () => {
    expect(TestResource.prototype.devStable).toBeDefined()
  })
})

describe("layers", () => {
  test("has the resource layer", () => {
    expect(TestResource.__vla_layer).toBe("resource")
  })

  test("has itself and upper layers as parent layer", () => {
    expect(TestResource.parentLayers).toContain("resource")
    expect(TestResource.parentLayers).toContain("action")
    expect(TestResource.parentLayers).toContain("service")
    expect(TestResource.parentLayers).toContain("repo")
  })
})

describe("visibility", () => {
  test("has global visibility", () => {
    expect(TestResource.__vla_visibility).toBe("global")
  })
})

describe("scope", () => {
  test("is singleton scope", () => {
    expect(TestResource.scope).toBe("singleton")
  })

  test("has ScopeInvoke helper", () => {
    expect(TestResource.ScopeInvoke).toBe("invoke")
  })

  test("has ScopeTransient helper", () => {
    expect(TestResource.ScopeTransient).toBe("transient")
  })

  test("has ScopeSingleton helper", () => {
    expect(TestResource.ScopeSingleton).toBe("singleton")
  })
})
