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

  // Options to add:
  //   - "Unknown date" option
  //   - Validate column names to prevent weird stuff
  //   - Loading icon when download is processing
  //   - SQL code that will generate the dimdates table?

  const [options, setOptions] = useState({
    startDate: '2000-01-01',
    endDate: '2049-12-31',
    basicFields: {
      id                         : { name: 'Id'                        , active: true, semanticIds: true          , order:  1 },
      date                       : { name: 'Date'                      , active: true                             , order:  2 },
      dateLongDescription        : { name: 'DateLongDescription'       , active: true, formatString: 'DDDD'       , order:  3 },
      dateShortDescription       : { name: 'DateShortDescription'      , active: true, formatString: 'DD'         , order:  4 },
      dayLongName                : { name: 'DayLongName'               , active: true, formatString: "EEEE"       , order:  5 },
      dayShortName               : { name: 'DayShortName'              , active: true, formatString: "EEE"        , order:  6 },
      monthLongName              : { name: 'MonthLongName'             , active: true, formatString: "MMMM"       , order:  7 },
      monthShortName             : { name: 'MonthShortName'            , active: true, formatString: "MMM"        , order:  8 },
      quarterLongName            : { name: 'QuarterLongName'           , active: true, formatString: "'Quarter 'q", order:  9 },
      quarterShortName           : { name: 'QuarterShortName'          , active: true, formatString: "'Q'q"       , order: 10 },
    },
    calendarPeriodFields: {
      calendarWeekNumber         : { name: "CalendarWeekNumber"        , active: true                      },
      calendarWeekStartDateId    : { name: "CalendarWeekStartDateId"   , active: true                      },
      calendarWeekEndDateId      : { name: "CalendarWeekEndDateId"     , active: true                      },
      calendarWeekStartDate      : { name: "CalendarWeekStartDate"     , active: false                     },
      calendarWeekEndDate        : { name: "CalendarWeekEndDate"       , active: false                     },
      calendarMonthNumber        : { name: "CalendarMonthNumber"       , active: true                      },
      calendarMonthStartDateId   : { name: "CalendarMonthStartDateId"  , active: true                      },
      calendarMonthEndDateId     : { name: "CalendarMonthEndDateId"    , active: true                      },
      calendarMonthStartDate     : { name: "CalendarMonthStartDate"    , active: false                     },
      calendarMonthEndDate       : { name: "CalendarMonthEndDate"      , active: false                     },
      calendarQuarterNumber      : { name: "CalendarQuarterNumber"     , active: true                      },
      calendarQuarterStartDateId : { name: "CalendarQuarterStartDateId", active: true                      },
      calendarQuarterEndDateId   : { name: "CalendarQuarterEndDateId"  , active: true                      },
      calendarQuarterStartDate   : { name: "CalendarQuarterStartDate"  , active: false                     },
      calendarQuarterEndDate     : { name: "CalendarQuarterEndDate"    , active: false                     },
      calendarYear               : { name: "CalendarYear"              , active: true                      },
    },
    fiscalPeriodFields: {
      fiscalWeekNumber           : { name: "FiscalWeekNumber"          , active: true                      },
      fiscalWeekStartDateId      : { name: "FiscalWeekStartDateId"     , active: true                      },
      fiscalWeekEndDateId        : { name: "FiscalWeekEndDateId"       , active: true                      },
      fiscalWeekStartDate        : { name: "FiscalWeekStartDate"       , active: false                     },
      fiscalWeekEndDate          : { name: "FiscalWeekEndDate"         , active: false                     },
      fiscalMonthNumber          : { name: "FiscalMonthNumber"         , active: true                      },
      fiscalMonthStartDateId     : { name: "FiscalMonthStartDateId"    , active: true                      },
      fiscalMonthEndDateId       : { name: "FiscalMonthEndDateId"      , active: true                      },
      fiscalMonthStartDate       : { name: "FiscalMonthStartDate"      , active: false                     },
      fiscalMonthEndDate         : { name: "FiscalMonthEndDate"        , active: false                     },
      fiscalQuarterNumber        : { name: "FiscalQuarterNumber"       , active: true                      },
      fiscalQuarterStartDateId   : { name: "FiscalQuarterStartDateId"  , active: true                      },
      fiscalQuarterEndDateId     : { name: "FiscalQuarterEndDateId"    , active: true                      },
      fiscalQuarterStartDate     : { name: "FiscalQuarterStartDate"    , active: false                     },
      fiscalQuarterEndDate       : { name: "FiscalQuarterEndDate"      , active: false                     },
      fiscalYear                 : { name: "FiscalYear"                , active: true                      },
    },
    flagFields: {
      isFirstDayOfWeek           : { name: "IsFirstDayOfWeek"          , active: true                      },
      isLastDayOfWeek            : { name: "IsLastDayOfWeek"           , active: true                      },
      isFirstDayOfMonth          : { name: "IsFirstDayOfMonth"         , active: true                      },
      isLastDayOfMonth           : { name: "IsLastDayOfMonth"          , active: true                      },
      isFirstDayOfYear           : { name: "IsFirstDayOfYear"          , active: true                      },
      isLastDayOfYear            : { name: "IsLastDayOfYear"           , active: true                      },
      isWeekend                  : { name: "IsWeekend"                 , active: true                      },
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

        <div className="text-sm w-3/5 columns-2 mx-auto pb-5">
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
          <FieldOptions id="id"                         name="Id"                             description="Primary key"                                             checked={options.basicFields.id                  .active} options="semantic IDs"  onChange={onBasicOptionsChange} />
          <FieldOptions id="date"                       name="Date"                           description="The actual date for the record"                          checked={options.basicFields.date                .active}                         onChange={onBasicOptionsChange} />
          <FieldOptions id="dateLongDescription"        name="DateLongDescription"            description="Full description of a date, e.g., Monday 1 January 2000" checked={options.basicFields.dateLongDescription .active} options="format string" onChange={onBasicOptionsChange} />
          <FieldOptions id="dateShortDescription"       name="DateShortDescription"           description="Short description of a date, e.g., 1 Jan 2000"           checked={options.basicFields.dateShortDescription.active} options="format string" onChange={onBasicOptionsChange} />
          <FieldOptions id="dayLongName"                name="DayLongName"                    description="Full name of a day, e.g., Monday"                        checked={options.basicFields.dayLongName         .active}                         onChange={onBasicOptionsChange} />
          <FieldOptions id="dayShortName"               name="DayShortName"                   description="Short name of a day, e.g., Mon"                          checked={options.basicFields.dayShortName        .active}                         onChange={onBasicOptionsChange} />
          <FieldOptions id="monthLongName"              name="MonthLongName"                  description="Full name of a month, e.g., January"                     checked={options.basicFields.monthLongName       .active}                         onChange={onBasicOptionsChange} />
          <FieldOptions id="monthShortName"             name="MonthShortName"                 description="Short name of a month, e.g., Jan"                        checked={options.basicFields.monthShortName      .active}                         onChange={onBasicOptionsChange} />
          <FieldOptions id="quarterLongName"            name="QuarterLongName"                description="Full name of a quarter, e.g., Quarter 1"                 checked={options.basicFields.quarterLongName     .active}                         onChange={onBasicOptionsChange} />
          <FieldOptions id="quarterShortName"           name="QuarterShortName"               description="Short name of a quarter, e.g., Q1"                       checked={options.basicFields.quarterShortName    .active}                         onChange={onBasicOptionsChange} />
        </FieldOptionsTable>
      </Collapsible>

      <Collapsible title="Calendar Period Options">
        <FieldOptionsTable>
          <FieldOptions id="calendarWeekNumber"         name="CalendarWeekNumber"             description="Week number enumeration"                                                         onChange={onCalendarPeriodOptionsChange} />
          <FieldOptions id="calendarWeekStartDateId"    name="CalendarWeekStartDateId"        description="Foreign key indicating the calendar week's start date"                           onChange={onCalendarPeriodOptionsChange} />
          <FieldOptions id="calendarWeekEndDateId"      name="CalendarWeekEndDateId"          description="Foreign key indicating the calendar week's end date"                             onChange={onCalendarPeriodOptionsChange} />
          <FieldOptions id="calendarWeekStartDate"      name="CalendarWeekStartDate"          description="..."                                                     unchecked               onChange={onCalendarPeriodOptionsChange} />
          <FieldOptions id="calendarWeekEndDate"        name="CalendarWeekEndDate"            description="..."                                                     unchecked               onChange={onCalendarPeriodOptionsChange} />
 
          <FieldOptions id="calendarMonthNumber"        name="CalendarMonthNumber"            description="..."                                                                             onChange={onCalendarPeriodOptionsChange} />
          <FieldOptions id="calendarMonthStartDateId"   name="CalendarMonthStartDateId"       description="Foreign key indicating the calendar month's start date"                          onChange={onCalendarPeriodOptionsChange} />
          <FieldOptions id="calendarMonthEndDateId"     name="CalendarMonthEndDateId"         description="Foreign key indicating the calendar month's end date"                            onChange={onCalendarPeriodOptionsChange} />
          <FieldOptions id="calendarMonthStartDate"     name="CalendarMonthStartDate"         description="..."                                                     unchecked               onChange={onCalendarPeriodOptionsChange} />
          <FieldOptions id="calendarMonthEndDate"       name="CalendarMonthEndDate"           description="..."                                                     unchecked               onChange={onCalendarPeriodOptionsChange} />

          <FieldOptions id="calendarQuarterNumber"      name="CalendarQuarterNumber"          description="..."                                                                             onChange={onCalendarPeriodOptionsChange} />
          <FieldOptions id="calendarQuarterStartDateId" name="CalendarQuarterStartDateId"     description="Foreign key indicating the calendar quarter's start date"                        onChange={onCalendarPeriodOptionsChange} />
          <FieldOptions id="calendarQuarterEndDateId"   name="CalendarQuarterEndDateId"       description="Foreign key indicating the calendar quarter's end date"                          onChange={onCalendarPeriodOptionsChange} />
          <FieldOptions id="calendarQuarterStartDate"   name="CalendarQuarterStartDate"       description="..."                                                     unchecked               onChange={onCalendarPeriodOptionsChange} />
          <FieldOptions id="calendarQuarterEndDate"     name="CalendarQuarterEndDate"         description="..."                                                     unchecked               onChange={onCalendarPeriodOptionsChange} />

          <FieldOptions id="calendarYear"               name="CalendarYear"                   description="..."                                                                             onChange={onCalendarPeriodOptionsChange} />
        </FieldOptionsTable>
      </Collapsible>

      <Collapsible title="Fiscal Period Options">
        <DropDownList title="Start of fiscal year" options={months} />

        <FieldOptionsTable>
          <FieldOptions id="fiscalWeekNumber"           name="FiscalWeekNumber"               description="Week number enumeration"                                                         onChange={onFiscalPeriodOptionsChange} />
          <FieldOptions id="fiscalWeekStartDateId"      name="FiscalWeekStartDateId"          description="Foreign key indicating the fiscal week's start date"                             onChange={onFiscalPeriodOptionsChange} />
          <FieldOptions id="fiscalWeekEndDateId"        name="FiscalWeekEndDateId"            description="Foreign key indicating the fiscal week's end date"                               onChange={onFiscalPeriodOptionsChange} />
          <FieldOptions id="fiscalWeekStartDate"        name="FiscalWeekStartDate"            description="..."                                                     unchecked               onChange={onFiscalPeriodOptionsChange} />
          <FieldOptions id="fiscalWeekEndDate"          name="FiscalWeekEndDate"              description="..."                                                     unchecked               onChange={onFiscalPeriodOptionsChange} />

          <FieldOptions id="fiscalMonthNumber"          name="FiscalMonthNumber"              description="..."                                                                             onChange={onFiscalPeriodOptionsChange} />
          <FieldOptions id="fiscalMonthStartDateId"     name="FiscalMonthStartDateId"         description="Foreign key indicating the fiscal month's start date"                            onChange={onFiscalPeriodOptionsChange} />
          <FieldOptions id="fiscalMonthEndDateId"       name="FiscalMonthEndDateId"           description="Foreign key indicating the fiscal month's end date"                              onChange={onFiscalPeriodOptionsChange} />
          <FieldOptions id="fiscalMonthStartDate"       name="FiscalMonthStartDate"           description="..."                                                     unchecked               onChange={onFiscalPeriodOptionsChange} />
          <FieldOptions id="fiscalMonthEndDate"         name="FiscalMonthEndDate"             description="..."                                                     unchecked               onChange={onFiscalPeriodOptionsChange} />

          <FieldOptions id="fiscalQuarterNumber"        name="FiscalQuarterNumber"            description="..."                                                                             onChange={onFiscalPeriodOptionsChange} />
          <FieldOptions id="fiscalQuarterStartDateId"   name="FiscalQuarterStartDateId"       description="Foreign key indicating the fiscal quarter's start date"                          onChange={onFiscalPeriodOptionsChange} />
          <FieldOptions id="fiscalQuarterEndDateId"     name="FiscalQuarterEndDateId"         description="Foreign key indicating the fiscal quarter's end date"                            onChange={onFiscalPeriodOptionsChange} />
          <FieldOptions id="fiscalQuarterStartDate"     name="FiscalQuarterStartDate"         description="..."                                                     unchecked               onChange={onFiscalPeriodOptionsChange} />
          <FieldOptions id="fiscalQuarterEndDate"       name="FiscalQuarterEndDate"           description="..."                                                     unchecked               onChange={onFiscalPeriodOptionsChange} />

          <FieldOptions id="fiscalYear"                 name="FiscalYear"                     description="..."                                                                             onChange={onFiscalPeriodOptionsChange} />
        </FieldOptionsTable>
      </Collapsible>

      <Collapsible title="Flag Options">
        <FieldOptionsTable unchecked>
          <FieldOptions id="isFirstDayOfWeek"           name="IsFirstDayOfWeek"               description="indicates if the date is the first day of the week"      unchecked               onChange={onFlagOptionsChange} />
          <FieldOptions id="isLastDayOfWeek"            name="IsLastDayOfWeek"                description="indicates if the date is the last day of the week"       unchecked               onChange={onFlagOptionsChange} />
          <FieldOptions id="isFirstDayOfMonth"          name="IsFirstDayOfMonth"              description="indicates if the date is the first day of the month"     unchecked               onChange={onFlagOptionsChange} />
          <FieldOptions id="isLastDayOfMonth"           name="IsLastDayOfMonth"               description="indicates if the date is the last day of the month"      unchecked               onChange={onFlagOptionsChange} />
          <FieldOptions id="isFirstDayOfYear"           name="IsFirstDayOfYear"               description="indicates if the date is the first day of the year"      unchecked               onChange={onFlagOptionsChange} />
          <FieldOptions id="isLastDayOfYear"            name="IsLastDayOfYear"                description="indicates if the date is the last day of the year"       unchecked               onChange={onFlagOptionsChange} />
          <FieldOptions id="isWeekend"                  name="IsWeekend"                      description="indicates if the date falls on the weekend"              unchecked               onChange={onFlagOptionsChange} />
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
        <div className="tabs flex justify-center items-center pb-5">
          <div className="tab tab-bordered tab-active">SQL</div> 
          <a className="tab tab-bordered">CSV</a> 
          <a className="tab tab-bordered">JSON</a>
        </div>
        <DropDownList title="SQL dialect" options={["SQL-92", "Spark SQL"]} />
      </Collapsible>

      <div className="flex justify-center mt-5">
        <button className="btn btn-secondary" onClick={downloadCSV}>download data</button>
      </div>
    </div>
  );
}
