import generateDimDates from 'utilities/data-generator';

export default function PreviewTable({ options }) {
  const { headers: headers, rows: rows } = generateDimDates(options, 10, true);
  
  return (
    <div className="mb-2 text-xs overflow-auto">
      <table className="table w-full">
        <thead>
          <tr>
            {headers.map(x => <th key={x} className="normal-case">{x}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => <tr>{row.map(col => <td>{col}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}
