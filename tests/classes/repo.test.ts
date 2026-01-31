import { describe, expect, test } from "vitest"
import { Vla } from "../../src"

class TestRepo extends Vla.Repo {}

describe("concerns", () => {
  test("has memoizable", () => {
    expect(TestRepo.prototype.memo).toBeDefined()
  })

  test("has injectable", () => {
    expect(TestRepo.prototype.inject).toBeDefined()
  })
})

describe("layers", () => {
  test("has the repo layer", () => {
    expect(TestRepo.__vla_layer).toBe("repo")
  })

  test("has itself and upper layers as parent layer", () => {
    expect(TestRepo.parentLayers).toContain("repo")
    expect(TestRepo.parentLayers).toContain("service")
    expect(TestRepo.parentLayers).toContain("action")
  })
})

describe("visibility", () => {
  test("has module visibility", () => {
    expect(TestRepo.__vla_visibility).toBe("module")
  })
})

describe("scope", () => {
  test("is invoke scope", () => {
    expect(TestRepo.scope).toBe("invoke")
  })

  test("has ScopeInvoke helper", () => {
    expect(TestRepo.ScopeInvoke).toBe("invoke")
  })

  test("has ScopeTransient helper", () => {
    expect(TestRepo.ScopeTransient).toBe("transient")
  })

  test("has ScopeSingleton helper", () => {
    expect(TestRepo.ScopeSingleton).toBe("singleton")
  })
})
