import { DateTime } from 'luxon';

export default function generateDimDates(options, nRecords) {
  const dateToInt = date => 
    date.year*10000 + date.month*100 + date.day;
  
  const startDate = DateTime.fromISO(options.startDate);
  const endDate   = DateTime.fromISO(options.endDate);
  const startId   = (options.basicFields.id.semanticIds) ? dateToInt(startDate) : 1;
  const numDays   = (!nRecords) ? endDate.diff(startDate, 'days').values.days+1 : nRecords;

  let headers = [];
  let columns = [];

  const addEntry = (field, val) => {
    if (field.active) {
      if (!headers[field.order]) {
        headers[field.order] = field.name;
      }

      if (!columns[field.order]) {
        columns[field.order] = [];
      }
      
      columns[field.order].push(val);
    }
  }

  for (let i = 0; i < numDays; i++) {
    const currDate = startDate.plus({ days: i });

    addEntry(options.basicFields.id                  , dateToInt(currDate)                                                     );
    addEntry(options.basicFields.date                , currDate.toFormat('yyyy-MM-dd')                                         );
    addEntry(options.basicFields.dateLongDescription , currDate.toFormat(options.basicFields.dateLongDescription .formatString));
    addEntry(options.basicFields.dateShortDescription, currDate.toFormat(options.basicFields.dateShortDescription.formatString));
    addEntry(options.basicFields.dayLongName         , currDate.toFormat(options.basicFields.dayLongName         .formatString));
    addEntry(options.basicFields.dayShortName        , currDate.toFormat(options.basicFields.dayShortName        .formatString));
    addEntry(options.basicFields.monthLongName       , currDate.toFormat(options.basicFields.monthLongName       .formatString));
    addEntry(options.basicFields.monthShortName      , currDate.toFormat(options.basicFields.monthShortName      .formatString));
    addEntry(options.basicFields.quarterLongName     , currDate.toFormat(options.basicFields.quarterLongName     .formatString));
    addEntry(options.basicFields.quarterShortName    , currDate.toFormat(options.basicFields.quarterShortName    .formatString));
  }

  // Remove any "undefined" entries
  columns = columns.filter(x => !!x);
  headers = headers.filter(x => !!x);

  // Zip up the columns to get the rows
  const rows = columns[0].map(
    (e, i) => [e, ...columns.slice(1).map(x => x[i])]);
   
  return { headers: headers, rows: rows };
}
