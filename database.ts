import { fetchJson } from "./helpers.ts"

export type DatabaseEntry = {
  desc: string
  owner: string
  type: string
  repo: string
}

const databaseUrl =
  "https://raw.githubusercontent.com/denoland/deno_website2/master/database.json"

export async function getDatabase() {
  const database = new Map<string, DatabaseEntry>()
  for (const [key, entry] of Object.entries(await fetchJson(databaseUrl))) {
    if (isValidDatabaseEntry(entry)) {
      database.set(key, entry)
    }
  }
  return database
}

function isValidDatabaseEntry(data: any): data is DatabaseEntry {
  return (
    data != null &&
    typeof data.desc === "string" &&
    typeof data.owner === "string" &&
    typeof data.type === "string" &&
    typeof data.repo === "string"
  )
}
