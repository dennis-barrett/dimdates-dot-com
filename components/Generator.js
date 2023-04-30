import Link from 'next/link';

import Collapsible from "@components/Collapsible";
import DropDownList from "@components/DropDownList";
import { FieldOptions, FieldOptionsTable } from "@components/FieldOptions";
import PreviewTable from '@components/PreviewTable';

import { useState } from 'react';
import { exportCSV } from 'utilities/exporters';
import generateDimDates from 'utilities/data-generator';

export default function Generator() {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const [options, setOptions] = useState({
    startDate: '2000-01-01',
    endDate: '2049-12-31',
    basicFields: {
      id                            : { name: 'Id'                           , description: "Primary key."                                            , active: true, semanticIds: true          , order:   1 },
      date                          : { name: 'Date'                         , description: "The actual date for the record."                         , active: true, formatString: "yyyy-MM-dd" , order:   2 },
      dateLongDescription           : { name: 'DateLongDescription'          , description: "Full description of a date, e.g., Monday 1 January 2000.", active: true, formatString: "DDDD"       , order:   3 },
      dateShortDescription          : { name: 'DateShortDescription'         , description: "Short description of a date, e.g., 1 Jan 2000."          , active: true, formatString: "DD"         , order:   4 },
      dayLongName                   : { name: 'DayLongName'                  , description: "Full name of a day, e.g., Monday."                       , active: true, formatString: "EEEE"       , order:   5 },
      dayShortName                  : { name: 'DayShortName'                 , description: "Short name of a day, e.g., Mon."                         , active: true, formatString: "EEE"        , order:   6 },
      monthLongName                 : { name: 'MonthLongName'                , description: "Full name of a month, e.g., January."                    , active: true, formatString: "MMMM"       , order:   7 },
      monthShortName                : { name: 'MonthShortName'               , description: "Short name of a month, e.g., Jan."                       , active: true, formatString: "MMM"        , order:   8 },
      quarterLongName               : { name: 'QuarterLongName'              , description: "Full name of a quarter, e.g., Quarter 1."                , active: true, formatString: "'Quarter 'q", order:   9 },
      quarterShortName              : { name: 'QuarterShortName'             , description: "Short name of a quarter, e.g., Q1."                      , active: true, formatString: "'Q'q"       , order:  10 },
    },
    calendarPeriodFields: {
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
      calendarDayInYear             : { name: "CalendarDayInYear"            , description: "The day number in the calendar year."                     , active: true ,                             order: 127 },
    },
    fiscalPeriodFields: {
      fiscalWeekNumber              : { name: "FiscalWeekNumber"             , description: "Week number enumeration."                                 , active: true                                          },
      fiscalWeekStartDateId         : { name: "FiscalWeekStartDateId"        , description: "Foreign key indicating the fiscal week's start date."     , active: true                                          },
      fiscalWeekEndDateId           : { name: "FiscalWeekEndDateId"          , description: "Foreign key indicating the fiscal week's end date."       , active: true                                          },
      fiscalWeekStartDate           : { name: "FiscalWeekStartDate"          , description: "..."                                                      , active: false                                         },
      fiscalWeekEndDate             : { name: "FiscalWeekEndDate"            , description: "..."                                                      , active: false                                         },
      fiscalMonthNumber             : { name: "FiscalMonthNumber"            , description: "..."                                                      , active: true                                          },
      fiscalMonthStartDateId        : { name: "FiscalMonthStartDateId"       , description: "Foreign key indicating the fiscal month's start date."    , active: true                                          },
      fiscalMonthEndDateId          : { name: "FiscalMonthEndDateId"         , description: "Foreign key indicating the fiscal month's end date."      , active: true                                          },
      fiscalMonthStartDate          : { name: "FiscalMonthStartDate"         , description: "..."                                                      , active: false                                         },
      fiscalMonthEndDate            : { name: "FiscalMonthEndDate"           , description: "..."                                                      , active: false                                         },
      fiscalQuarterNumber           : { name: "FiscalQuarterNumber"          , description: "..."                                                      , active: true                                          },
      fiscalQuarterStartDateId      : { name: "FiscalQuarterStartDateId"     , description: "Foreign key indicating the fiscal quarter's start date."  , active: true                                          },
      fiscalQuarterEndDateId        : { name: "FiscalQuarterEndDateId"       , description: "Foreign key indicating the fiscal quarter's end date."    , active: true                                          },
      fiscalQuarterStartDate        : { name: "FiscalQuarterStartDate"       , description: "..."                                                      , active: false                                         },
      fiscalQuarterEndDate          : { name: "FiscalQuarterEndDate"         , description: "..."                                                      , active: false                                         },
      fiscalYear                    : { name: "FiscalYear"                   , description: "..."                                                      , active: true                                          },
    },
    flagFields: {
      isFirstDayOfWeek              : { name: "IsFirstDayOfWeek"             , description: "Indicates if the date is the first day of the week."      , active: true                                          },
      isLastDayOfWeek               : { name: "IsLastDayOfWeek"              , description: "Indicates if the date is the last day of the week."       , active: true                                          },
      isFirstDayOfMonth             : { name: "IsFirstDayOfMonth"            , description: "Indicates if the date is the first day of the month."     , active: true                                          },
      isLastDayOfMonth              : { name: "IsLastDayOfMonth"             , description: "Indicates if the date is the last day of the month."      , active: true                                          },
      isFirstDayOfYear              : { name: "IsFirstDayOfYear"             , description: "Indicates if the date is the first day of the year."      , active: true                                          },
      isLastDayOfYear               : { name: "IsLastDayOfYear"              , description: "Indicates if the date is the last day of the year."       , active: true                                          },
      isWeekend                     : { name: "IsWeekend"                    , description: "Indicates if the date falls on the weekend."              , active: true                                          },
      isLeapYear                    : { name: "IsLeapYear"                   , description: "Indicates if the date falls in a leap year."              , active: true                                          }
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

  // Utility functions to check whether all fields in the basic options,calendar period, or fiscal period options
  // are checked
  const areBasicFieldsAllChecked          = () => Object.values(options.basicFields         ).reduce((acc, x) => x.active && acc, true);
  const areCalendarPeriodFieldsAllChecked = () => Object.values(options.calendarPeriodFields).reduce((acc, x) => x.active && acc, true);
  const areFiscalPeriodFieldsAllChecked   = () => Object.values(options.fiscalPeriodFields  ).reduce((acc, x) => x.active && acc, true);
  const areFlagFieldsAllChecked           = () => Object.values(options.flagFields          ).reduce((acc, x) => x.active && acc, true);

  const onBasicOptionsChange = event => {
    // If the `id` is the whole table, i.e., "basicOptions", then we apply the change
    // to all basic options fields.

    setOptions(prevOptions => {
      const newOptions = {...prevOptions};

      if (event.target.id === "basicOptions") {
        for (const field of Object.keys(prevOptions.basicFields)) {
          newOptions.basicFields[field].active = event.target.checked;
        }
      } else {
        newOptions.basicFields[event.target.id].active = event.target.checked;
      }
     
      return newOptions;
    });
  };

  const onCalendarPeriodOptionsChange = event => {
    options.calendarPeriodFields[event.target.id].active = event.target.checked;
    setOptions(options);
  };

  const onFiscalPeriodOptionsChange = event => {
    options.fiscalPeriodFields[event.target.id].active = event.target.checked;
    setOptions(options);
  };

  const onFlagOptionsChange = event => {
    options.flagFields[event.target.id].active = event.target.checked;
    setOptions(options);
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

      <Collapsible title="Basic Options">

        <div className="text-sm w-4/5 columns-2 mx-auto pb-5">
          <div className="flex">
            <p className="pr-2">Begin date:</p>
            <input
              className="border-2"
              type="date"
              id="begin-date"
              name="begin-date"
              value={options.startDate}
              onChange={onStartDateChange}
            />
          </div>

          <div className="flex">
            <p className="pr-2">End date:</p>
            <input
              className="border-2"
              type="date"
              id="end-date"
              name="end-date"
              value={options.endDate}
              onChange={onEndDateChange}
            />
          </div>
        </div>

        <FieldOptionsTable id="basicOptions" checked={areBasicFieldsAllChecked()} onChange={onBasicOptionsChange}>
          {
            Object.entries(options.basicFields).map(entry =>
              <FieldOptions
                id={entry[0]}
                name={entry[1].name}
                description={entry[1].description}
                checked={entry[1].active}
                onChange={onBasicOptionsChange}
              />
            )
          }
        </FieldOptionsTable>
      </Collapsible>

      <Collapsible title="Calendar Period Options" checked={areCalendarPeriodFieldsAllChecked()} onChange={onCalendarPeriodOptionsChange}>
        <FieldOptionsTable>
        {
            Object.entries(options.calendarPeriodFields).map(entry =>
              <FieldOptions
                id={entry[0]}
                name={entry[1].name}
                description={entry[1].description}
                checked={entry[1].active}
                onChange={onCalendarPeriodOptionsChange}
              />
            )
          }
        </FieldOptionsTable>
      </Collapsible>

      <Collapsible title="Fiscal Period Options" checked={areFiscalPeriodFieldsAllChecked()} onChange={onFiscalPeriodOptionsChange}>
        <DropDownList title="Start of fiscal year" options={months} />

        <FieldOptionsTable>
          {
            Object.entries(options.fiscalPeriodFields).map(entry =>
              <FieldOptions
                id={entry[0]}
                name={entry[1].name}
                description={entry[1].description}
                checked={entry[1].active}
                onChange={onFiscalPeriodOptionsChange}
              />
            )
          }
        </FieldOptionsTable>
      </Collapsible>

      <Collapsible title="Flag Options" checked={areFlagFieldsAllChecked()} onChange={onFlagOptionsChange}>
        <FieldOptionsTable>
        {
            Object.entries(options.flagFields).map(entry =>
              <FieldOptions
                id={entry[0]}
                name={entry[1].name}
                description={entry[1].description}
                checked={entry[1].active}
                onChange={onFlagOptionsChange}
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

      <p>

      </p>

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
