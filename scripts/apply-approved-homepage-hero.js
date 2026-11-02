#!/usr/bin/env node
'use strict';
/**
 * Inject the Product Owner-approved responsive homepage artwork into the existing
 * Family Hub website without replacing its navigation, download resolver, help,
 * themes, feature sections, or other production functions.
 *
 * Usage:
 * node scripts/apply-approved-homepage-hero.js path/to/index.html path/to/desktop-hero.webp path/to/mobile-hero.webp path/to/output.html
 * Output is for review only. Requires separately approved, privacy-sanitized artwork.
 */
const fs = require('node:fs');
const crypto = require('node:crypto');
const [sourcePath, desktopPath, mobilePath, outputPath] = process.argv.slice(2);
if (![sourcePath, desktopPath, mobilePath, outputPath].every(Boolean)) {
  console.error('Usage: node apply-approved-homepage-hero.js index.html desktop.webp mobile.webp output.html');
  process.exit(2);
}
const source = fs.readFileSync(sourcePath, 'utf8');
if (!source.includes('<section class="hero">') || !source.includes('id="hero-android"') || !source.includes('id="hero-wall"')) {
  throw new Error('Current site hero or download actions not found: refusing to modify an unexpected template');
}
const heroPicture = /<div class="art"><picture>[\s\S]*?<\/picture><\/div>/;
if (!heroPicture.test(source)) throw new Error('Original hero picture not found: refusing unsafe replacement');
const desktop = fs.readFileSync(desktopPath);
const mobile = fs.readFileSync(mobilePath);
for (const [name, data] of [['desktop', desktop], ['mobile', mobile]]) {
  if (data.length < 1000 || data.toString('ascii',0,4) !== 'RIFF' || data.toString('ascii',8,12) !== 'WEBP') {
    throw new Error(name + ' must be nonempty WebP');
  }
}
// Do not silently publish personal household content from unreviewed mockups.
// Before committing generated output, explicitly review both input images for
// identifiable names, messages, photos and membership details. This script
// verifies file integrity, not the privacy of text rendered inside pixels.
const expectedHashes = {
  desktop: 'bb27ae35289a938bf5c67372846cb5054d20bbc0056cd973a229da54b82b1011',
  mobile: 'ee0a59131a04fdd6e496084c9bdd8dd776b69755a535d78e8975fdad000680ce'
};
for (const [name, bytes] of [['desktop', desktop], ['mobile', mobile]]) {
  const actual = crypto.createHash('sha256').update(bytes).digest('hex');
  if (actual !== expectedHashes[name] && !(process.env.FAMILY_HUB_SYNTHETIC_TEST_FIXTURE === '1' && process.argv.includes('--test-fixture-only'))) {
    throw new Error(name + ' artwork differs from the approved review package; review and update the manifest before integration');
  }
}
const picture = '<div class="art"><picture><source media="(max-width:680px)" width="780" height="941" srcset="data:image/webp;base64,'+
 mobile.toString('base64')+'"><img alt="Illustration of Family Hub in a warm kitchen: a portrait wall display, a desktop monitor, a tablet and a phone showing the agenda, meals, grocery list and daily tasks of a fictional family" src="data:image/webp;base64,'+
 desktop.toString('base64')+'" width="1672" height="941" fetchpriority="high"></picture></div>';
const style = `<style id="approved-homepage-hero">
/* Scoped hero presentation: retains all current site functionality and styling elsewhere. */
.hero{min-height:auto;background:var(--bg);color:var(--text)}
html[data-mode="light"] .hero{background:linear-gradient(180deg,#fffaf5 0%,#f9f2eb 100%);color:#27333b}
html[data-mode="dark"] .hero{background:linear-gradient(180deg,#0b1425 0%,#152239 100%);color:#f8f7f5}
.hero:after{display:none}
.hero-inner{min-height:0;display:flex;flex-direction:column;align-items:stretch;padding-top:48px}
.hero-copy{width:100%;max-width:920px;text-align:center;margin:0 auto;padding:0;position:relative;z-index:2}
.hero .kicker{color:var(--accent)}
.hero h1{font-family:Georgia,serif;font-weight:500;max-width:920px;margin:0 auto 24px;font-size:clamp(2.8rem,5.4vw,5.7rem)}
.hero h1 em{color:var(--accent)}
.hero .lead{max-width:650px;color:var(--muted);margin:0 auto 24px}
.hero .btns,.hero-benefits{justify-content:center}
.hero .subline{color:var(--muted)}
.hero .hero-benefits{color:var(--muted);margin-top:20px}
.hero .art{position:relative;inset:auto;width:100%;height:auto;max-width:none;display:block;margin:20px auto 0;pointer-events:none;overflow:visible}
.hero .art:before{display:none!important}
.hero .art picture,.hero .art img{display:block;max-width:100%;width:100%;height:auto;object-fit:contain;filter:none;mask-image:none!important;-webkit-mask-image:none!important}
.hero .btn.outline{background:var(--surface);border-color:var(--line);color:var(--text)}
@media(max-width:1060px){.hero-inner{padding-top:40px}.hero .art{height:auto;margin:16px auto 0;width:100%}}
@media(max-width:680px){.hero-inner{padding-top:28px}.hero h1{font-size:clamp(2.5rem,10.8vw,4rem)}.hero .lead{font-size:1rem}.hero .art{width:100%;margin:16px auto 0;left:auto;right:auto}.hero .art img{width:100%}.hero .hero-benefits{margin-top:18px}.hero .btns{grid-template-columns:1fr 1fr}.hero{overflow:hidden}}
</style>`;
let result=source.replace(heroPicture,picture);
result=result.replace('</head>',style+'</head>');
if (!result.includes('id="approved-homepage-hero"') || result.includes('<div class="art"><picture><source media="(max-width:1060px)" srcset="data:image/webp;base64,UklGRpAvAQ')) {
  throw new Error('Failed to apply responsive replacement');
}
fs.writeFileSync(outputPath,result);
console.log('Wrote review-only integrated homepage:', outputPath);
