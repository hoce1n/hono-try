# Vercel Deployment Failure Notes

`Cannot read properties of undefined (reading 'readFile')`

## TL;DR

The build on Vercel crashed with `Cannot read properties of undefined (reading 'readFile')`
because the project used **TypeScript 7.0** — the new native (Go) rewrite — which **no longer
ships the JavaScript compiler API** that Vercel's build tooling depends on.

The fix: pin `typescript` to `^6.0.3` (the last stable release with the full JS API).

---

## 1. The Symptom

Build log from Vercel:

```
Running "pnpm run build"
> hono@ build /vercel/path0
> tsc --noEmit
Using TypeScript 7.0.2 (local user-provided)
Error: Cannot read properties of undefined (reading 'readFile')
```

Note two things:

- The build ran `tsc --noEmit` (a plain type-check).
- The failure message mentions `readFile`, which is **not** a `tsc` CLI message — it is a
  JavaScript `TypeError` thrown by *Vercel's own build tooling*, not by the TypeScript CLI.

## 2. Why Did This Happen?

### Background: TypeScript 7.0 is a complete rewrite

TypeScript 7.0 (codenamed "Project Corsa") is Microsoft's **native port of the TypeScript
compiler to Go**. It is *much* faster than the old JavaScript compiler, but it is also a
**breaking change**:

| | TypeScript 5.x / 6.x (JS) | TypeScript 7.x (Go native) |
|---|---|---|
| Compiler binary | Runs in Node.js | Standalone native binary (`tsgo`) |
| `tsc` CLI | Yes | Yes |
| JS compiler API (`ts.sys`, `ts.createProgram`, `ts.readConfigFile`, ...) | Yes | **Removed** (all `undefined`) |

The npm package for TS 7 still exposes a `tsc` bin, but `import "typescript"` no longer
returns the in-process compiler. Tools that used the API now crash.

### Why Vercel broke

Vercel's **Node.js builder** compiles serverless function entry points like `api/index.ts`.
To do that, it loads the project's local `typescript` package and calls:

```js
ts.sys.readFile(...)
```

With TS 7, `ts.sys` is `undefined`, so `ts.sys.readFile` throws:

```
TypeError: Cannot read properties of undefined (reading 'readFile')
```

This is a widely reported incompatibility (e.g. AWS Amplify's `backend-deployer` hit the
exact same error). Any CI/CD or tooling that consumes the TS compiler API is affected.

### Local vs. Vercel mismatch

Locally, `tsc --noEmit` worked fine — because the `tsc` **CLI** works on both TS 6 and
TS 7. The break only showed up in Vercel's build, which uses the compiler **API**.

## 3. The Fix

### Pin TypeScript to a version with the JS API

`package.json`:

```diff
   "devDependencies": {
     "@types/node": "^26.1.1",
     "tsx": "^4.23.0",
-    "typescript": "^7.0.2"
+    "typescript": "^6.0.3"
   }
```

TypeScript **6.0.3** is the last stable release that ships both the CLI **and** the full JS
compiler API (`ts.sys.readFile` is a function — verified in the fix).

## 4. The pnpm Part (secondary fix)

### The esbuild "ignored build scripts" warning

During install, pnpm printed:

```
Ignored build scripts: esbuild@0.28.2.
Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.
```

**Why:** pnpm blocks dependencies' `postinstall`/`preinstall` scripts by default
(supply-chain security). esbuild has a `postinstall` that optimizes/validates its native
binary. On older pnpm it is just a warning; on newer pnpm (v10+/v11) an ignored build can
fail the install and abort `pnpm run build`.

**The fix — allow only the packages you trust:**

`pnpm-workspace.yaml`:

```yaml
allowBuilds:
  esbuild: true
```

and in `package.json`:

```json
"pnpm": {
  "onlyBuiltDependencies": ["esbuild"]
}
```

**Config location changed between pnpm versions** (this is the confusing part):

- pnpm **10** (what Vercel used) reads `onlyBuiltDependencies` from the `pnpm` field in
  `package.json`.
- pnpm **11** moved settings into `pnpm-workspace.yaml` and renamed it to `allowBuilds`.
  It *ignores* the `pnpm` field in `package.json` with a warning.

So both entries were kept — each version picks up the one it understands. Principle: prefer
**allow-listing specific packages** (`onlyBuiltDependencies`) over a blanket
`ignore-scripts: true`, which would silently break packages that genuinely need a build
step.

## 5. Verification

```bash
pnpm install
pnpm run build   # -> tsc --noEmit  -> exit 0
```

Also confirmed with `pnpm@10.28.0` (the version Vercel uses) and `ts.sys.readFile` being a
function on TS 6.0.3.

## 6. Lessons to Remember

1. **`typescript` in `devDependencies` affects build tooling, not just your source.**
   Bumping to a new major can break CI/CD pipelines that consume the compiler API even if
   your own code compiles fine.

2. **`tsc` CLI working locally does NOT mean the deployment is safe.** Vercel (and similar
   platforms) use the TS compiler API to compile `api/*.ts` functions. Test with the exact
   toolchain the platform uses (`vc build` / `vercel build`).

3. **Native ports of JS tools (Go/Rust rewrites) often drop the JS API.**
   "Faster" rewrites frequently prioritize the CLI/binary over in-process APIs. Before
   adopting a native compiler, check whether your build chain uses its programmatic API.

4. **Read the full stack trace.** `readFile` was a JS `TypeError`, not a TS syntax error —
   that immediately signaled the problem was outside the TypeScript CLI itself.

5. **When in doubt, pin exact/stable versions.** `^7.0.2` allowed the native rewrite in;
   `^6.0.3` keeps tooling on a battle-tested release.

6. **pnpm build-script security changes between majors.** The same setting moved from
   `package.json` to `pnpm-workspace.yaml`; check your pnpm version before adding config.

## 7. References

- TypeScript 7 / Project Corsa (native Go compiler rewrite)
- Vercel Node.js builder (compiles `api/*.ts` via the TS compiler API)
- AWS Amplify issue #3274 — identical `ts.sys is undefined` / `readFile` failure
- pnpm `onlyBuiltDependencies` vs `allowBuilds` docs
