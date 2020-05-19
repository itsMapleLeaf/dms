export type DatabaseJsonEntry = {
  desc: string
  owner: string
  type: string
  repo: string
}

export const databaseJsonUrl =
  "https://raw.githubusercontent.com/denoland/deno_website2/master/database.json"

export function isValidDatabaseEntry(data: any): data is DatabaseJsonEntry {
  return (
    data != null &&
    typeof data.desc === "string" &&
    typeof data.owner === "string" &&
    typeof data.type === "string" &&
    typeof data.repo === "string"
  )
}
