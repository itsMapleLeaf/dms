import { delay } from "https://deno.land/std@9752b85/async/delay.ts"
import { raise } from "./helpers.ts"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export async function runCli({
  args = [],
  stdin,
}: { args?: string[]; stdin?: string } = {}) {
  async function runProcess() {
    const process = Deno.run({
      cmd: [
        "deno",
        "run",
        "--allow-run",
        "--allow-net",
        "--allow-env",
        "./cli.ts",
        ...args,
      ],
      env: {
        TEST: "true",
      },
      stdout: "piped",
      stderr: "piped",
      stdin: stdin ? "piped" : "null",
    })

    if (stdin) {
      await process.stdin?.write(encoder.encode(stdin))
      process.stdin?.close()
    }

    const status = await process.status()
    const output = await process.output()
    const stderrOutput = await process.stderrOutput()

    process.close()

    return {
      status,
      output: decoder.decode(output),
      stderrOutput: decoder.decode(stderrOutput),
    }
  }

  return Promise.race([
    runProcess(),

    // it could hang forever if it needs stdin but we never give it,
    // so we'll terminate it after a delay
    // the delay can be pretty small since it usually runs instantly
    delay(300).then(() => raise("Test timed out")),
  ])
}
