import { expect, test } from "vitest"
import { createContext, createModule, Kernel } from "../src"

const AppContext = createContext<{ userId: number }>()

const Test = createModule("Test")

class TestAction extends Test.Action {
  ctx = this.inject(AppContext)

  handle() {
    return this.ctx.userId
  }
}

test("can use built-in context", async () => {
  const kernel = new Kernel()
  const scoped = kernel.scoped().context(AppContext, { userId: 1 })

  await expect(TestAction.withKernel(scoped).invoke()).resolves.toBe(1)
})
