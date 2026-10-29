'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const cp=require('node:child_process');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'fh-hero-'));
try {
 const original='<html><head><title>Family Hub</title></head><body><section class="hero"><a id="hero-android" href="download.html?device=android">Android</a><a id="hero-wall" href="download.html?device=wall">Wall</a><div class="art"><picture><source media="(max-width:1060px)" srcset="old-mobile"><img src="old-desktop"></picture></div></section><a href="help.html">Help</a><div id="features">Existing features</div></body></html>';
 const f=path.join(dir,'index.html'),d=path.join(dir,'desktop.webp'),m=path.join(dir,'mobile.webp'),o=path.join(dir,'result.html');
 fs.writeFileSync(f,original);const img=Buffer.concat([Buffer.from('RIFF'),Buffer.alloc(4),Buffer.from('WEBP'),Buffer.alloc(1200)]);
 fs.writeFileSync(d,img);fs.writeFileSync(m,img);
 const tool=path.resolve(__dirname,'../scripts/apply-approved-homepage-hero.js');
 cp.execFileSync(process.execPath,[tool,f,d,m,o],{stdio:'pipe'});
 const result=fs.readFileSync(o,'utf8');
 assert.match(result,/id="approved-homepage-hero"/);
 assert.match(result,/data:image\/webp;base64,/);
 assert.match(result,/max-width:1060px/);
 for(const text of ['download.html?device=android','download.html?device=wall','help.html','Existing features','id="features"'])assert.ok(result.includes(text),text);
 assert.ok(!result.includes('old-desktop'));
 const bad=path.join(dir,'bad.html');fs.writeFileSync(bad,'<html><body>unrelated</body></html>');
 assert.throws(()=>cp.execFileSync(process.execPath,[tool,bad,d,m,o],{stdio:'pipe'}));
 console.log('Hero integration tests passed: responsive art, preservation, and unsafe-template rejection');
} finally {fs.rmSync(dir,{recursive:true,force:true});}