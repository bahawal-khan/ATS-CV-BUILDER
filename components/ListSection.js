"use client";

import { accentClasses } from "./ResumeBuilder";

export default function ListSection({ title, accent = "indigo", icon = "📄", items, fields, onAdd, onUpdate, onRemove, emptyText }) {
  const c = accentClasses(accent);

  return (
    <div
      className={`bg-paper border border-line ${c.border} border-l-4 rounded-2xl p-5 shadow-card hover:shadow-cardHover transition-shadow duration-300 animate-fadeInUp`}
    >
      <div className="flex items-center gap-2 mb-3.5">
        <span className={`w-7 h-7 rounded-lg ${c.bg} flex items-center justify-center text-[14px]`}>{icon}</span>
        <h2 className={`font-display text-[13.5px] uppercase tracking-wider ${c.text}`}>{title}</h2>
      </div>

      {items.length === 0 && (
        <p className="text-[12px] text-muted mb-3 bg-bg/60 border border-dashed border-line rounded-xl px-3.5 py-4 text-center">
          {emptyText}
        </p>
      )}

      <div className="space-y-3.5">
        {items.map((item) => (
          <div
            key={item.id}
            className={`border border-line ${c.bg} rounded-xl p-4 sm:p-5 relative animate-popIn transition-transform duration-200 hover:-translate-y-0.5`}
          >
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="absolute top-3 right-3 bg-white text-warn text-[11px] font-semibold rounded-lg px-2.5 py-1.5 shadow-sm border border-warn/20 hover:bg-warnsoft hover:shadow transition-all"
            >
              ✕ Remove
            </button>

            <div className="flex flex-wrap gap-3 pr-16 sm:pr-20">
              {fields.map((f) =>
                f.type === "textarea" ? (
                  <div key={f.key} className="flex-1 min-w-[180px] w-full mb-1">
                    <label className="block text-[12px] font-semibold text-inksoft mb-1.5">{f.label}</label>
                    <textarea
                      className="w-full border border-line rounded-lg px-3 py-2.5 text-[13.5px] bg-white focus:outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/15 min-h-[76px] resize-y"
                      placeholder={f.placeholder}
                      value={item[f.key] || ""}
                      onChange={(e) => onUpdate(item.id, f.key, e.target.value)}
                    />
                  </div>
                ) : (
                  <div key={f.key} className="flex-1 min-w-[160px] mb-1">
                    <label className="block text-[12px] font-semibold text-inksoft mb-1.5">{f.label}</label>
                    <input
                      className="w-full border border-line rounded-lg px-3 py-2.5 text-[13.5px] bg-white focus:outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/15"
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
      </div>

      <button
        type="button"
        onClick={onAdd}
        className={`w-full mt-3.5 ${c.bg} ${c.text} font-semibold text-[13px] rounded-xl py-3 hover:brightness-95 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 shadow-sm`}
      >
        + Add {title.replace(/s$/, "")}
      </button>
    </div>
  );
}
