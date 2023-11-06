const {log}=console;
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const {backupBase} = require('./backuper');

module.exports.menuBackup = (backupDir, bases) => {
  
  const basesLen = bases.length
  showBasesNamesInConsole(bases, basesLen)
  const consolePromt = '\nWhich base do you want to backup? \n(Enter a number from 1 to ' + basesLen + ', or 0 to backup all): '

  rl.question(consolePromt, async function(baseToBackup) {

    if (baseToBackup === '0') { log('Starting backup of ALL bases into '+backupDir)

      for (let i = 0; i < basesLen; i++) 
        await measuredBackup(backupDir, bases[i], i+1);
    
    } else { log('Starting backup of base number '+baseToBackup)
    
      const indexToBackup = parseInt(baseToBackup, 10) - 1;
      if (indexToBackup >= 0 && indexToBackup < basesLen) 
        await measuredBackup(backupDir, bases[indexToBackup], indexToBackup + 1);
      else 
        log('Invalid base number!');
    
    }
    rl.close();
  });

};

function showBasesNamesInConsole(bases, basesLen) { log('We got bases: '+basesLen+'\n');

  const maxLength = Math.max(...bases.map(base => base.name.length));
  for (let i = 0; i < basesLen; i += 4) {
    const baseSlice = bases.slice(i, i + 4);
    const baseDisplay = baseSlice.map(({ name }, index) => `${((i + index + 1).toString()+'.').padEnd(3)} ${name.padEnd(maxLength)}`).join('    ');
    log(baseDisplay);
  }
}

async function measuredBackup(backupDir, base, num) {
  const start = Date.now();
  await backupBase(backupDir, base, num);
  const end = Date.now();
  log(`⏲️ Base ${num} saved in ` + Math.round((end - start) / 1000) + ` sec.`);
}