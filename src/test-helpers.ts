const encoder = new TextEncoder()
const decoder = new TextDecoder()

export async function runCli({
  args = [],
  stdin,
}: { args?: string[]; stdin?: string } = {}) {
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
    stdin: "piped",
  })

  if (stdin) {
    await process.stdin?.write(encoder.encode(stdin))
  }
  process.stdin?.close()

  const [status, output, stderrOutput] = await Promise.all([
    process.status(),
    process.output(),
    process.stderrOutput(),
  ])

  process.close()

  return {
    status,
    output: decoder.decode(output),
    stderrOutput: decoder.decode(stderrOutput),
  }
}
