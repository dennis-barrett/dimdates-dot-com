import Link from 'next/link';

import Collapsible from "@components/Collapsible";
import DropDownList from "@components/DropDownList";
import { FieldOptions, FieldOptionsTable } from "@components/FieldOptions";
import PreviewTable from '@components/PreviewTable';

import { useState } from 'react';
import { exportCSV } from 'utilities/exporters';
import generateDimDates from 'utilities/data-generator';

export default function Generator() {
  const days = {
    Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7
  };
  const months = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
  };

  const [options, setOptions] = useState({
    startDate: '1999-06-28',
    endDate: '2049-12-31',
    fiscalYearStartDateStr: '1998-07-01', // TODO: this needs to be one year before the startDate
    basicFields: {
      id                            : { name: 'Id'                           , description: "Primary key."                                            , active: true, semanticIds: true          , order:   1 },
      date                          : { name: 'Date'                         , description: "The actual date for the record."                         , active: true, formatString: "yyyy-MM-dd" , order:   2 },
      dateLongDescription           : { name: 'DateLongDescription'          , description: "Full description of a date, e.g., Monday 1 January 2000.", active: true, formatString: "DDDD"       , order:   3 },
      dateShortDescription          : { name: 'DateShortDescription'         , description: "Short description of a date, e.g., 1 Jan 2000."          , active: true, formatString: "DD"         , order:   4 },
      dayLongName                   : { name: 'DayLongName'                  , description: "Full name of a day, e.g., Monday."                       , active: true, formatString: "EEEE"       , order:   5 },
      dayShortName                  : { name: 'DayShortName'                 , description: "Short name of a day, e.g., Mon."                         , active: true, formatString: "EEE"        , order:   6 },
      monthLongName                 : { name: 'MonthLongName'                , description: "Full name of a month, e.g., January."                    , active: true, formatString: "MMMM"       , order:   7 },
      monthShortName                : { name: 'MonthShortName'               , description: "Short name of a month, e.g., Jan."                       , active: true, formatString: "MMM"        , order:   8 },
      // quarterLongName               : { name: 'QuarterLongName'              , description: "Full name of a quarter, e.g., Quarter 1."                , active: true, formatString: "'Quarter 'q", order:   9 },
      // quarterShortName              : { name: 'QuarterShortName'             , description: "Short name of a quarter, e.g., Q1."                      , active: true, formatString: "'Q'q"       , order:  10 },
    },
    calendarPeriodFields: {
      calendarDay                   : { name: "CalendarDay"                  , description: "The day number in the calendar year."                     , active: true ,                             order: 100 },

      calendarWeek                  : { name: "CalendarWeek"                 , description: "The calendar week number in the year."                    , active: true ,                             order: 101 },
      calendarWeekStartDateId       : { name: "CalendarWeekStartDateId"      , description: "Foreign key indicating the calendar week's start date."   , active: true ,                             order: 102 },
      calendarWeekEndDateId         : { name: "CalendarWeekEndDateId"        , description: "Foreign key indicating the calendar week's end date."     , active: true ,                             order: 103 },
      calendarWeekStartDate         : { name: "CalendarWeekStartDate"        , description: "The calendar week's start date."                          , active: false, formatString: "yyyy-MM-dd", order: 104 },
      calendarWeekEndDate           : { name: "CalendarWeekEndDate"          , description: "The calendar week's end date."                            , active: false, formatString: "yyyy-MM-dd", order: 105 },
      calendarDayInWeek             : { name: "CalendarDayInWeek"            , description: "The day number in the week."                              , active: true ,                             order: 106 },

      calendarMonth                 : { name: "CalendarMonth"                , description: "The calendar month number in the year."                   , active: true ,                             order: 107 },
      calendarMonthStartDateId      : { name: "CalendarMonthStartDateId"     , description: "Foreign key indicating the calendar month's start date."  , active: true ,                             order: 108 },
      calendarMonthEndDateId        : { name: "CalendarMonthEndDateId"       , description: "Foreign key indicating the calendar month's end date."    , active: true ,                             order: 109 },
      calendarMonthStartDate        : { name: "CalendarMonthStartDate"       , description: "The calendar month's start date."                         , active: false, formatString: "yyyy-MM-dd", order: 110 },
      calendarMonthEndDate          : { name: "CalendarMonthEndDate"         , description: "The calendar month's end date."                           , active: false, formatString: "yyyy-MM-dd", order: 111 },
      calendarNumberOfDaysInMonth   : { name: "CalendarNumberOfDaysInMonth"  , description: "The number of days in the calendar month."                , active: true ,                             order: 112 },
      calendarDayInMonth            : { name: "CalendarDayInMonth"           , description: "The day number in the calendar month."                    , active: true ,                             order: 113 },

      calendarQuarter               : { name: "CalendarQuarter"              , description: "The calendar quarter number in the year."                 , active: true ,                             order: 114 },
      calendarQuarterStartDateId    : { name: "CalendarQuarterStartDateId"   , description: "Foreign key indicating the calendar quarter's start date.", active: true ,                             order: 115 },
      calendarQuarterEndDateId      : { name: "CalendarQuarterEndDateId"     , description: "Foreign key indicating the calendar quarter's end date."  , active: true ,                             order: 116 },
      calendarQuarterStartDate      : { name: "CalendarQuarterStartDate"     , description: "The calendar quarter's start date."                       , active: false, formatString: "yyyy-MM-dd", order: 117 },
      calendarQuarterEndDate        : { name: "CalendarQuarterEndDate"       , description: "The calendar quarter's end date."                         , active: false, formatString: "yyyy-MM-dd", order: 118 },
      calendarNumberOfDaysInQuarter : { name: "CalendarNumberOfDaysInQuarter", description: "The number of days in the calendar quarter."              , active: true ,                             order: 119 },
      calendarDayInQuarter          : { name: "CalendarDayInQuarter"         , description: "The day number in the calendar quarter."                  , active: true ,                             order: 120 },

      calendarYear                  : { name: "CalendarYear"                 , description: "The calendar year number."                                , active: true ,                             order: 121 },
      calendarYearStartDateId       : { name: "CalendarYearStartDateId"      , description: "Foreign key indicating the calendar year's start date."   , active: true ,                             order: 122 },
      calendarYearEndDateId         : { name: "CalendarYearEndDateId"        , description: "Foreign key indicating the calendar year's end date."     , active: true ,                             order: 123 },
      calendarYearStartDate         : { name: "CalendarYearStartDate"        , description: "The calendar year's start date."                          , active: false, formatString: "yyyy-MM-dd", order: 124 },
      calendarYearEndDate           : { name: "CalendarYearEndDate"          , description: "The calendar year's end date."                            , active: false, formatString: "yyyy-MM-dd", order: 125 },
      calendarNumberOfDaysInYear    : { name: "CalendarNumberOfDaysInYear"   , description: "The number of days in the calendar year."                 , active: true ,                             order: 126 },
    },
    fiscalPeriodOptions: {
      fiscalYearStartDateMonth: 7,
      fiscalYearStartDateDay: 1,
    },
    fiscalPeriodFields: {
      fiscalDay                   : { name: "FiscalDay"                  , description: "The fiscal day number in the year."                       , active: true ,                             order: 1000 },

      fiscalWeek                  : { name: "FiscalWeek"                 , description: "The fiscal week number in the year."                      , active: true ,                             order: 1001 },
      fiscalWeekStartDateId       : { name: "FiscalWeekStartDateId"      , description: "Foreign key indicating the fiscal week's start date."     , active: true ,                             order: 1002 },
      fiscalWeekEndDateId         : { name: "FiscalWeekEndDateId"        , description: "Foreign key indicating the fiscal week's end date."       , active: true ,                             order: 1003 },
      fiscalWeekStartDate         : { name: "FiscalWeekStartDate"        , description: "The fiscal week's start date."                            , active: false, formatString: "yyyy-MM-dd", order: 1004 },
      fiscalWeekEndDate           : { name: "FiscalWeekEndDate"          , description: "The fiscal week's end date."                              , active: false, formatString: "yyyy-MM-dd", order: 1005 },
      fiscalDayInWeek             : { name: "FiscalDayInWeek"            , description: "The day number in the week."                              , active: true ,                             order: 1006 },
      
      fiscalMonth                 : { name: "FiscalMonth"                , description: "The fiscal month number in the year."                     , active: true ,                             order: 1007 },
      fiscalMonthStartDateId      : { name: "FiscalMonthStartDateId"     , description: "Foreign key indicating the fiscal month's start date."    , active: true ,                             order: 1008 },
      fiscalMonthEndDateId        : { name: "FiscalMonthEndDateId"       , description: "Foreign key indicating the fiscal month's end date."      , active: true ,                             order: 1009 },
      fiscalMonthStartDate        : { name: "FiscalMonthStartDate"       , description: "The fiscal month's start date."                           , active: false, formatString: "yyyy-MM-dd", order: 1010 },
      fiscalMonthEndDate          : { name: "FiscalMonthEndDate"         , description: "The fiscal month's end date."                             , active: false, formatString: "yyyy-MM-dd", order: 1011 },
      fiscalNumberOfDaysInMonth   : { name: "FiscalNumberOfDaysInMonth"  , description: "The number of days in the fiscal month."                  , active: true ,                             order: 1012 },
      fiscalDayInMonth            : { name: "FiscalDayInMonth"           , description: "The day number in the fiscal month."                      , active: true ,                             order: 1013 },

      fiscalQuarter               : { name: "FiscalQuarter"              , description: "The fiscal quarter number in the year."                   , active: true ,                             order: 1014 },
      fiscalQuarterStartDateId    : { name: "FiscalQuarterStartDateId"   , description: "Foreign key indicating the fiscal quarter's start date."  , active: true ,                             order: 1015 },
      fiscalQuarterEndDateId      : { name: "FiscalQuarterEndDateId"     , description: "Foreign key indicating the fiscal quarter's end date."    , active: true ,                             order: 1016 },
      fiscalQuarterStartDate      : { name: "FiscalQuarterStartDate"     , description: "The fiscal quarter's start date."                         , active: false, formatString: "yyyy-MM-dd", order: 1017 },
      fiscalQuarterEndDate        : { name: "FiscalQuarterEndDate"       , description: "The fiscal quarter's end date."                           , active: false, formatString: "yyyy-MM-dd", order: 1018 },
      fiscalNumberOfDaysInQuarter : { name: "FiscalNumberOfDaysInQuarter", description: "The number of days in the fiscal quarter."                , active: true ,                             order: 1019 },
      fiscalDayInQuarter          : { name: "FiscalDayInQuarter"         , description: "The day number in the fiscal quarter."                    , active: true ,                             order: 1020 },

      fiscalYear                  : { name: "FiscalYear"                 , description: "The fiscal year number."                                  , active: true ,                             order: 1021 },
      fiscalYearStartDateId       : { name: "FiscalYearStartDateId"      , description: "Foreign key indicating the fiscal year's start date."     , active: true ,                             order: 1022 },
      fiscalYearEndDateId         : { name: "FiscalYearEndDateId"        , description: "Foreign key indicating the fiscal year's end date."       , active: true ,                             order: 1023 },
      fiscalYearStartDate         : { name: "FiscalYearStartDate"        , description: "The fiscal year's start date."                            , active: false, formatString: "yyyy-MM-dd", order: 1024 },
      fiscalYearEndDate           : { name: "FiscalYearEndDate"          , description: "The fiscal year's end date."                              , active: false, formatString: "yyyy-MM-dd", order: 1025 },
      fiscalNumberOfDaysInYear    : { name: "FiscalNumberOfDaysInYear"   , description: "The number of days in the fiscal year."                   , active: true ,                             order: 1026 },
      fiscalDayInYear             : { name: "FiscalDayInYear"            , description: "The day number in the fiscal year."                       , active: true ,                             order: 1027 },
    },
    flagFields: {
      isFirstDayOfWeek            : { name: "IsFirstDayOfWeek"           , description: "Indicates if the date is the first day of the week."      , active: true                                           },
      isLastDayOfWeek             : { name: "IsLastDayOfWeek"            , description: "Indicates if the date is the last day of the week."       , active: true                                           },
      isFirstDayOfMonth           : { name: "IsFirstDayOfMonth"          , description: "Indicates if the date is the first day of the month."     , active: true                                           },
      isLastDayOfMonth            : { name: "IsLastDayOfMonth"           , description: "Indicates if the date is the last day of the month."      , active: true                                           },
      isFirstDayOfYear            : { name: "IsFirstDayOfYear"           , description: "Indicates if the date is the first day of the year."      , active: true                                           },
      isLastDayOfYear             : { name: "IsLastDayOfYear"            , description: "Indicates if the date is the last day of the year."       , active: true                                           },
      isWeekend                   : { name: "IsWeekend"                  , description: "Indicates if the date falls on the weekend."              , active: true                                           },
      isLeapYear                  : { name: "IsLeapYear"                 , description: "Indicates if the date falls in a leap year."              , active: true                                           }
    }
  });

  const onStartDateChange = event => {
    options.basicFields.startDate = new Date(event.target.value).format('YYYY-MM-DD');
    setOptions(options);
  };

  const onEndDateChange = event => {
    options.basicFields.endDate = new Date(event.target.value).format('YYYY-MM-DD');
    setOptions(options);
  };

  const onCalendarWeekStartDayChange = event => {
    options.calendarPeriodFields.startDay = event.target.value;
    setOptions(options);
  };

  const onFiscalYearStartChange = event => {
    options.fiscalPeriodFields.startMonth = event.target.value;
    options.fiscalPeriodFields.startDay   = event.target.value;
    setOptions(options);
  };

  const onFiscalQuarterFormat = event => {
    options.fiscalPeriodFields.quarterFormat = event.target.value;
    setOptions(options);
  };

  const onFiscalWeekStartDay = event => {
    options.fiscalPeriodFields.weekStartDay = event.target.value;
    setOptions(options);
  };

  const onFiscalWeekPartialsAllowedChange = event => {
    options.fiscalPeriodFields.partialWeeksAQllowed = event.target.value;
    setOptions(options);
  };

  // Utility function to check whether all fields in the basic options, calendar period, or fiscal period options
  // are checked
  const areAllFieldsChecks = (fields) => 
    Object.values(fields).reduce((acc, x) => x.active && acc, true);

  const onOptionsChange = (tableId, fieldsName) => event => {
    setOptions(prevOptions => {
      const newOptions = {...prevOptions};

      if (event.target.id === tableId) {
        for (const field of Object.keys(prevOptions[fieldsName])) {
          newOptions[fieldsName][field].active = event.target.checked;
        }
      } else {
        newOptions[fieldsName][event.target.id].active = event.target.checked;
      }
     
      return newOptions;
    });
  };

  const downloadCSV = event => {
    const { headers: headers, rows: rows } = generateDimDates(options);
    let blob = exportCSV(headers, rows);

    let link = document.createElement("a");
    if (!link.download) {
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", "dimdates.csv");
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  }

  return (
    <div className="border-2 border-caribbean-green p-5">
      <h2 className="text-center text-2xl font-bold pb-5">GENERATOR</h2>

      <div className="alert text-sm p-5">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 w-6 h-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            Configure your desired fields and values below, or use the defaults and skip straight to
            exporting by clicking <b>PREVIEW</b> or <b>EXPORT</b>.
          </span>
        </div>
      </div>

      <a name="configure" />
      <div className="flex justify-center m-5">
        <ul className="steps">
          <li className="step step-primary text-sm text-primary pl-10 pr-10">
            <Link href='#configure'><b>CONFIGURE</b></Link>
          </li>
          <li className="step text-sm">
            <Link href='#preview'>PREVIEW</Link>
          </li>
          <li className="step text-sm">
            <Link href='#export'>EXPORT</Link>
          </li>
        </ul>
      </div>

      {/* ######################################################################################################### */}
      <Collapsible title="Basic Options">

        <div className="flex text-sm rounded-lg bg-blue-100 mb-5">
          <div className="block p-3 w-1/2">
          <div className="flex cursor-help" title="hover text">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="pb-3 pl-1">Start date</p>
            </div>
            <input
              className="border-2"
              type="date"
              id="begin-date"
              name="begin-date"
              value={options.startDate}
              onChange={onStartDateChange}
            />
          </div>

          <div className="block p-3 w-1/2">
          <div className="flex cursor-help" title="hover text">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="pb-3 pl-1">End date</p>
            </div>
            <input
              className="border-2"
              type="date"
              id="begin-date"
              name="begin-date"
              value={options.endDate}
              onChange={onEndDateChange}
            />
          </div>
        </div>

        <FieldOptionsTable
          id="basicOptions"
          checked={areAllFieldsChecks(options.basicFields)}
          onChange={onOptionsChange("basicOptions", "basicFields")}
        >
          {
            Object.entries(options.basicFields).map(entry =>
              <FieldOptions
                id={entry[0]}
                name={entry[1].name}
                description={entry[1].description}
                checked={entry[1].active}
                onChange={onOptionsChange("basicOptions", "basicFields")}
              />
            )
          }
        </FieldOptionsTable>
      </Collapsible>

      {/* ######################################################################################################### */}
      <Collapsible title="Calendar Period Options">
        <div className="flex text-sm rounded-lg bg-blue-100 mb-5">
          <div className="block p-3">
          <div className="flex cursor-help" title="hover text">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="pb-3 pl-1">Week start day</p>
            </div>
            <DropDownList
              title="Sun / Mon"
              options={['Sun', 'Mon']}
              onChange={onCalendarWeekStartDayChange}
            />
          </div>
        </div>

        <FieldOptionsTable
          id="calendarPeriodOptions"
          checked={areAllFieldsChecks(options.calendarPeriodFields)}
          onChange={onOptionsChange("calendarPeriodOptions", "calendarPeriodFields")}
        >
        {
            Object.entries(options.calendarPeriodFields).map(entry =>
              <FieldOptions
                id={entry[0]}
                name={entry[1].name}
                description={entry[1].description}
                checked={entry[1].active}
                onChange={onOptionsChange("calendarPeriodOptions", "calendarPeriodFields")}
              />
            )
          }
        </FieldOptionsTable>
      </Collapsible>

      {/* ######################################################################################################### */}
      <Collapsible title="Fiscal Period Options">
        <div className="flex text-sm rounded-lg bg-blue-100 mb-5">
          <div className="block p-3 w-1/4">
            <div className="flex cursor-help" title="hover text">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="pb-3 pl-1">Start date</p>
            </div>
            <DropDownList
              title="Month"
              options={Object.keys(months)}
              onChange={onFiscalYearStartChange}
            />

            <DropDownList
              title="Day"
              options={Object.keys(days)}
              onChange={onFiscalYearStartChange}
            />
          </div>

          <div className="block p-3 w-1/4">
            <div className="flex cursor-help" title="hover text">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="pb-3 pl-1">Quarter format</p>
            </div>
            <DropDownList
              title="Format"
              options={['4-4-5', '4-5-4', '5-4-4']}
              onChange={onFiscalQuarterFormat}
            />
          </div>

          <div className="block p-3 w-1/4">
          <div className="flex cursor-help" title="hover text">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="pb-3 pl-1">Week start day</p>
            </div>
            <DropDownList
              title="Sun / Mon"
              options={['Sun', 'Mon']}
              onChange={onFiscalWeekStartDay}
            />
          </div>

          <div className="block p-3 w-1/4">
            <div className="flex cursor-help" title="hover text">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="pb-3 pl-1">Allow partial weeks</p>
            </div>
            <div className="form-control">
              <input className="toggle toggle-sm mx-auto" type="checkbox" onChange={onFiscalWeekPartialsAllowedChange} />
              <label className="label"></label>
            </div>
          </div>
        </div>

        <FieldOptionsTable
          id="fiscalPeriodOptions"
          checked={areAllFieldsChecks(options.fiscalPeriodFields)}
          onChange={onOptionsChange("fiscalPeriodOptions", "fiscalPeriodFields")}
        >
          {
            Object.entries(options.fiscalPeriodFields).map(entry =>
              <FieldOptions
                id={entry[0]}
                name={entry[1].name}
                description={entry[1].description}
                checked={entry[1].active}
                onChange={onOptionsChange("fiscalPeriodOptions", "fiscalPeriodFields")}
              />
            )
          }
        </FieldOptionsTable>
      </Collapsible>

      {/* ######################################################################################################### */}
      <Collapsible title="Flag Options">
        <FieldOptionsTable
          id="flagOptions"
          checked={areAllFieldsChecks(options.flagFields)}
          onChange={onOptionsChange("flagOptions", "flagFields")}
        >
          {
            Object.entries(options.flagFields).map(entry =>
              <FieldOptions
                id={entry[0]}
                name={entry[1].name}
                description={entry[1].description}
                checked={entry[1].active}
                onChange={onOptionsChange("flagOptions", "flagFields")}
              />
            )
          }
        </FieldOptionsTable>
      </Collapsible>

      <a name="preview" />
      <div className="flex justify-center m-5">
        <ul className="steps">
          <li className="step step-primary text-sm pl-10 pr-10">
            <Link href='#configure'>CONFIGURE</Link>
          </li>
          <li className="step step-primary text-sm text-primary">
            <Link href='#preview'><b>PREVIEW</b></Link>
          </li>
          <li className="step text-sm">
            <Link href='#export'>EXPORT</Link>
          </li>
        </ul>
      </div>

      {/* ######################################################################################################### */}
      <Collapsible title="Preview Data">
        <PreviewTable options={options} />
      </Collapsible>

      <a name="export" />
      <div className="flex justify-center m-5">
        <ul className="steps">
          <li className="step step-primary text-sm pl-10 pr-10">
            <Link href='#configure'>CONFIGURE</Link>
          </li>
          <li className="step step-primary text-sm">
            <Link href='#preview'>PREVIEW</Link>
          </li>
          <li className="step step-primary text-sm text-primary">
            <Link href='#export'><b>EXPORT</b></Link>
          </li>
        </ul>
      </div>

      {/* ######################################################################################################### */}
      <Collapsible title="Export Options">
        {/* <div className="flex justify-center items-center pb-5">
          <div className="form-control flex mx-auto">
            <input type="radio" name="radio-10" className="radio" checked />
            <label className="label">
              <span className="label-text">SQL</span> 
            </label>
          </div>
          <div className="form-control flex mx-auto">
            <input type="radio" name="radio-10" className="radio" checked />
            <label className="label">
              <span className="label-text">CSV</span> 
            </label>
          </div>
        </div> */}
        {/* <div className="tabs flex justify-center items-center pb-5">
          <div className="tab tab-bordered tab-active">SQL</div> 
          <a className="tab tab-bordered">CSV</a> 
          <a className="tab tab-bordered">JSON</a>
        </div>
        <DropDownList title="SQL dialect" options={["SQL-92", "Spark SQL"]} /> */}
        <div className="text-sm">
          <p>
            (Only CSV export supported for now; SQL and JSON support coming soon.)
          </p>
        </div>
      </Collapsible>

      <div className="flex justify-center mt-5">
        <button className="btn btn-secondary" onClick={downloadCSV}>download data</button>
      </div>
    </div>
  );
}
