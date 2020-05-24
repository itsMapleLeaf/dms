import {
  DatabaseJsonEntry,
  databaseJsonUrl,
  isValidDatabaseEntry,
} from "./database.ts"
import { fetchJson } from "./helpers.ts"

export class ModuleSearch {
  readonly entries: ModuleSearchEntry[]

  private constructor(entries: ModuleSearchEntry[]) {
    this.entries = entries
  }

  static async fromDatabaseJson() {
    const databaseJson = await fetchJson(databaseJsonUrl)

    const entries: ModuleSearchEntry[] = Object.entries(databaseJson)
      .filter((item): item is [string, DatabaseJsonEntry] =>
        isValidDatabaseEntry(item[1]),
      )
      .map(([name, entry]) =>
        ModuleSearchEntry.fromDatabaseJsonEntry(name, entry),
      )

    return new ModuleSearch(entries)
  }

  static fromMock() {
    return new ModuleSearch([
      ModuleSearchEntry.withData({
        name: "a",
        description: "",
        githubRepoName: "arepo",
        githubUsername: "auser",
      }),
      ModuleSearchEntry.withData({
        name: "b",
        description: "",
        githubRepoName: "brepo",
        githubUsername: "buser",
      }),
      ModuleSearchEntry.withData({
        name: "ab",
        description: "description ab",
        githubRepoName: "ab repo",
        githubUsername: "ab user",
      }),
    ])
  }

  filter(query: string) {
    return this.entries.filter((entry) => entry.matches(query))
  }
}

export class ModuleSearchEntry {
  readonly data: ModuleSearchEntryData

  private constructor(data: ModuleSearchEntryData) {
    this.data = data
  }

  static withData(data: ModuleSearchEntryData) {
    return new ModuleSearchEntry(data)
  }

  static fromDatabaseJsonEntry(name: string, entry: DatabaseJsonEntry) {
    return new ModuleSearchEntry({
      name,
      description: entry.desc,
      githubUsername: entry.owner,
      githubRepoName: entry.repo,
    })
  }

  get denoLandUrl() {
    return `https://deno.land/x/${this.data.name}`
  }

  get githubUrl() {
    return `https://github.com/${this.data.githubUsername}/${this.data.githubRepoName}`
  }

  get moduleImportUrl() {
    return `${this.denoLandUrl}/mod.ts`
  }

  matches(query: string) {
    return Object.values(this.data).some((value) =>
      value.toLowerCase().includes(query.toLowerCase()),
    )
  }
}

type ModuleSearchEntryData = {
  name: string
  description: string
  githubUsername: string
  githubRepoName: string
}
