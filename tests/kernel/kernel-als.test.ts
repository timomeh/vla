import { beforeEach, expect, test, vi } from "vitest"
import { Kernel, Vla } from "../../src"

const users: Record<string, { id: string; name: string }> = {
  "1": { id: "1", name: "John" },
  "2": { id: "2", name: "Jane" },
}

const Users = Vla.createModule("Users")

const findMock = vi.fn(async (id: string) => {
  return users[id]
})

class UserRepo extends Users.Repo {
  findById = this.memo(findMock)
}

class UserService extends Users.Service {
  repo = this.inject(UserRepo)

  async getProfile(id: string) {
    return this.repo.findById(id)
  }
}

class ShowUserAction extends Users.Action {
  service = this.inject(UserService)

  async handle(id: string) {
    return this.service.getProfile(id)
  }
}

beforeEach(() => {
  findMock.mockClear()
})

const kernel = new Kernel()

test("uses kernel from AsyncLocalStorage", async () => {
  await Vla.withKernel(kernel.scoped(), async () => {
    await expect(ShowUserAction.invoke("1")).resolves.toEqual({
      id: "1",
      name: "John",
    })
    await expect(ShowUserAction.invoke("1")).resolves.toEqual({
      id: "1",
      name: "John",
    })

    expect(findMock).toHaveBeenCalledTimes(1)
  })

  const anotherScopedKernel = kernel.scoped()
  anotherScopedKernel.bind(
    UserRepo,
    vi.fn(
      class {
        findById = vi.fn(async (id: string) => ({ id, name: "Faked" }))
      },
    ),
  )

  await Vla.withKernel(anotherScopedKernel, async () => {
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
  })

  await Vla.withKernel(kernel.scoped(), async () => {
    await expect(ShowUserAction.invoke("1")).resolves.toEqual({
      id: "1",
      name: "John",
    })
    await expect(ShowUserAction.invoke("1")).resolves.toEqual({
      id: "1",
      name: "John",
    })

    expect(findMock).toHaveBeenCalledTimes(2)
  })

  expect.assertions(9)
})
