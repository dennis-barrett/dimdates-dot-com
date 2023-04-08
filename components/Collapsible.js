export default function Collapsible({ title, children }) {
  return (
    <div className="collapse collapse-arrow border-2 border-gray mb-2">
      <input type="checkbox" className="peer" /> 
      <div className="collapse-title">
        {title}
      </div>
      <div className="collapse-content">
        {children}
      </div>
    </div>
  );
}
