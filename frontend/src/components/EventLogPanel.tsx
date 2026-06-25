import { useEffect, useState } from "react";
import { api } from "../api";
import type { EventLog, Patient } from "../types";
import { parseFiles } from "../utils";
import type { Translation } from "../i18n";

const API_BASE = "http://localhost/backend/";

type Props = {
  t: Translation;
  patient: Patient;
};

export function EventLogPanel({ t, patient }: Props) {
  const [events, setEvents] = useState<EventLog[]>([]);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  async function loadEvents() {
    const data = await api<EventLog[]>(`event_log.php?patient_id=${patient.id}`);

    const normalized = data.map((event: any) => ({
      ...event,
      files:
        typeof event.files === "string"
          ? JSON.parse(event.files || "[]")
          : event.files || []
    }));

    setEvents(normalized);
  }

  async function saveEvent() {
    const formData = new FormData();
    formData.append("patient_id", String(patient.id));
    formData.append("text", text);

    if (files) {
      Array.from(files).forEach((file) => {
        formData.append("files[]", file);
      });
    }

    await api<{ success: boolean }>("event_log.php", {
      method: "POST",
      body: formData
    });

    setText("");
    setFiles(null);
    await loadEvents();
  }

  async function deleteEvent(id: number) {
    await api<{ success: boolean }>(`event_log.php?id=${id}`, { method: "DELETE" });
    await loadEvents();
  }

  useEffect(() => {
    loadEvents().catch(() => {});
  }, [patient.id]);

  return (
    <section className="card">
      <h3 className="mb-4 text-xl font-bold text-skysoft">{t.Dashboard.events}</h3>

      <textarea className="input min-h-28" placeholder={t.Event.text} value={text} onChange={(e) => setText(e.target.value)} />

      <label className="label mt-3">{t.Event.files}</label>
      <input
        className="input file:mr-4 file:rounded-lg file:border-0 file:bg-orangehot file:px-3 file:py-1 file:font-semibold file:text-slate-950"
        type="file"
        multiple
        onChange={(e) => setFiles(e.target.files)}
      />

      <button className="btn-orange mt-3" onClick={saveEvent}>{t.Event.save}</button>

      <div className="mt-6 space-y-3">
        {events.length === 0 && <p className="text-slate-400">{t.Common.noData}</p>}

        {events.map((event) => (
          <div key={event.id} className="rounded-xl border border-slate-700 bg-panel2 p-4">
            <div className="mb-2 flex items-center justify-between">
              <strong className="text-orangehot">{event.created_at}</strong>
              <button className="text-sm text-slate-400 hover:text-orangehot" onClick={() => deleteEvent(event.id)}>{t.Common.delete}</button>
            </div>

            <p className="whitespace-pre-wrap text-slate-100">{event.text}</p>

            {parseFiles(event.files).length > 0 && (
              <div className="mt-3 space-y-1">
                {parseFiles(event.files).map((file) => (
                  <a
                    key={file.path}
                    className="block text-sm text-skysoft hover:underline"
                    href={`${API_BASE}${file}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t.Document.open}: {file.displayName || file.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}