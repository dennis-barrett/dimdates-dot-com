import { DateTime } from 'luxon';

export default function generateDimDates({
  startDate: startDateStr,
  endDate: endDateStr,
  fiscalYearStartDateStr: fiscalYearStartDateStr,
  basicFields: basicFields,
  calendarPeriodFields: calendarPeriodFields,
  fiscalPeriodFields: fiscalPeriodFields}, nRecords, isPreviewData) {
  
  const startDate           = DateTime.fromISO(startDateStr);
  const endDate             = DateTime.fromISO(endDateStr);
  const fiscalYearStartDate = DateTime.fromISO(fiscalYearStartDateStr);
  const numDays             = (!nRecords) ? endDate.diff(startDate, 'days').values.days+1 : nRecords;

  // Here's where we'll store the generated data. Headers are kept separate from the columns of data
  let headers = [];
  let columns = [];
   
  // Convert a date to an ID
  const dateToId = date => {
    const dateToInt = date => 
      date.year*10000 + date.month*100 + date.day;
    
    return dateToInt(date) - (basicFields.id.semanticIds ? 0 : dateToInt(startDate));
  }

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
  const startId = isPreviewData ? Math.min(19000101, dateToId(startDate)) : dateToId(startDate);
  const endId   = isPreviewData ? Math.max(29991231, dateToId(endDate  )) : dateToId(endDate  );

  // Generate the data; we just iterate through dates, adding as we go
  for (let i = 0; i < numDays; i++) {
    const currDate   = startDate.plus({ days: i });

    const state = {
      currDate           : currDate,
      startId            : startId,
      endId              : endId,
      fiscalYearStartDate: fiscalYearStartDate,
      dateToId           : dateToId,
      addEntry           : addEntry
    };

    addBasicFieldEntries            (basicFields         , state);
    addCalendarPeriodFieldEntries   (calendarPeriodFields, state);
    addFiscalPeriodFieldFieldEntries(fiscalPeriodFields  , state);
  }

  // Remove any "undefined" entries
  columns = columns.filter(x => !!x);
  headers = headers.filter(x => !!x);

  // Zip up the columns to get the rows
  const rows = columns[0].map(
    (e, i) => [e, ...columns.slice(1).map(x => x[i])]);
   
  return { headers: headers, rows: rows };
}


function addBasicFieldEntries(basicFields, {
    currDate: currDate,
    startId : startId,
    endId   : endId,
    dateToId: dateToId,
    addEntry: addEntry
  }) {
  addEntry(basicFields.id                  , dateToId(currDate)                                              );
  addEntry(basicFields.date                , currDate.toFormat(basicFields.date                .formatString));
  addEntry(basicFields.dateLongDescription , currDate.toFormat(basicFields.dateLongDescription .formatString));
  addEntry(basicFields.dateShortDescription, currDate.toFormat(basicFields.dateShortDescription.formatString));
  addEntry(basicFields.dayLongName         , currDate.toFormat(basicFields.dayLongName         .formatString));
  addEntry(basicFields.dayShortName        , currDate.toFormat(basicFields.dayShortName        .formatString));
  addEntry(basicFields.monthLongName       , currDate.toFormat(basicFields.monthLongName       .formatString));
  addEntry(basicFields.monthShortName      , currDate.toFormat(basicFields.monthShortName      .formatString));
  // addEntry(basicFields.quarterLongName     , currDate.toFormat(basicFields.quarterLongName     .formatString));
  // addEntry(basicFields.quarterShortName    , currDate.toFormat(basicFields.quarterShortName    .formatString));
};


