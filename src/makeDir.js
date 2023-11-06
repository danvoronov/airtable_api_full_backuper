const {existsSync, mkdirSync} = require('fs');

module.exports._mkdir = dir => {
  try {
    if (!existsSync(dir))   
      mkdirSync(dir); 
  } catch (err) {
    console.error("Could not create directory!", err);
    throw new Error(err);
  }  
};