import { clipboard } from "./src/clipboard.ts"
import { bold, gray, green } from "./src/colors.ts"
import { raise } from "./src/helpers.ts"
import { ModuleSearch, ModuleSearchEntry } from "./src/module-search.ts"
import { promptValidated } from "./src/prompt.ts"

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

function getQueryArg() {
  const [query] = Deno.args
  if (!query) {
    console.log("Error: query required")
    exitWithUsage()
  }
  return query
}

async function getEntrySelection(matchingEntries: ModuleSearchEntry[]) {
  if (matchingEntries.length === 1) {
    return matchingEntries[0]
  }

  console.log()
  for (const [index, entry] of matchingEntries.entries()) {
    const resultText = getResultText(index, entry)
    console.log(resultText, "\n")
  }

  const [minNumber, maxNumber] = [1, matchingEntries.length]

  return promptValidated("Module to use (name or number):", (answer) => {
    const numberAnswer = Number(answer)

    if (!Number.isNaN(numberAnswer)) {
      if (numberAnswer < minNumber || numberAnswer > maxNumber) {
        raise(`Invalid number, must be ${minNumber}-${maxNumber}`)
      }
      return matchingEntries[numberAnswer - 1]
    }

    const entryByName = matchingEntries.find(
      (entry) => entry.data.name === answer,
    )
    if (!entryByName) {
      raise(`Could not find result by name "${answer}"`)
    }

    return entryByName
  })
}

async function main() {
  const query = getQueryArg()

  console.log("Fetching module database...")

  const search = await ModuleSearch.fromDatabaseJson()

  const matchingEntries = search.filter(query)
  if (matchingEntries.length === 0) {
    return console.log(gray("No matching entries found :("))
  }

  const selectedEntry = await getEntrySelection(matchingEntries)

  // TODO: not all modules have a mod.ts,
  // so we want to have a more advanced UI here
  // what we'll want to do is basically show a little file tree explorer in the console
  // that lets the user travel through the repo's files
  // to get the module they want to import
  // but for now, since a _vast_ majority of them use mod.ts,
  // it'll work to just copy mod.ts
  // and of course, in that file explorer, mod.ts should be selected by default
  // we'll also want to list versions and let the user key through them

  await clipboard.writeText(selectedEntry.moduleImportUrl)
  console.log(
    `${green("√")} Copied to clipboard: ${selectedEntry.moduleImportUrl}`,
  )
}

await main()
