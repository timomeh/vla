import { expect, test } from "vitest"
import { Kernel, Vla } from "../src"

const AppContext = Vla.createContext<{ userId: number }>()

class TestAction extends Vla.Action {
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
