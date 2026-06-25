import type { EventLog } from "../types";
import { parseFiles } from "../utils";
import type { Translation } from "../i18n";

type Props = {
  events: EventLog[];
  t: Translation;
  onOpenFile: (file: string) => void;
  onEdit: (event: EventLog) => void;
  onDelete: (id: number) => void;
};

export function EventsList({ events, t, onOpenFile, onEdit, onDelete }: Props) {
  return (
    <div className="space-y-3">
      {events.map((event) => {
        const files = parseFiles(event.files);

        return (
          <div key={event.id} className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="text-sm text-orange-300">{event.created_at}</div>
              <div className="flex gap-2">
                <button className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-sky-700" onClick={() => onEdit(event)}>
                  {t.Common.edit}
                </button>
                <button
                  className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-red-700"
                  onClick={() => {
                    if (window.confirm(t.Common.confirmDelete)) onDelete(event.id);
                  }}
                >
                  {t.Common.delete}
                </button>
              </div>
            </div>

            <p className="whitespace-pre-wrap text-slate-200">{event.text}</p>

            {files.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {files.map((file) => (
                  <button
                    key={file.path}
                    onClick={() => onOpenFile(file.path)}
                    className="rounded-lg border border-sky-500/50 bg-sky-950/50 px-3 py-2 text-sm text-sky-200 hover:bg-sky-800"
                  >
                    <span className="block">{file.displayName}</span>
                    <span className="block text-xs text-slate-400">{file.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {events.length === 0 && <p className="text-slate-400">{t.Event.noEvents}</p>}
    </div>
  );
}