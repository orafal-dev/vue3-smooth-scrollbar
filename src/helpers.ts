import type {
  ScrollIntoViewOptions,
  ScrollStatus,
  ScrollToOptions,
  Scrollbar,
} from "./smooth-scrollbar.types"

export const checkNumber = (value: unknown = 0, defValue = 0): number => {
  const num = Number(value)
  return Number.isNaN(num) ? defValue : num
}

export const checkLoadCapability = (
  limitY: unknown = 0,
  offsetY: unknown = 0,
  loadThreshold: unknown = 0,
): boolean => {
  const limit = checkNumber(limitY)
  const offset = checkNumber(offsetY)
  const threshold = checkNumber(loadThreshold)

  return offset >= limit - threshold
}

export const getScrollState = (
  scrollBar: Scrollbar | null,
  axis: "" | "x" | "y" = "",
  prop: "" | "limit" | "offset" = "",
): number | ScrollStatus["limit"] | ScrollStatus["offset"] | undefined => {
  if (!scrollBar || !prop) {
    return undefined
  }

  const state = scrollBar[prop]

  if (axis === "x" || axis === "y") {
    return state[axis]
  }

  return state
}

export const isPlainObject = (
  value: unknown,
): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

export const defaultsDeep = <T extends Record<string, unknown>>(
  target: T,
  ...sources: Array<Record<string, unknown>>
): T => {
  const result = { ...target }

  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      const existing = result[key as keyof T]

      if (isPlainObject(existing) && isPlainObject(value)) {
        result[key as keyof T] = defaultsDeep(
          { ...existing },
          value,
        ) as T[keyof T]
        continue
      }

      result[key as keyof T] = value as T[keyof T]
    }
  }

  return result
}

export const debounce = <T extends (...args: never[]) => void>(
  fn: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | undefined

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

export type { ScrollIntoViewOptions, ScrollStatus, ScrollToOptions, Scrollbar }
