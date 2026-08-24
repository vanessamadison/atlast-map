# Publish — the signing problem and the fix

## What went wrong

`git commit` failed with *"incorrect passphrase supplied to decrypt private key"*. You have
**SSH commit signing** turned on globally (`gpg.format=ssh` + `commit.gpgsign=true`), and git
cannot decrypt `~/.ssh/id_ed25519` because the passphrase entered did not match.

**Also:** `gh repo create --push` failed first because there were **no commits yet**. Commit
before creating the repo, or create without `--push` and push after.

## Fix — pick one

### A · Load the key into the agent once (best)

```bash
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

Enter the passphrase once; macOS Keychain remembers it. If that passphrase also fails, you have
forgotten it — go to B.

### B · Skip signing for THIS repo only

```bash
cd ~/dd/travel
git config commit.gpgsign false
```

**This is legitimate here, and the distinction matters.** Signing is *required* by a server-side
ruleset on `DataDog/ts-ai-marketplace`. `vanessamadison/travel` is your own private repo with no
such rule. Turning it off **for this repo only** breaks no policy. Do **not** set it globally, and
never pass `--no-gpg-sign` on marketplace work.

### C · New signing key, if the passphrase is gone

```bash
ssh-keygen -t ed25519 -C "vanessa.madison@datadoghq.com" -f ~/.ssh/id_ed25519_signing
gh ssh-key add ~/.ssh/id_ed25519_signing.pub --type signing --title "commit signing 2026"
git config --global user.signingkey ~/.ssh/id_ed25519_signing.pub
```

## Then, in order

```bash
cd ~/dd/travel
git add .
git commit -m "travel: 3D map of parks, states, countries and routes"   # -S only if signing works
gh repo create vanessamadison/travel --private --source=. --remote=origin --push
gh api -X POST repos/vanessamadison/travel/pages -f "source[branch]=main" -f "source[path]=/"
```

If the branch is `master` rather than `main`: `git branch -M main` before creating the repo.

## See it immediately, no git at all

```bash
cd ~/dd/travel && python3 -m http.server 8080
```

Open http://localhost:8080. Do this first — know whether the map is any good before the ceremony.

## Pages on a private repo

Needs GitHub Pro or an org plan. `gh api user --jq .plan.name` tells you. If not covered: run it
locally, or make it public — parks, states, countries and routes only, nothing sensitive by design.

## Updating later

```bash
cd ~/dd/travel && git add travel.json && git commit -m "travel: add <place>" && git push
```
