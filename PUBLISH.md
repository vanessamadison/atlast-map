# Move out of Drive, then publish — copy-paste

**Do the move first.** A `.git` directory inside Google Drive sync is a real hazard: Drive
rewrites files mid-operation and can corrupt the object store, and two machines syncing the same
`.git` will eventually produce a repo that fails `git fsck`. Repos belong on local disk.

## 1 · Move it home

```bash
DRIVE="$HOME/Library/CloudStorage/GoogleDrive-vanessa.madison@datadoghq.com/My Drive/dd/travel"
mkdir -p "$HOME/dev"
cp -R "$DRIVE" "$HOME/dev/travel"
cd "$HOME/dev/travel" && ls -1
```

Once it is confirmed there, remove the Drive copy so there is only one source of truth:

```bash
rm -rf "$HOME/Library/CloudStorage/GoogleDrive-vanessa.madison@datadoghq.com/My Drive/dd"
```

## 2 · Publish

```bash
cd "$HOME/dev/travel"

git init -b main
git add .
git commit -S -m "travel: 3D map of parks, states and countries"

# private repo + push, in one step (gh is already signed in)
gh repo create vanessamadison/travel --private --source=. --remote=origin --push

# Pages from main / root
gh api -X POST repos/vanessamadison/travel/pages \
  -f "source[branch]=main" -f "source[path]=/" \
  || echo "Enable by hand: Settings -> Pages -> Deploy from a branch -> main -> / (root)"
```

Live at **https://vanessamadison.github.io/travel/** about a minute after the build.

## If Pages will not turn on

Pages on a **private** repo needs GitHub Pro or an org plan. Check what you have:

```bash
gh api user --jq .plan.name
```

Three ways forward:

1. **Run it locally** — no hosting, no plan, works immediately:
   `cd "$HOME/dev/travel" && python3 -m http.server 8080` then open `http://localhost:8080`
2. **Make it public.** There is nothing sensitive in it by design — parks, states, countries and
   cities only. No Datadog data, no account names, no financials, no vault paths.
3. Put it in a Datadog-org repo if the org plan covers private Pages.

## Signing

Your marketplace work requires signed commits and you likely have `commit.gpgsign=true` set
globally, which is why `-S` is above. If signing fails, fix the key — do not pass
`--no-gpg-sign`.

## Updating it

```bash
cd "$HOME/dev/travel"
# edit travel.json
git add travel.json && git commit -S -m "travel: add Zion" && git push
```

Or say **"add Zion to my travel map"** in the Daily OS project and the `travel` skill handles the
edit, the route maths and the budget line.
