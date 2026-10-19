# Repository — Single Source of Truth

There is **one** GitHub repository for this monorepo.

| | |
|---|---|
| **Canonical name** | `Klear360-DesignSystem` |
| **Browse / clone** | https://github.com/jatinbansalwork-commits/Klear360-DesignSystem |
| **SSH** | `git@github.com:jatinbansalwork-commits/Klear360-DesignSystem.git` |
| **HTTPS** | `https://github.com/jatinbansalwork-commits/Klear360-DesignSystem.git` |

```sh
git clone https://github.com/jatinbansalwork-commits/Klear360-DesignSystem.git
```

## Legacy URLs (do not use)

These older repo names pointed at the same monorepo and are no longer canonical:

- `https://github.com/jatinbansalwork-commits/Klear360`
- `https://github.com/jatinbansalwork-commits/Klear360-DesignSystem`

Update bookmarks, remotes, MCP configs, and docs to `Klear360-DesignSystem` only.

```sh
# Fix an existing clone still pointing at an old remote
git remote set-url origin https://github.com/jatinbansalwork-commits/Klear360-DesignSystem.git
```

## Names (not the same thing)

| Name | What it is |
|------|------------|
| **Klear360-DesignSystem** | GitHub repo (this monorepo) |
| **Klear360** | Design system product name (`@klear/klear360` package) |
| **Local folder `Klear360`** | Your machine's directory name — can differ from the repo name |

## One local checkout, not several

There should be exactly **one** working local clone of this repo on a machine, with `git worktree`
used for parallel branches/sessions off that one clone — not separate `git clone`s living in
different folders. Multiple independent clones (e.g. one under `~/code`, another copied to
`~/Desktop` "just in case") drift apart silently: nothing stops them from pointing at different
commits, and nothing warns you when one is stale. Worse, if a folder gets renamed, moved, or
deleted, anything that hardcoded a path into it (see below) breaks with no clear error pointing at
the cause.

**Never commit a machine-specific absolute path into tracked config.** This bit us concretely:
`.mcp.json`'s `klear360-mcp` entry once hardcoded
`/Users/<user>/Desktop/4.0/Klear360/packages/klear360-mcp/dist/server.js` - a path that only existed
on one person's machine, before the repo moved. Every checkout of this repo inherited that dead
path and failed to connect to `klear360-mcp` with no useful error beyond "Connection closed". Rules
going forward:

- In this repo's own `.mcp.json`, reference `klear360-mcp` with a path relative to the repo root
  (`packages/klear360-mcp/dist/server.js`), never an absolute `/Users/...` path. A relative path
  resolves correctly for any checkout, on any machine.
- A **consuming** project (a separate app that uses `@klear/klear360-mcp`, not this repo itself)
  should install it from npm (`npx -y @klear/klear360-mcp@latest`) rather than pointing at a local
  file path at all - it has no reason to know where any particular person's clone of this repo
  lives on disk.
- If you find a stray full clone of this repo sitting in another folder, prefer removing it (after
  checking `git status`/`git log` for anything genuinely unmerged) over keeping it "just in case" -
  it's exactly the kind of drift this section exists to prevent.
