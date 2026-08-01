"use client";

export default function Toast({ toasts }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-xs w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-lg px-4 py-3 text-sm text-white shadow-lg animate-[slideIn_0.25s_ease] ${
            t.type === "success" ? "bg-accent" : "bg-warn"
          }`}
        >
          {t.message}
        </div>
      ))}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateY(-8px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
