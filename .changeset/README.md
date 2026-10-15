# Changesets

Hello and welcome! This folder has been set up using `@changesets/cli`, a build tool that works
with multi-package repos, or single-package repos to help you version and publish your code. You
can find the full documentation for it [in our repository](https://github.com/changesets/changesets)

We have a quick list of common questions to get you started engaging with this project in
[our documentation](https://github.com/changesets/changesets/blob/main/docs/common-questions.md)

## Workflow

1. After making a change that should be released, run `yarn changeset` from the repo root and
   follow the prompts (which package(s) changed, patch/minor/major, and a one-line summary).
2. Commit the generated `.changeset/*.md` file alongside your change - one changeset per PR is the
   norm.
3. When it's time to cut a release, run `yarn changeset:version` to consume all pending changesets
   into `CHANGELOG.md` and bump `package.json`'s version, then `yarn changeset:publish` to publish.
