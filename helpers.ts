import { green, red } from "https://deno.land/std/fmt/colors.ts"
import { BufReader } from "https://deno.land/std@0.51.0/io/bufio.ts"

export function fetchJson(url: string) {
  return fetch(url).then((res) => res.json())
}

export function write(text: string) {
  Deno.stdout.write(new TextEncoder().encode(text))
}

export async function readLine() {
  const line = await new BufReader(Deno.stdin).readLine()
  return line?.line ? new TextDecoder().decode(line?.line) : ""
}

export function prompt(prefix: string) {
  write(`${green("?")} ${prefix.trim()} `)
  return readLine()
}

export async function promptValidated<T>(
  prefix: string,
  validateAnswer: (input: string) => T,
) {
  while (true) {
    write(`${green("?")} ${prefix.trim()} `)
    const answer = await readLine()

    try {
      return validateAnswer(answer)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.log(`${red("!")} ${message}`)
    }
  }
}

export async function promptNumber(prefix: string) {
  return promptValidated(prefix, validateNumber)
}

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

export function raise(msg: string): never {
  throw new Error(msg)
}
