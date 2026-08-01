"use client";

export default function ListSection({ title, icon, color, bg, items, fields, onAdd, onUpdate, onRemove, emptyText }) {
  return (
    <div
      className="bg-paper border border-line rounded-xl p-4 mb-4"
      style={{ borderLeftWidth: 4, borderLeftColor: color }}
    >
      <div className="flex items-center gap-2.5 mb-3.5">
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[15px] flex-none"
          style={{ background: bg }}
        >
          {icon}
        </span>
        <h2 className="font-display text-[13.5px] uppercase tracking-wider m-0" style={{ color }}>
          {title}
        </h2>
      </div>

      {items.length === 0 && <p className="text-[11.5px] text-muted mb-3">{emptyText}</p>}

      {items.map((item) => (
        <div key={item.id} className="border-2 border-dashed border-line rounded-lg p-4 mb-3 relative">
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="absolute top-2.5 right-2.5 bg-warnsoft text-warn text-[11px] font-semibold rounded-md px-2.5 py-1.5 hover:opacity-80"
          >
            Remove
          </button>

          <div className="flex flex-wrap gap-3">
            {fields.map((f) =>
              f.type === "textarea" ? (
                <div key={f.key} className="flex-1 min-w-[140px] w-full mb-1">
                  <label className="block text-[12px] font-semibold text-inksoft mb-1">{f.label}</label>
                  <textarea
                    className="w-full border-2 border-line rounded-lg px-3.5 py-3 text-[14.5px] bg-[#FCFCFB] transition-all focus:outline-none focus:bg-white min-h-[70px] resize-y"
                    onFocus={(e) => {
                      e.target.style.borderColor = color;
                      e.target.style.boxShadow = `0 0 0 4px ${color}26`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "";
                      e.target.style.boxShadow = "";
                    }}
                    placeholder={f.placeholder}
                    value={item[f.key] || ""}
                    onChange={(e) => onUpdate(item.id, f.key, e.target.value)}
                  />
                </div>
              ) : (
                <div key={f.key} className="flex-1 min-w-[140px] mb-1">
                  <label className="block text-[12px] font-semibold text-inksoft mb-1">{f.label}</label>
                  <input
                    className="w-full border-2 border-line rounded-lg px-3.5 py-3 text-[14.5px] bg-[#FCFCFB] transition-all focus:outline-none focus:bg-white"
                    onFocus={(e) => {
                      e.target.style.borderColor = color;
                      e.target.style.boxShadow = `0 0 0 4px ${color}26`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "";
                      e.target.style.boxShadow = "";
                    }}
                    placeholder={f.placeholder}
                    value={item[f.key] || ""}
                    onChange={(e) => onUpdate(item.id, f.key, e.target.value)}
                  />
                </div>
              )
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="w-full font-semibold text-[13.5px] rounded-lg py-3 transition-opacity hover:opacity-85"
        style={{ background: bg, color }}
      >
        + Add {title.replace(/s$/, "")}
      </button>
    </div>
  );
}