function addCalendarPeriodFieldEntries(calendarPeriodFields, {
    currDate: currDate,
    startId : startId,
    endId   : endId,
    dateToId: dateToId,
    addEntry: addEntry
  }) {
  const weekStart    = currDate.startOf('week');
  const weekEnd      = currDate.endOf  ('week');
    
  const monthStart   = currDate.startOf('month');
  const monthEnd     = currDate.endOf  ('month');

  const quarterStart = currDate.startOf('quarter');
  const quarterEnd   = currDate.endOf  ('quarter');

  const yearStart    = currDate.startOf('year');
  const yearEnd      = currDate.endOf  ('year');

  addEntry(calendarPeriodFields.calendarDay                  , Math.round(currDate.diff(yearStart, 'day').days + 1)                              );

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
  addEntry(calendarPeriodFields.calendarQuarterStartDateId   , (dateToId(quarterStart) < startId) ? undefinedDateId : dateToId(quarterStart)     );
  addEntry(calendarPeriodFields.calendarQuarterEndDateId     , (dateToId(quarterEnd  ) > endId  ) ? undefinedDateId : dateToId(quarterEnd  )     );
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
}


function addFiscalPeriodFieldFieldEntries(fiscalPeriodFields, {
    currDate           : currDate,
    startId            : startId,
    endId              : endId,
    fiscalYearStartDate: fiscalYearStartDate,
    dateToId           : dateToId,
    addEntry           : addEntry
  }) {
  const currDateId       = dateToId(currDate);

  const fiscalWeekStart  = currDate.startOf('week');
  const fiscalWeekEnd    = currDate.endOf  ('week');
  
  const fiscalMonthStart = currDate.startOf('month');
  const fiscalMonthEnd   = currDate.endOf  ('month');

  const potentialFiscalYearStart = DateTime.fromObject({
    year : currDate.year,
    month: fiscalYearStartDate.month,
    day  : fiscalYearStartDate.day
  })

  const fiscalYearStart     = (dateToId(currDate) < dateToId(potentialFiscalYearStart))
    ? potentialFiscalYearStart.plus({ year: -1 })
    : potentialFiscalYearStart;
  const prevFiscalYearStart = fiscalYearStart.plus({ year: -1 });
  const nextFiscalYearStart = fiscalYearStart.plus({ year: +1 });
  const fiscalYearEnd       = fiscalYearStart.plus({ days: nextFiscalYearStart.daysInYear - 1 });

  const fiscalDay = fiscalYearStart.daysInYear * (currDate < fiscalYearStart)
    + Math.round(currDate.diff(fiscalYearStart, 'day').days + 1);

  // Given:
  //  * Start of first fiscal week in the year.
  //      ~ This might lead to partial fiscal weeks, or weeks that extend over years.
  //      ~ E.g., fiscal year starting Sun Jan 3 2021:
  //
  //        Option 1: W01 is a partial week
  //          Friday January 01, 2021 	  W01 2021
  //          Saturday January 02, 2021 	W01 2021
  //          Sunday January 03, 2021 	  W02 2021
  //          Monday January 04, 2021 	  W02 2021
  //
  //        Option 2: W53 extends into 2021
  //          Thursday December 31, 2020 	  W53 2020
  //          Friday January 01, 2021 	    W53 2020
  //          Saturday January 02, 2021 	  W53 2020
  //          Sunday January 03, 2021 	    W01 2021
  //  * For fiscal month: select 4-4-5, 4-5-4, 5-4-4.
  //      ~ A 53rd week would need to be added to the calendar every five to six years.
  //
  // See https://help.kepion.com/hc/en-us/articles/360053158691-Define-Custom-Fiscal-Week.

  addEntry(fiscalPeriodFields.fiscalDay                , -1);

  addEntry(fiscalPeriodFields.fiscalWeek               , -1);
  addEntry(fiscalPeriodFields.fiscalWeekStartDateId    , -1);
  addEntry(fiscalPeriodFields.fiscalWeekEndDateId      , -1);
  addEntry(fiscalPeriodFields.fiscalWeekStartDate      , -1);
  addEntry(fiscalPeriodFields.fiscalWeekEndDate        , -1);
  addEntry(fiscalPeriodFields.fiscalDayInWeek          , -1);
  
  addEntry(fiscalPeriodFields.fiscalMonth              , (12 + currDate.month - fiscalYearStart.month) % 12 + 1                               );
  addEntry(fiscalPeriodFields.fiscalMonthStartDateId   , (dateToId(fiscalMonthStart) < startId) ? undefinedDateId : dateToId(fiscalMonthStart));
  addEntry(fiscalPeriodFields.fiscalMonthEndDateId     , (dateToId(fiscalMonthEnd  ) > endId  ) ? undefinedDateId : dateToId(fiscalMonthEnd  ));
  addEntry(fiscalPeriodFields.fiscalMonthStartDate     , fiscalMonthStart.toFormat(fiscalPeriodFields.fiscalMonthStartDate.formatString)      );
  addEntry(fiscalPeriodFields.fiscalMonthEndDate       , fiscalMonthEnd  .toFormat(fiscalPeriodFields.fiscalMonthEndDate  .formatString)      );
  addEntry(fiscalPeriodFields.fiscalNumberOfDaysInMonth, currDate.daysInMonth                                                                 );
  addEntry(fiscalPeriodFields.fiscalDayInMonth         , currDate.day                                                                         );

  for (let j = 0; j <= 3; j++) {
    const fiscalQuarterStart   = fiscalYearStart.plus({ months: 3*j});
    const fiscalQuarterEnd     = fiscalYearStart.plus({ months: 3*(j+1), days: -1 });

    const fiscalQuarterStartId = dateToId(fiscalQuarterStart);
    const fiscalQuarterEndId   = dateToId(fiscalQuarterEnd  );

    if (fiscalQuarterStartId <= currDateId && currDateId <= fiscalQuarterEndId) {
      addEntry(fiscalPeriodFields.fiscalQuarter              , (4 + j) % 4 + 1                                                                    );
      addEntry(fiscalPeriodFields.fiscalQuarterStartDateId   , (fiscalQuarterStartId < startId) ? undefinedDateId : fiscalQuarterStartId          );
      addEntry(fiscalPeriodFields.fiscalQuarterEndDateId     , (fiscalQuarterEndId   > endId  ) ? undefinedDateId : fiscalQuarterEndId            );
      addEntry(fiscalPeriodFields.fiscalQuarterStartDate     , fiscalQuarterStart.toFormat(fiscalPeriodFields.fiscalQuarterStartDate.formatString));
      addEntry(fiscalPeriodFields.fiscalQuarterEndDate       , fiscalQuarterEnd  .toFormat(fiscalPeriodFields.fiscalQuarterEndDate  .formatString));
      addEntry(fiscalPeriodFields.fiscalNumberOfDaysInQuarter, Math.round(fiscalQuarterEnd.diff(fiscalQuarterStart, 'days').days)                 );
      addEntry(fiscalPeriodFields.fiscalDayInQuarter         , Math.round(currDate.diff(fiscalQuarterStart, 'day').days + 1)                      );
    }
  }
  
  addEntry(fiscalPeriodFields.fiscalYear              , (currDate < fiscalYearStart) ? prevFiscalYearStart.year : fiscalYearStart.year);
  addEntry(fiscalPeriodFields.fiscalYearStartDateId   , (dateToId(fiscalYearStart) < startId) ? undefined : dateToId(fiscalYearStart) );
  addEntry(fiscalPeriodFields.fiscalYearEndDateId     , (dateToId(fiscalYearEnd  ) > endId  ) ? undefined : dateToId(fiscalYearEnd  ) );
  addEntry(fiscalPeriodFields.fiscalYearStartDate     , fiscalYearStart.toFormat(fiscalPeriodFields.fiscalYearStartDate.formatString) );
  addEntry(fiscalPeriodFields.fiscalYearEndDate       , fiscalYearEnd  .toFormat(fiscalPeriodFields.fiscalYearEndDate  .formatString) );
  addEntry(fiscalPeriodFields.fiscalNumberOfDaysInYear, nextFiscalYearStart.daysInYear                                                );
}
