import { ReactNode } from "react";

type Props = {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
};

export function Modal({ title, open, onClose, children, wide = false }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className={`max-h-[90vh] overflow-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl ${wide ? "w-full max-w-5xl" : "w-full max-w-xl"}`}>
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-700 bg-slate-900 px-5 py-4">
          <h2 className="text-lg font-semibold text-sky-200">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-3 py-1 text-slate-200 hover:bg-orange-500 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
