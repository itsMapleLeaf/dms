import { bold, gray, green } from "https://deno.land/std/fmt/colors.ts"
import { DatabaseEntry, getDatabase } from "./database.ts"
import { promptValidated, validateNumber, validateRange } from "./helpers.ts"

const usageString = `Usage: dms <query>`

function exitWithUsage(code = 0): never {
  console.log(usageString)
  Deno.exit(code)
}

function getResultText(index: number, name: string, entry: DatabaseEntry) {
  const githubUrl = `https://github.com/${entry.owner}/${entry.repo}`
  return [
    `${green(String(index + 1))} ${bold(name)} - ${entry.desc}`,
    `  ${gray("by")} ${entry.owner}`,
    `  ${gray("github:")} ${githubUrl}`,
    `  ${gray("deno:")} ${`https://deno.land/x/${name}`}`,
  ].join("\n")
}

async function main() {
  const database = await getDatabase()

  const [query] = Deno.args
  if (!query) {
    console.log("Error: query required")
    exitWithUsage()
  }

  const matchingEntries = [...database.entries()].filter(([key]) =>
    key.includes(query),
  )

  if (matchingEntries.length === 0) {
    return console.log(gray("No matching entries found :("))
  }

  console.log()
  for (const [index, entry] of matchingEntries.entries()) {
    const resultText = getResultText(index, ...entry)
    console.log(resultText, "\n")
  }

  const selection = await promptValidated("Module number:", (answer) =>
    validateRange(1, matchingEntries.length, validateNumber(answer)),
  )
}

main().catch((error) => {
  console.error(error)
})
