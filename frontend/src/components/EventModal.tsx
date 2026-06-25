import { useEffect, useState } from "react";
import { api } from "../api";
import type { EventLog, Patient } from "../types";
import { normalizeDateTimeForMysql, nowForDatetimeLocal, parseFiles, toDatetimeLocal } from "../utils";
import { Modal } from "./Modal";
import type { Translation } from "../i18n";

type Props = {
  open: boolean;
  patient: Patient | null;
  event?: EventLog | null;
  t: Translation;
  onClose: () => void;
  onSaved: () => void;
};

export function EventModal({ open, patient, event, t, onClose, onSaved }: Props) {
  const [createdAt, setCreatedAt] = useState(nowForDatetimeLocal());
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [newFileDisplayNames, setNewFileDisplayNames] = useState<Record<number, string>>({});
  const [existingFileDisplayNames, setExistingFileDisplayNames] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;

    setCreatedAt(event ? toDatetimeLocal(event.created_at) : nowForDatetimeLocal());
    setText(event?.text ?? "");
    setFiles([]);
    setNewFileDisplayNames({});

    const currentFiles = parseFiles(event?.files ?? null);
    setExistingFileDisplayNames(
      Object.fromEntries(currentFiles.map((file) => [file.path, file.displayName]))
    );
  }, [open, event]);

  async function save() {
    if (!patient) return;

    const formData = new FormData();
    if (event) formData.append("id", String(event.id));
    formData.append("patient_id", String(patient.id));
    formData.append("created_at", normalizeDateTimeForMysql(createdAt));
    formData.append("text", text);

    files.forEach((file) => {
      formData.append("files[]", file);
    });

    formData.append(
      "displayNames",
      JSON.stringify(
        files.map((file, index) => ({
          name: file.name,
          displayName:
            newFileDisplayNames[index] ||
            file.name.replace(/\.[^/.]+$/, "")
        }))
      )
    );

    formData.append(
      "existingFiles",
      JSON.stringify(
        currentFiles.map((file) => ({
          ...file,
          displayName: existingFileDisplayNames[file.path] || file.displayName
        }))
      )
    );

    await api("event_log.php", {
      method: event ? "POST" : "POST",
      body: formData,
      rawBody: true
    });

    onSaved();
    onClose();
  }

  const currentFiles = parseFiles(event?.files ?? null);

  return (
    <Modal title={event ? t.Event.edit : t.Event.add} open={open} onClose={onClose}>
      <div className="space-y-4">
        <label className="text-sm font-semibold text-slate-300">
          {t.Event.date}
          <input className="field mt-2" type="datetime-local" value={createdAt} onChange={(e) => setCreatedAt(e.target.value)} />
        </label>

        <textarea
          className="field min-h-32"
          placeholder={t.Event.text}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {event && currentFiles.length > 0 && (
          <div className="rounded-xl border border-slate-700 bg-slate-950 p-3">
            <p className="mb-2 text-sm font-semibold text-slate-300">
              {t.Event.currentFiles}
            </p>

            <div className="space-y-3">
              {currentFiles.map((file) => (
                <div key={file.path}>
                  <div className="mb-1 text-xs text-slate-500">{file.name}</div>

                  <input
                    className="field"
                    value={existingFileDisplayNames[file.path] ?? file.displayName}
                    onChange={(e) =>
                      setExistingFileDisplayNames((prev) => ({
                        ...prev,
                        [file.path]: e.target.value
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <label className="block text-sm font-semibold text-slate-300">
          {event ? t.Event.newFiles : t.Event.files}
          <input
            className="mt-2 block w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-950 text-sm text-slate-300 file:mr-4 file:border-0 file:bg-orange-500 file:px-4 file:py-3 file:text-white hover:file:bg-orange-400"
            type="file"
            multiple
            accept="image/*,video/*,application/pdf"
            onChange={(e) => {
              const selected = Array.from(e.target.files || []);
              setFiles(selected);
              setNewFileDisplayNames(
                Object.fromEntries(
                  selected.map((file, index) => [
                    index,
                    file.name.replace(/\.[^/.]+$/, "")
                  ])
                )
              );
            }}
          />
        </label>

        {files.length > 0 && (
          <div className="space-y-3">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`}>
                <div className="mb-1 text-xs text-slate-500">{file.name}</div>

                <input
                  className="field"
                  value={newFileDisplayNames[index] ?? ""}
                  onChange={(e) =>
                    setNewFileDisplayNames((prev) => ({
                      ...prev,
                      [index]: e.target.value
                    }))
                  }
                />
              </div>
            ))}
          </div>
        )}

        <button onClick={save} className="btn-primary w-full">{t.Common.save}</button>
      </div>
    </Modal>
  );
}