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

const basesAPI = 'https://api.airtable.com/v0/meta/bases';

// ========================

(async function _() {

  const {bases} = await checkConnection();
  const basesLen = bases.length
  if (basesLen==0) {
   log('We got 0 bases!') 
   process.exit(1); 
  }

  _mkdir(process.env.BACKUP_DIR); 
  _mkdir(backupDir);

  if (process.argv.includes('--all')) {
    for (let i = 0; i < basesLen; i++) 
      await backupBase(backupDir, bases[i], i+1);
    process.exit(1); 
  } 

  if (process.argv.some(arg => arg.startsWith('--app'))) {

    const appIdArg = process.argv.find(arg => arg.startsWith('--app'));
    const baseToBackup = bases.find(base => base.id === appIdArg.substring(2));
    if (baseToBackup) 
      await backupBase(backupDir, baseToBackup, 0);
    else 
      log(`No base found with this ID`);
  
    process.exit(1);
  } 
  
  menuBackup(backupDir, bases);
  
})();

async function checkConnection() {
  try {
    const response = await fetch(basesAPI, {headers});
    if(response.status === 200) {
      return await response.json()
    } else {
      throw new Error('Connection status code is not 200');
    }
  } catch(err) {
    console.error('Cannot connect to internet!');
    process.exit(1);
  }
}
