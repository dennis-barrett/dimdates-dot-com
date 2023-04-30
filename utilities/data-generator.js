import { DateTime } from 'luxon';

export default function generateDimDates({
  startDate: startDateStr,
  endDate: endDateStr,
  basicFields: basicFields,
  calendarPeriodFields: calendarPeriodFields,
  fiscalPeriodFields: fiscalPeriodFields}, nRecords, isPreviewData) {
  
  const startDate = DateTime.fromISO(startDateStr);
  const endDate   = DateTime.fromISO(endDateStr  );
  const numDays   = (!nRecords) ? endDate.diff(startDate, 'days').values.days+1 : nRecords;

  // Here's where we'll store the generated data. Headers are kept separate from the columns of data
  let headers = [];
  let columns = [];

  // Convert date to an integer of the form YYYYMMDD
  const dateToInt = date => 
    date.year*10000 + date.month*100 + date.day;
   
   // Convert a date to an ID
   const dateToId = date =>
    dateToInt(date) - (basicFields.id.semanticIds ? 0 : dateToInt(startDate));

  // Add a new column entry, so long as that column is active
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

  const undefinedDateId = undefined;
  const startId = isPreviewData ? Math.min(19000101, dateToInt(startDate)) : dateToInt(startDate);
  const endId   = isPreviewData ? Math.max(29991231, dateToInt(endDate  )) : dateToInt(endDate  );

  // Generate the data; we just iterate through dates, adding as we go
  for (let i = 0; i < numDays; i++) {
    const currDate = startDate.plus({ days: i });

    // Basic fields ---------------------------------------------------------------------------------------------------
    addEntry(basicFields.id                  , dateToId(currDate)                                              );
    addEntry(basicFields.date                , currDate.toFormat(basicFields.date                .formatString));
    addEntry(basicFields.dateLongDescription , currDate.toFormat(basicFields.dateLongDescription .formatString));
    addEntry(basicFields.dateShortDescription, currDate.toFormat(basicFields.dateShortDescription.formatString));
    addEntry(basicFields.dayLongName         , currDate.toFormat(basicFields.dayLongName         .formatString));
    addEntry(basicFields.dayShortName        , currDate.toFormat(basicFields.dayShortName        .formatString));
    addEntry(basicFields.monthLongName       , currDate.toFormat(basicFields.monthLongName       .formatString));
    addEntry(basicFields.monthShortName      , currDate.toFormat(basicFields.monthShortName      .formatString));
    addEntry(basicFields.quarterLongName     , currDate.toFormat(basicFields.quarterLongName     .formatString));
    addEntry(basicFields.quarterShortName    , currDate.toFormat(basicFields.quarterShortName    .formatString));

    // Calendar period fields -----------------------------------------------------------------------------------------
    const weekStart    = currDate.startOf('week');
    const weekEnd      = currDate.endOf  ('week');
      
    const monthStart   = currDate.startOf('month');
    const monthEnd     = currDate.endOf  ('month');

    const quarterStart = currDate.startOf('quarter');
    const quarterEnd   = currDate.endOf  ('quarter');

    const yearStart    = currDate.startOf('year');
    const yearEnd      = currDate.endOf  ('year');

    addEntry(calendarPeriodFields.calendarWeek                 , currDate.weekNumber                                                               );
    addEntry(calendarPeriodFields.calendarWeekStartDateId      , (dateToId(weekStart) < startId) ? undefinedDateId : dateToId(weekStart)           );
    addEntry(calendarPeriodFields.calendarWeekEndDateId        , (dateToId(weekEnd  ) > endId  ) ? undefinedDateId : dateToId(weekEnd  )           );
    addEntry(calendarPeriodFields.calendarWeekStartDate        , weekStart.toFormat(calendarPeriodFields.calendarWeekStartDate.formatString)       );
    addEntry(calendarPeriodFields.calendarWeekEndDate          , weekEnd  .toFormat(calendarPeriodFields.calendarWeekEndDate  .formatString)       );
    addEntry(calendarPeriodFields.calendarDayInWeek            , currDate.weekday                                                                  );

    addEntry(calendarPeriodFields.calendarMonth                , currDate.month                                                                    );
    addEntry(calendarPeriodFields.calendarMonthStartDateId     , (dateToId(monthStart) < startId) ? undefinedDateId : dateToId(monthStart)         );
    addEntry(calendarPeriodFields.calendarMonthEndDateId       , (dateToId(monthEnd  ) > endId  ) ? undefinedDateId : dateToId(monthEnd  )         );
    addEntry(calendarPeriodFields.calendarMonthStartDate       , monthStart.toFormat(calendarPeriodFields.calendarMonthStartDate.formatString)     );
    addEntry(calendarPeriodFields.calendarMonthEndDate         , monthEnd  .toFormat(calendarPeriodFields.calendarMonthEndDate  .formatString)     );
    addEntry(calendarPeriodFields.calendarNumberOfDaysInMonth  , currDate.daysInMonth                                                              );
    addEntry(calendarPeriodFields.calendarDayInMonth           , currDate.day                                                                      );

    addEntry(calendarPeriodFields.calendarQuarter              , currDate.quarter                                                                  );
    addEntry(calendarPeriodFields.calendarQuarterStartDateId   , (dateToInt(quarterStart) < startId) ? undefinedDateId : dateToInt(quarterStart)   );
    addEntry(calendarPeriodFields.calendarQuarterEndDateId     , (dateToInt(quarterEnd  ) > endId  ) ? undefinedDateId : dateToInt(quarterEnd  )   );
    addEntry(calendarPeriodFields.calendarQuarterStartDate     , quarterStart.toFormat(calendarPeriodFields.calendarQuarterStartDate.formatString) );
    addEntry(calendarPeriodFields.calendarQuarterEndDate       , quarterEnd  .toFormat(calendarPeriodFields.calendarQuarterEndDate  .formatString) );
    addEntry(calendarPeriodFields.calendarNumberOfDaysInQuarter, Math.round(quarterEnd.diff(quarterStart, 'days').days)                            );
    addEntry(calendarPeriodFields.calendarDayInQuarter         , Math.round(currDate.diff(quarterStart, 'day').days + 1)                           );

    addEntry(calendarPeriodFields.calendarYear                 , currDate.year                                                                     );
    addEntry(calendarPeriodFields.calendarYearStartDateId      , (dateToId(yearStart) < startId) ? undefined : dateToId(yearStart)                 );
    addEntry(calendarPeriodFields.calendarYearEndDateId        , (dateToId(yearEnd  ) > endId  ) ? undefined : dateToId(yearEnd  )                 );
    addEntry(calendarPeriodFields.calendarYearStartDate        , yearStart.toFormat(calendarPeriodFields.calendarYearStartDate.formatString)       );
    addEntry(calendarPeriodFields.calendarYearEndDate          , yearEnd  .toFormat(calendarPeriodFields.calendarYearEndDate  .formatString)       );
    addEntry(calendarPeriodFields.calendarNumberOfDaysInYear   , currDate.daysInYear                                                               );
    addEntry(calendarPeriodFields.calendarDayInYear            , Math.round(currDate.diff(yearStart, 'day').days + 1)                              );

    // Fiscal period fields -------------------------------------------------------------------------------------------
    // TODO
  }

  // Remove any "undefined" entries
  columns = columns.filter(x => !!x);
  headers = headers.filter(x => !!x);

  // Zip up the columns to get the rows
  const rows = columns[0].map(
    (e, i) => [e, ...columns.slice(1).map(x => x[i])]);
   
  return { headers: headers, rows: rows };
}
