import { green, red } from "./colors.ts"
import { readLine, write } from "./io.ts"
import { validateNumber } from "./validate.ts"

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
