export function exportCSV(headers, rows, sep = ",") {
  console.log('headers', headers);

  const wrapper = strlist =>
    strlist.map(str => str.includes(sep) ? '"' + str + '"' : str);
  
  let csv = wrapper(headers).join(sep) + '\n'
    + wrapper(rows).map(row => row.map(x => '"' + x + '"').join(sep)).join('\n');
  
  return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
}
