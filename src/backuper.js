const {log}=console;

const fs = require('fs');
const path = require('path');

const headers = { 'Authorization': `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`}
const baseNameMaxChars = 40
const tableNameMaxChars = 60

const {removeInvalidPathChars} = require('./foldername');
const {downloadAttachments} = require('./downloader');

module.exports.backupBase = async (backupDir, {id:baseId, name: baseName}, index) => {

  const saveFileName =  removeInvalidPathChars(baseName.slice(0,baseNameMaxChars))
  const baseDir = path.join(backupDir, saveFileName+' - '+baseId);
  fs.mkdirSync(baseDir);
  
  await delay();
  const {tables} = await fetch_(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`);
  log(`\n[${index}] ➡️ base: '${baseName}'. Tables:`, tables.length)

  if (tables.length==0) return null

  const formatedJSON = JSON.stringify(tables,null,2)
  fs.writeFileSync(path.join(baseDir, '_metadata.json'),formatedJSON);

  const promises = [];
  for (let i = 0; i < tables.length; i++){
    const savedFileName =  removeInvalidPathChars(tables[i].name.slice(0,tableNameMaxChars))
    const tableRecordsFile = path.join(baseDir,savedFileName)
    promises.push(backupTables(tableRecordsFile, baseId+'/'+tables[i].id, tables[i].name));
  }
  await Promise.all(promises);

}

async function backupTables(tableRecordsFile, baseAndtableId, tableName) {

  let attachments=0;
  const allRecords = [];
  const attachmentsDir = tableRecordsFile+'_attachments';

  let sdvig = '';

  while (true) {   

    sameLineLog(`getting records (${tableName})...`);
    await delay();
    
    const apiUrl = `https://api.airtable.com/v0/${baseAndtableId}${sdvig!=''?'?offset='+sdvig:''}`
    const {records, offset} = await fetch_(apiUrl);

    sameLineLog(`parsing records (${tableName})...`);    
    if (records) {
        for (var i = 0; i < records.length; i++) 
          attachments += await downloadAttachments(attachmentsDir, records[i].fields)
        allRecords.push(...records);
    }

    if (offset) {
      sdvig = offset;
    } else {
      break;
    }

  }

  sameLineLog('');
  log('SAVED. Records:',allRecords.length,'Attachments:',attachments, ` for '${tableName}'`);

  fs.writeFileSync(tableRecordsFile+'.json', JSON.stringify(allRecords, null,2), 'utf-8');
  fs.writeFileSync(tableRecordsFile+'.csv', convertToCSV(allRecords), 'utf-8');

}

const sameLineLog = txt => {
  process.stdout.cursorTo(0);
  process.stdout.clearLine(1); 
  process.stdout.write(txt);
}

function convertToCSV(data) {
    const header = Object.keys(data[0]).join(',') + '\n';
    const csv = data.map(row => {
        return Object.values(row)
            .map(value => {
                if (typeof value === 'string' && value.includes(',')) {
                    return `"${value}"`;
                }
                return value;
            })
            .join(',');
    }).join('\n');
    return header + csv;
}

//============
async function fetch_(apiUrl){
   try {
    const response = await fetch(apiUrl, {headers});
    const data = await response.json();
    if (data.errors){
      if (data.errors[0].error=='RATE_LIMIT_REACHED'){
        log(data.errors[0].message)
        process.exit(1);
      }
      throw new Error(`${data.errors[0].error} - ${data.errors[0].message}`);
    }
    return data

  } catch(error) {
    console.error(error);
    return {tables:[],records:[]}
  }
}

const delay = () => sleep(Math.random() * (5000 - 1000) + 1000);
function sleep(ms) { return new Promise(resolve => {
    const interval = setInterval(() => {clearInterval(interval);resolve();}, ms); 
  });
}

