import { BufReader } from "https://deno.land/std@0.51.0/io/bufio.ts"

export function write(text: string) {
  Deno.stdout.write(new TextEncoder().encode(text))
}

export async function readLine() {
  const line = await new BufReader(Deno.stdin).readLine()
  return line?.line ? new TextDecoder().decode(line.line) : ""
}
