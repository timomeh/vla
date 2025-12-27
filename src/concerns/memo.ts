import objectHash from "object-hash"

// biome-ignore lint/suspicious/noExplicitAny: needs ts abstract constructor
type BaseCtor<T = object> = abstract new (...args: any[]) => T
type ArgsTuple = unknown[]

export type Memoized<Args extends ArgsTuple, R> = ((...args: Args) => R) & {
  memoized: (...args: Args) => R
  fresh: (...args: Args) => R
  prime: (...args: Args) => { value: (value: R) => void }
  preload: (...args: Args) => R
  bust: (...args: Args) => void
  bustAll: () => void
}

export interface MemoCapable {
  memo<Args extends ArgsTuple, R>(fn: (...args: Args) => R): Memoized<Args, R>
}

export function Memoizable<TBase extends BaseCtor>(Base: TBase) {
  abstract class MemoizableBase extends Base implements MemoCapable {
    memo<Args extends ArgsTuple, R>(
      fn: (...args: Args) => R,
    ): Memoized<Args, R> {
      const cache = new Map<string, R>()
      const keyOf = (args: Readonly<Args>) => objectHash(args)

      const memoized = ((...args: Args): R => {
        const key = keyOf(args)
        const hit = cache.get(key)
        if (hit !== undefined) return hit

        const value = fn.apply(this, args) as R

        const maybeThenable = value as { then?: unknown }
        if (typeof maybeThenable.then === "function") {
          const promise = value as unknown as Promise<unknown>
          promise.catch(() => {
            cache.delete(key)
          })
        }

        cache.set(key, value)
        return value
      }) as Memoized<Args, R>

      memoized.memoized = memoized

      memoized.fresh = ((...args: Args): R => {
        return fn.apply(this, args)
      }) as Memoized<Args, R>["fresh"]

      memoized.preload = ((...args: Args): R => {
        return memoized(...args)
      }) as Memoized<Args, R>["preload"]

      memoized.prime = ((...args: Args) => {
        const key = keyOf(args)

        return {
          value: (value: R) => {
            const maybeThenable = value as { then?: unknown }
            if (typeof maybeThenable.then === "function") {
              const promise = value as unknown as Promise<unknown>
              promise.catch(() => {
                cache.delete(key)
              })
            }

            cache.set(key, value)
          },
        }
      }) as Memoized<Args, R>["prime"]

      memoized.bust = (...args: Args): void => {
        cache.delete(keyOf(args))
      }

      memoized.bustAll = (): void => {
        cache.clear()
      }

      return memoized
    }
  }

  return MemoizableBase as unknown as typeof MemoizableBase & TBase
}
