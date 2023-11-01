const {log}=console;
const fs = require('fs');

const headers = { 'Authorization': `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`}
const {backupDir} = require('./src/foldername');
const {backupBase} = require('./src/backuper');

(async function _() {
 
  const response = await fetch('https://api.airtable.com/v0/meta/bases', {headers});
  const data = await response.json();

  const {bases} = data;
  if (bases.length==0) return log('We got 0 bases!') 
  
  log('Bases:', bases.length)
  fs.mkdirSync(backupDir);

  const SREZ = bases.length
  for (let i = 0; i < SREZ; i++) {
    const start = Date.now();
      await backupBase(backupDir, bases[i], i+1);
    const end = Date.now();
    log(`⏲️ Saved in `+Math.round((end-start)/1000)+` sec.`);
  }
})();
