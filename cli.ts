import Spinner from "https://deno.land/x/cli_spinners/mod.ts"
import { clipboard } from "./src/clipboard.ts"
import { bold, gray, green } from "./src/colors.ts"
import { DatabaseEntry, getDatabase } from "./src/database.ts"
import { promptValidated } from "./src/prompt.ts"
import { validateNumber, validateRange } from "./src/validate.ts"

const usageString = `Usage: dms <query>`

const spinner = Spinner.getInstance()

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
  spinner.start("Fetching module database...")
  const database = await getDatabase()
  spinner.stop()

  const [query] = Deno.args
  if (!query) {
    console.log("Error: query required")
    exitWithUsage()
  }

  const matchingEntries = [...database.entries()].filter(
    ([name, entry]) =>
      name.includes(query) ||
      entry.desc.includes(query) ||
      entry.owner.includes(query) ||
      entry.repo.includes(query),
  )

  if (matchingEntries.length === 0) {
    return console.log(gray("No matching entries found :("))
  }

  console.log()
  for (const [index, entry] of matchingEntries.entries()) {
    const resultText = getResultText(index, ...entry)
    console.log(resultText, "\n")
  }

  const selectionNumber = await promptValidated(
    "Module to use (enter number from list):",
    (answer) =>
      validateRange(1, matchingEntries.length, validateNumber(answer)),
  )
  const [name, selection] = matchingEntries[selectionNumber - 1]

  // TODO: not all modules have a mod.ts,
  // so we want to have a more advanced UI here
  // what we'll want to do is basically show a little file tree explorer in the console
  // that lets the user travel through the repo's files
  // to get the module they want to import
  // but for now, since a _vast_ majority of them use mod.ts,
  // it'll work to just copy mod.ts
  // and of course, in that file explorer, mod.ts should be selected by default
  // we'll also want to list versions and let the user key through them

  const moduleUrl = `https://deno.land/x/${name}/mod.ts`
  await clipboard.writeText(moduleUrl)
  console.log(`${green("√")} Copied to clipboard: ${moduleUrl}`)
}

main().catch((error) => {
  console.error(error)
})
