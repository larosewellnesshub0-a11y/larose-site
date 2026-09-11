# Working rules

This is a generated bilingual static site. Work from source, not from output.

1. Edit `content/*.json`, `build/`, dashboard code, or hand-managed assets as
   appropriate. Never hand-edit generated HTML under `site/`.
2. Build before reviewing output:

   ```powershell
   node build/build.mjs
   node tools/validate.mjs
   node tools/audit.mjs
   python tools/check_voice.py
   ```

   All four commands must pass. The important failure mode is a correct source
   edit that never reaches a built page. Only the rebuilt output and its checks
   prove the change is live in the generated site.
3. Arabic reader-address is masculine or neutral. `check_voice.py` fails on
   feminine second-person forms. The only exception is the two RecipeGuide
   pages, which preserve the clinic's supplied wording.
4. Keep Arabic and English counterparts in sync. Do not invent medical facts,
   people, credentials, addresses, statistics, or citations. Use `UNKNOWN` or
   the existing empty state when the source is missing.
5. Never put public price figures in content or output. The save checks and
   validator reject them.
6. Do not use `text-align: match-parent`. Chrome does not implement it.
7. For template images, use `responsiveAttrs()` and the appropriate
   `IMAGE_SIZES` value. Use `sizeAttrs()` when dimensions are not fixed in the
   template. The audit treats missing intrinsic dimensions as blocking.
8. `site/` contains generated documents and assets. Build commands may rewrite
   generated output. Manual edits to generated HTML will be lost on the next
   build.

See `PROJECT.md` for the source map and `_project/LAUNCH.md` for the deployment
runbook.
