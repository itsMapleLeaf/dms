# dms: deno module search

Allows searching for deno modules from CLI, and copies the module import URL to your clipboard 📋

TODO:

- [x] Allow entering number _or_ module name

- [x] If only one result was found, use that result

- [ ] Branch/hash selection:

  - Fetch all branches
  - Filter branches by those which are valid version numbers
    - Not sure the heuristic to use here, e.g. "starts with `v`, has numbers, etc."?
  - Fetch latest commit hash on main branch
  - Show following options in a list selection, "Version / branch: "
    - Use latest version (v1.0.0)
    - Use latest commit hash (abdcef)
    - Use master branch
    - Use something else
      - This will show a prompt which lets the user enter a branch name or version
      - Maaaaybe list the available branches

- [ ] Also search and show results for std modules
- [ ] Fetch files from git and show selection dialogue to import files other than `mod.ts`

## Install / Update

```
deno install --allow-net --allow-run -n dms -f https://raw.githubusercontent.com/kingdaro/dms/master/cli.ts
```

## Usage

```
dms <somequery>
```

## Screenshot

![dms cli screenshot](./screenshot.png)
