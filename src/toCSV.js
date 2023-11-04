const flaternCsvHeaders = data => {
  const headersSet = new Set();
  data.forEach(item => {
    Object.keys(item.fields).forEach(key => headersSet.add(key));
  });
  return ['$id', '$createdTime', ...headersSet];
};

const processValueForCsv = value => {
  if (Array.isArray(value)) {
    if (value.length > 0 && value[0].hasOwnProperty('filename')) {
      return value.map(v => v.filename.replace(/"/g, '""')).join('|'); 
    } else {
      return value.join('|');
    }
  }
  
  if (value === "" || value == null) {
    return undefined;
  }

  if (typeof value === 'string') {
    return value.replace(/"/g, '""'); 
  }

  return String(value); 
};


module.exports.convertToCSV = allRecords => {
  const csvRows = [];

  const headers = flaternCsvHeaders(allRecords)
  csvRows.push(headers.join(',')); // Добавляем заголовки

  allRecords.forEach(item => {
    const row = headers.map(header => {
      let value = header === '$id' ? item.id : header === '$createdTime' ? item.createdTime : item.fields[header];
      value = processValueForCsv(value); 
      return value !== undefined ? `"${value}"` : '';
    });

    csvRows.push(row.join(',')); 
  });

  return csvRows.join('\n');
};