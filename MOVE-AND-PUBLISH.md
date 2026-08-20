# Run this. One block.

The earlier command had a literal `…` in it instead of the real path — that is why `cp` failed.
This is the actual path, and it lands in `~/dd` alongside your other repos.

```bash
cp -R "$HOME/Library/CloudStorage/GoogleDrive-vanessa.madison@datadoghq.com/My Drive/dd/travel" ~/dd/travel
cd ~/dd/travel && ls -1
```

You should see six files: `MOVE-AND-PUBLISH.md`, `PUBLISH.md`, `README.md`, `index.html`,
`parks.js`, `terrain.js`, `travel.json`.

## Then publish

```bash
cd ~/dd/travel
git init -b main
git add .
git commit -S -m "travel: 3D map of parks, states and countries"
gh repo create vanessamadison/travel --private --source=. --remote=origin --push
gh api -X POST repos/vanessamadison/travel/pages -f "source[branch]=main" -f "source[path]=/"
```

Live at **https://vanessamadison.github.io/travel/** about a minute later.

## Only after you have confirmed the copy — remove the Drive original

```bash
rm -rf "$HOME/Library/CloudStorage/GoogleDrive-vanessa.madison@datadoghq.com/My Drive/dd"
```

Do this **last**. A `.git` inside Drive sync corrupts because Drive rewrites files mid-operation,
so there must be exactly one copy and it must be the local one.

## See it right now without waiting on Pages

```bash
cd ~/dd/travel && python3 -m http.server 8080
```

Then open http://localhost:8080 — full map, no hosting, no plan required.

## If Pages refuses

Private-repo Pages needs GitHub Pro or an org plan:

```bash
gh api user --jq .plan.name
```

If it is not covered: run it locally as above, or make the repo public. **There is nothing
sensitive in it by design** — parks, states, countries, cities. No Datadog data, no account names,
no financials, no vault paths.
