import {
  assertEquals,
  assertStrContains,
} from "https://deno.land/std@9752b85/testing/asserts.ts"
import { runCli } from "./src/test-helpers.ts"

Deno.test({
  name: "exiting if no query given",
  fn: async () => {
    const { status } = await runCli()
    assertEquals(status.code, 1)
  },
  sanitizeOps: false,
})

Deno.test("copying first result to clipboard", async () => {
  const { output } = await runCli({
    args: ["a"],
    stdin: "1",
  })

  assertStrContains(output, "https://deno.land/x/a/mod.ts")
})

Deno.test("copying first and only result to clipboard", async () => {
  const { output } = await runCli({
    args: ["ab"],
  })

  assertStrContains(output, "https://deno.land/x/ab/mod.ts")
})
