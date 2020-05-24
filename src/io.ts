import { BufReader } from "https://deno.land/std@0.51.0/io/bufio.ts"

const encoder = new TextEncoder()
const decoder = new TextDecoder()
const bufReader = new BufReader(Deno.stdin)

export function write(text: string) {
  Deno.stdout.write(encoder.encode(text))
}

export async function readLine() {
  const result = await bufReader.readLine()
  return result?.line ? decoder.decode(result.line) : ""
}
