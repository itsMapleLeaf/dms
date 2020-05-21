import { clipboard } from "./src/clipboard.ts"
import { bold, gray, green } from "./src/colors.ts"
import { ModuleSearch, ModuleSearchEntry } from "./src/module-search.ts"
import { promptValidated } from "./src/prompt.ts"
import { validateNumber, validateRange } from "./src/validate.ts"

const usageString = `Usage: dms <query>`

function exitWithUsage(code = 0): never {
  console.log(usageString)
  Deno.exit(code)
}

function getResultText(index: number, entry: ModuleSearchEntry) {
  const { name, description, githubUsername } = entry.data
  return [
    `${green(String(index + 1))} ${bold(name)} - ${description}`,
    `  ${gray("by")} ${githubUsername}`,
    `  ${gray("github:")} ${entry.githubUrl}`,
    `  ${gray("deno:")} ${entry.denoLandUrl}`,
  ].join("\n")
}

async function main() {
  const [query] = Deno.args
  if (!query) {
    console.log("Error: query required")
    exitWithUsage()
  }

  console.log("Fetching module database...")

  const search = await ModuleSearch.fromDatabaseJson()

  const matchingEntries = search.filter(query)
  if (matchingEntries.length === 0) {
    return console.log(gray("No matching entries found :("))
  }

  console.log()
  for (const [index, entry] of matchingEntries.entries()) {
    const resultText = getResultText(index, entry)
    console.log(resultText, "\n")
  }

  const selectionNumber = await promptValidated(
    "Module to use (enter number from list):",
    (answer) =>
      validateRange(1, matchingEntries.length, validateNumber(answer)),
  )

  const entry = matchingEntries[selectionNumber - 1]

  // TODO: not all modules have a mod.ts,
  // so we want to have a more advanced UI here
  // what we'll want to do is basically show a little file tree explorer in the console
  // that lets the user travel through the repo's files
  // to get the module they want to import
  // but for now, since a _vast_ majority of them use mod.ts,
  // it'll work to just copy mod.ts
  // and of course, in that file explorer, mod.ts should be selected by default
  // we'll also want to list versions and let the user key through them

  await clipboard.writeText(entry.moduleImportUrl)
  console.log(`${green("√")} Copied to clipboard: ${entry.moduleImportUrl}`)
}

await main()
