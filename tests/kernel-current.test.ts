import { beforeEach, expect, test, vi } from "vitest"
import { Kernel, Vla } from "../src"

const users: Record<string, { id: string; name: string }> = {
  "1": { id: "1", name: "John" },
  "2": { id: "2", name: "Jane" },
}

const findMock = vi.fn(async (id: string) => {
  return users[id]
})

class UserRepo extends Vla.Repo {
  findById = this.memo(findMock)
}

class UserService extends Vla.Service {
  repo = this.inject(UserRepo)

  async getProfile(id: string) {
    return this.repo.findById(id)
  }
}

class ShowUserAction extends Vla.Action {
  service = this.inject(UserService)

  async handle(id: string) {
    return this.service.getProfile(id)
  }
}

beforeEach(() => {
  findMock.mockClear()
})

const firstKernel = new Kernel().scoped()
let currentKernel = firstKernel
Vla.setInvokeKernelProvider(() => currentKernel)

test("uses kernel from currentFn", async () => {
  await expect(ShowUserAction.invoke("1")).resolves.toEqual({
    id: "1",
    name: "John",
  })
  await expect(ShowUserAction.invoke("1")).resolves.toEqual({
    id: "1",
    name: "John",
  })

  expect(findMock).toHaveBeenCalledTimes(1)

  const anotherScopedKernel = new Kernel().scoped()
  anotherScopedKernel.bind(
    UserRepo,
    vi.fn(
      class {
        findById = vi.fn(async (id: string) => ({ id, name: "Faked" }))
      },
    ),
  )
  currentKernel = anotherScopedKernel

  await expect(ShowUserAction.invoke("1")).resolves.toEqual({
    id: "1",
    name: "Faked",
  })
  await expect(ShowUserAction.invoke("1")).resolves.toEqual({
    id: "1",
    name: "Faked",
  })

  // does not use findMock, so still only called once
  expect(findMock).toHaveBeenCalledTimes(1)

  currentKernel = new Kernel().scoped()

  await expect(ShowUserAction.invoke("1")).resolves.toEqual({
    id: "1",
    name: "John",
  })
  await expect(ShowUserAction.invoke("1")).resolves.toEqual({
    id: "1",
    name: "John",
  })

  expect(findMock).toHaveBeenCalledTimes(2)
  expect.assertions(9)
})

test("supports async setter", async () => {
  Vla.setInvokeKernelProvider(async () => {
    await Promise.resolve()
    return currentKernel
  })

  currentKernel = new Kernel().scoped()
  await expect(ShowUserAction.invoke("1")).resolves.toEqual({
    id: "1",
    name: "John",
  })
})
