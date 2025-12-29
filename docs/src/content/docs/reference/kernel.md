---
title: Kernel API
description: Complete API reference for the Kernel class
---

The Kernel is Vla's dependency injection container. It manages class instantiation, dependency resolution, and instance caching.

## Constructor

```ts
new Kernel()
```

Creates a new Kernel instance.

**Example:**

```ts
import { Kernel } from 'vla'

const kernel = new Kernel()
```

## Methods

### scoped()

```ts
scoped(): Kernel
```

Creates a new scoped kernel that inherits from the parent kernel. Scoped kernels have their own `invoke` cache but share the parent's `singleton` cache.

**Returns:** A new scoped Kernel instance

**Example:**

```ts
const rootKernel = new Kernel()
const scopedKernel = rootKernel.scoped()

// Each request should get its own scoped kernel
app.use((req, res, next) => {
  const requestKernel = rootKernel.scoped()
  // Use requestKernel for this request
})
```

**Use cases:**
- Creating request-scoped kernels in web servers
- Isolating test instances
- Creating temporary dependency overrides

### bind()

```ts
bind<TKey extends Token>(
  key: TKey,
  impl: InstantiableClass<unknown>,
  scope?: Scope
): void
```

Binds a class implementation to a token (usually another class).

**Parameters:**
- `key` - The token to bind (typically a class)
- `impl` - The implementation class to use
- `scope` - Optional scope override (`'singleton'`, `'invoke'`, or `'transient'`). Defaults to `'transient'`

**Example:**

```ts
// Replace UserRepo with MockUserRepo
kernel.bind(UserRepo, MockUserRepo)

// Bind with specific scope
kernel.bind(UserRepo, MockUserRepo, 'singleton')
```

**Use cases:**
- Mocking dependencies in tests
- Swapping implementations (e.g., dev vs production)
- Providing alternative implementations

### bindValue()

```ts
bindValue<TKey extends Token>(
  key: TKey,
  value: Resolved<TKey>,
  scope?: Scope
): void
```

Binds a specific value to a token.

**Parameters:**
- `key` - The token to bind
- `value` - The value to inject
- `scope` - Optional scope (`'singleton'`, `'invoke'`, or `'transient'`). Defaults to `'singleton'`

**Example:**

```ts
// Bind a mock object
kernel.bindValue(UserRepo, {
  findById: async (id) => ({ id, name: 'Test User' })
})

// Bind configuration
kernel.bindValue(Config, {
  apiKey: 'test-key',
  databaseUrl: 'postgres://localhost'
})
```

**Use cases:**
- Providing mock objects in tests
- Injecting configuration values
- Providing primitive values or POJOs

### context()

```ts
context<TKey extends Token>(
  key: TKey,
  value: Resolved<TKey>
): Kernel
```

A convenience method for binding a value with `invoke` scope. Returns the kernel for chaining.

**Parameters:**
- `key` - The context token
- `value` - The context value

**Returns:** The kernel instance (for chaining)

**Example:**

```ts
const AppContext = Vla.createContext<{
  userId: string
  cookies: Record<string, string>
}>()

const scoped = kernel
  .scoped()
  .context(AppContext, {
    userId: '123',
    cookies: req.cookies
  })
```

**Use cases:**
- Providing request-scoped context
- Chaining multiple context providers
- Setting up test context

### resolve()

```ts
resolve<T>(key: Token<T>, scope?: Scope): T
```

Resolves a dependency and returns an instance. Does not perform unwrapping.

**Parameters:**
- `key` - The token to resolve
- `scope` - Optional scope override

**Returns:** An instance of the requested type

**Example:**

```ts
const service = kernel.resolve(UserService)
const customScope = kernel.resolve(UserService, 'singleton')
```

**Note:** Most users should use `create()` or `get()` instead. Use `resolve()` when you specifically need to bypass unwrapping.

### get()

```ts
get<T>(key: Token<T>, scope?: Scope): T
```

Resolves a dependency and performs unwrapping if the class has an `unwrap` property.

**Parameters:**
- `key` - The token to resolve
- `scope` - Optional scope override

**Returns:** An instance of the requested type (unwrapped if applicable)

**Example:**

```ts
class Database extends Vla.Resource {
  static readonly unwrap = 'client'
  client = new PrismaClient()
}

// Without unwrap
const dbInstance = kernel.resolve(Database) // Database instance
const client = dbInstance.client // PrismaClient

// With unwrap
const client = kernel.get(Database) // PrismaClient directly
```

### create()

```ts
create<T>(cls: InstantiableClass<T>): T
```

Creates a new instance of a class and injects its dependencies.

**Parameters:**
- `cls` - The class to instantiate

**Returns:** A new instance with dependencies injected

**Example:**

```ts
const service = kernel.create(UserService)
const action = kernel.create(GetUserAction)
```