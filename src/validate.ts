import { raise } from "./helpers.ts"

export function validateNumber(value: string): number {
  return Number.isFinite(Number(value))
    ? Number(value)
    : raise("Expected number")
}

export function validateRange(min: number, max: number, value: number) {
  return value >= min && value <= max
    ? value
    : raise(`Expected range [${min}-${max}]`)
}
