export default function DropDownList({ title, options }) {
  return (
    <div className="pb-2">
      <select className="select select-secondary select-sm w-full max-w-xs">
        <option disabled selected>{title}</option>
        { options.map(opt => <option key={opt}>{opt}</option>) }
      </select>
    </div>
  );
}
