if (!process.env.AIRTABLE_ACCESS_TOKEN) 
  throw new Error('Set AIRTABLE_ACCESS_TOKEN param!');
const headers = { 'Authorization': `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`}

if (!process.env.BACKUP_DIR) 
  throw new Error('Set BACKUP_DIR param!');
const backupDir = require('./src/foldername').dirForToday(process.env.BACKUP_DIR)

const {log}=console;
const {_mkdir} = require('./src/makeDir');
const {menuBackup} = require('./src/menuBackup');
const {backupBase} = require('./src/backuper');

// ========================


(async function _() {
 
  const response = await fetch('https://api.airtable.com/v0/meta/bases', {headers});
  const data = await response.json();

  const {bases} = data;
  const basesLen = bases.length
  if (basesLen==0) return log('We got 0 bases!') 

  _mkdir(process.env.BACKUP_DIR); 
  _mkdir(backupDir);

  if (process.argv.includes('--all')){
    for (let i = 0; i < basesLen; i++) 
      await backupBase(backupDir, bases[i], i+1);
  }
  else
    menuBackup(backupDir, bases)

})();
