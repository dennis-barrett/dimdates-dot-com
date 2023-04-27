export function FieldOptions({ id, name, description, options, checked, onChange }) {  
  let options_content = null;

  if (options) {
    options_content = (
      <div className="form-control flex">
        <input className="toggle toggle-xs" type="checkbox" />
        <label className="label">{options}</label>
      </div>
    );
  }

  return (
    <tr>
      <td className="w-1/12">
        <label>
          <input id={id} className="checkbox checkbox-xs checkbox-primary" type="checkbox" checked={checked} onChange={onChange} />
        </label>
      </td>
      <td className="w-3/12">
        <input type="text" defaultValue={name} className="input input-bordered input-xs w-full max-w-xs font-Fira" />
      </td>
      <td className="w-5/12">
        {description}
      </td>
      <td className="w-3/12">
        {options_content}
      </td>
    </tr>
  );
}


export function FieldOptionsTable({ id, checked, onChange, children }) {
  const headers = [
    [
      <label>
        <input
          className="checkbox checkbox-xs checkbox-primary"
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
      </label>,
      'w-1/12'
    ],
    ['Field Name' , 'w-3/12'],
    ['Description', 'w-5/12'],
    ['Options'    , 'w-3/12']
  ];

  return (
    <div className="mb-2 text-xs">
      <table className="table table-fixed w-full">
        {/* -- head ----------------------------------------------------- */}
        <thead>
          <tr>
            {headers.map(x => <th className={x[1]}>{x[0]}</th>)}
          </tr>
        </thead>
        {/* -- body ----------------------------------------------------- */}
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
}
