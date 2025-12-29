---
title: Vla Namespace
description: API reference for the Vla namespace and its methods
---

The `Vla` namespace provides the main API for creating modules, contexts, and managing kernels.

## Base Classes

The Vla namespace includes base classes for building your application:

```ts
Vla.Action   // Entry points
Vla.Service  // Business logic
Vla.Repo     // Data access
Vla.Facade   // Cross-module interface
Vla.Resource // Infrastructure
```

## Methods

### createModule()

```ts
Vla.createModule<ModuleName extends string>(
  moduleName: ModuleName
): Module
```

Creates a new module with its own set of base classes.

**Parameters:**
- `moduleName` - A unique name for the module

**Returns:** An object with module-specific base classes

**Example:**

```ts
const Users = Vla.createModule('Users')
const Posts = Vla.createModule('Posts')

class UserService extends Users.Service {
  // ...
}

class PostService extends Posts.Service {
  users = this.inject(UserFacade) // Cross-module via Facade
}
```

### createContext()

```ts
Vla.createContext<T>(): Token<T>
```

Creates a context token for dependency injection.

**Type Parameters:**
- `T` - The type of the context value

**Returns:** A context token that can be injected

**Example:**

```ts
const AppContext = Vla.createContext<{
  userId: string | null
  cookies: Record<string, string>
}>()

class SessionService extends Vla.Service {
  ctx = this.inject(AppContext)

  async currentUser() {
    return this.ctx.userId
  }
}

// Provide context
kernel.context(AppContext, {
  userId: '123',
  cookies: req.cookies
})
```

**See also:** [Context Guide](/guides/context/)

### setGlobalInvokeKernel()

```ts
Vla.setGlobalInvokeKernel(kernel: Kernel): void
```

Sets a global kernel that will be used by all `.invoke()` calls.

**Parameters:**
- `kernel` - The kernel instance to use globally

**Example:**

```ts
import { Kernel, Vla } from 'vla'

const kernel = new Kernel()
Vla.setGlobalInvokeKernel(kernel)

// Now actions can be invoked without passing a kernel
await MyAction.invoke(args)
```

**Use cases:**
- Simple applications without request scoping
- CLI applications
- Background jobs

**Warning:** This sets a global kernel that's shared across all invocations. For web applications, use `setInvokeKernelProvider()` instead.

### setInvokeKernelProvider()

```ts
Vla.setInvokeKernelProvider(
  provider: () => Kernel | Promise<Kernel>
): void
```

Sets a provider function that returns a kernel for each `.invoke()` call.

**Parameters:**
- `provider` - A function that returns a Kernel (or Promise of Kernel)

**Example:**

```ts
import { Kernel, Vla } from 'vla'
import { cache } from 'react'

const rootKernel = new Kernel()

Vla.setInvokeKernelProvider(
  cache(() => {
    return rootKernel.scoped().context(AppContext, {
      cookies: getCookies()
    })
  })
)
```

**Use cases:**
- Request-scoped kernels in web applications
- Dynamic kernel configuration
- Context-aware kernel creation

### withKernel()

```ts
Vla.withKernel<T>(
  kernel: Kernel,
  fn: () => T | Promise<T>
): Promise<T>
```

Executes a function with a specific kernel context using AsyncLocalStorage.

**Parameters:**
- `kernel` - The kernel to use for the execution
- `fn` - The function to execute

**Returns:** The result of the function

**Example:**

```ts
import { Vla } from 'vla'

app.use((req, res, next) => {
  const scoped = kernel.scoped().context(AppContext, {
    cookies: req.cookies
  })

  Vla.withKernel(scoped, () => next())
})
```

**Use cases:**
- Framework middleware
- Wrapping request handlers
- Setting kernel for a specific execution context