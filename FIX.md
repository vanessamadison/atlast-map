# Why it was black — and the one command to fix it

## Root cause: fog

```js
scene.fog = new THREE.FogExp2(0x0d0f0d, 0.055);
```

`FogExp2` attenuates by `exp(-(density × distance)²)`. The camera sits ~46 units out, so:

```
exp(-(0.055 × 46)²) = 0.0017
```

**0.17% of the terrain colour survived.** The mesh rendered perfectly and was then fogged
entirely to the background — which is black. That is why the UI, the stats and the buttons all
worked: nothing was broken except the atmosphere. Density is now **0.006**, which leaves 93%.

Three more things fixed while in there:

- **Elevation pointed the wrong way.** Setting `Z` and then rotating −90° about X maps +Z to −Y,
  so every mountain pushed *down into* the plane instead of up out of it. Rotation flipped.
- **Palette was too dark** to read against a near-black background even unfogged. Lifted.
- **An on-screen error overlay** now catches module errors and unhandled rejections, so a future
  failure says what it was instead of showing a black rectangle.

## Your local copy is stale — that is the "4 of 63"

The Drive copy has **6 parks** (Arches and Canyonlands added). You copied to `~/dd/travel`
before that. Re-copy, then serve:

```bash
cp -R "$HOME/Library/CloudStorage/GoogleDrive-vanessa.madison@datadoghq.com/My Drive/dd/travel/." ~/dd/travel/
cd ~/dd/travel && python3 -m http.server 8080
```

Open http://localhost:8080 — **hard reload** (Cmd-Shift-R) so the browser drops the cached module.

You should see shaded terrain, 6 of 63 parks, and the amber and blue route veins.

## Then commit

```bash
cd ~/dd/travel
ssh-add --apple-use-keychain ~/.ssh/id_ed25519   # or: git config commit.gpgsign false
git add .
git commit -m "adventure log: 3D map, routes, suggestions"
gh repo create vanessamadison/travel --private --source=. --remote=origin --push
```

## If it is still black

The error overlay top-left will say why. If it is silent, run this in the browser console:

```js
console.log(THREE.REVISION, scene.children.length, camera.position);
```

`scene.children.length` should be > 3. If it is 3, the terrain mesh never got added and the
failure is in `buildTerrain`, not in rendering.
