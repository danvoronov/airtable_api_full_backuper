const {log}=console;

const fs = require('fs');
const path = require('path');
const https = require('https');

const {removeInvalidPathChars} = require('./foldername');

module.exports.downloadAttachments = async (attachmentsDir, obj) => {
  let num =0
  for (let key in obj) 
    if (Array.isArray(obj[key]) && obj[key][0] && typeof obj[key][0] === 'object') 
      for (var i = 0; i < obj[key].length; i++) 
        if (obj[key][i].hasOwnProperty('url')) {

          const attachment = obj[key][i]
          num++
          if (!fs.existsSync(attachmentsDir)) 
              fs.mkdirSync(attachmentsDir);     
          
          const testName = removeInvalidPathChars(attachment.filename)
          if (testName !== attachment.filename)
            log('  ⚠️ Invalid chars in filename', attachment.filename+' ⚠️')
          const filePath = path.join(attachmentsDir, testName);
          https.get(attachment.url, response => { response.pipe(fs.createWriteStream(filePath)) });

        }
  return num;
}
