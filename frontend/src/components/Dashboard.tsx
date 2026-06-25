import { useEffect, useState } from "react";
import { api } from "../api";
import { LANGUAGES, type Lang } from "../i18n";
import type { Account, EventLog, Patient, PatientLog } from "../types";
import { DocumentModal } from "./DocumentModal";
import { EventModal } from "./EventModal";
import { EventsList } from "./EventsList";
import { MeasurementModal } from "./MeasurementModal";
import { MeasurementsList } from "./MeasurementsList";
import { PatientFormModal } from "./PatientFormModal";
import { PatientSelectorModal } from "./PatientSelectorModal";
import type { Translation } from "../i18n";

type Props = {
  account: Account;
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translation;
  onLogout: () => void;
};

export function Dashboard({ account, lang, setLang, t, onLogout }: Props) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [tab, setTab] = useState<"measurements" | "events">("measurements");

  const [logs, setLogs] = useState<PatientLog[]>([]);
  const [events, setEvents] = useState<EventLog[]>([]);

  const [patientSelectorOpen, setPatientSelectorOpen] = useState(false);
  const [patientFormOpen, setPatientFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const [measurementOpen, setMeasurementOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<PatientLog | null>(null);

  const [eventOpen, setEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventLog | null>(null);

  const [documentFile, setDocumentFile] = useState<string | null>(null);

  async function loadPatients() {
    const data = await api<Patient[]>("patients.php");
    setPatients(data);
  }

  async function loadLogs(patientId = selectedPatient?.id) {
    if (!patientId) return;
    const data = await api<PatientLog[]>(`patient_log.php?patient_id=${patientId}`);
    setLogs(data);
  }

  async function loadEvents(patientId = selectedPatient?.id) {
    if (!patientId) return;
    const data = await api<EventLog[]>(`event_log.php?patient_id=${patientId}`);

    const normalized = data.map((event) => ({
      ...event,
      files: typeof event.files === "string" ? JSON.parse(event.files || "[]") : event.files || []
    }));

    setEvents(normalized);
  }

  async function deletePatient(id: number) {
    await api(`patients.php?id=${id}`, { method: "DELETE" });

    if (selectedPatient?.id === id) {
      setSelectedPatient(null);
      setLogs([]);
      setEvents([]);
    }

    await loadPatients();
  }

  async function deleteLog(id: number) {
    await api(`patient_log.php?id=${id}`, { method: "DELETE" });
    await loadLogs();
  }

  async function deleteEvent(id: number) {
    await api(`event_log.php?id=${id}`, { method: "DELETE" });
    await loadEvents();
  }

  function openNewPatientModal() {
    setEditingPatient(null);
    setPatientFormOpen(true);
  }

  function openEditPatientModal(patient: Patient) {
    setEditingPatient(patient);
    setPatientFormOpen(true);
  }

  function openNewMeasurementModal() {
    setEditingLog(null);
    setMeasurementOpen(true);
  }

  function openEditMeasurementModal(log: PatientLog) {
    setEditingLog(log);
    setMeasurementOpen(true);
  }

  function openNewEventModal() {
    setEditingEvent(null);
    setEventOpen(true);
  }

  function openEditEventModal(event: EventLog) {
    setEditingEvent(event);
    setEventOpen(true);
  }

  async function logout() {
    await api("logout.php", { method: "POST" });
    onLogout();
  }

  useEffect(() => {
    loadPatients().catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedPatient) return;

    loadLogs(selectedPatient.id).catch(() => {});
    loadEvents(selectedPatient.id).catch(() => {});
  }, [selectedPatient]);

  const title = tab === "measurements" ? t.Dashboard.vitalMeasurements : t.Dashboard.events;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex min-h-screen">
        <aside className="flex w-80 shrink-0 flex-col border-r border-slate-800 bg-slate-900/95 p-5 shadow-2xl shadow-black/30">
          <div className="mb-6 rounded-3xl border border-slate-700 bg-slate-950/70 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400 text-xl font-black text-slate-950">
                B
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-sky-200">{t.Common.appName}</h1>
                <p className="truncate text-xs text-slate-400">{account.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
            >
              {t.Common.logout}
            </button>
          </div>

          <div className="mb-5 space-y-3">
            <button type="button" onClick={() => setPatientSelectorOpen(true)} className="btn-primary w-full">
              {t.Patient.selectPatient}
            </button>

            <button type="button" onClick={openNewPatientModal} className="btn-secondary w-full">
              {t.Patient.addPatient}
            </button>
          </div>

          <div className="mb-5 rounded-3xl border border-slate-700 bg-slate-950 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t.Dashboard.selectedPatient}
            </p>

            {selectedPatient ? (
              <div>
                <div className="text-lg font-bold text-sky-100">
                  {selectedPatient.last_name} {selectedPatient.first_name}
                </div>
                <div className="mt-2 space-y-1 text-sm text-slate-400">
                  <p>{t.Patient.patientId}: {selectedPatient.id}</p>
                  <p>{t.Patient.birthDate}: {selectedPatient.birth_date}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm leading-6 text-slate-400">
                {t.Dashboard.selectOrAddPatientHint}
              </p>
            )}
          </div>

          <nav className="space-y-2">
            <button
              type="button"
              disabled={!selectedPatient}
              onClick={() => setTab("measurements")}
              className={`w-full rounded-2xl px-4 py-3 text-left font-semibold transition ${
                tab === "measurements"
                  ? "bg-sky-400 text-slate-950"
                  : "bg-slate-950 text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              }`}
            >
              {t.Dashboard.vitalMeasurements}
            </button>

            <button
              type="button"
              disabled={!selectedPatient}
              onClick={() => setTab("events")}
              className={`w-full rounded-2xl px-4 py-3 text-left font-semibold transition ${
                tab === "events"
                  ? "bg-orange-500 text-white"
                  : "bg-slate-950 text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              }`}
            >
              {t.Dashboard.events}
            </button>
          </nav>

          <div className="mt-auto border-t border-slate-800 pt-4">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t.Common.language}
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-sm font-semibold text-sky-100 outline-none focus:border-sky-400"
            >
              {LANGUAGES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label[lang]}
                </option>
              ))}
            </select>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-6 py-6">
          {!selectedPatient ? (
            <section className="flex min-h-[calc(100vh-3rem)] items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center">
              <div className="max-w-md">
                <h2 className="mb-3 text-2xl font-bold text-sky-200">{t.Dashboard.noSelectedPatient}</h2>
                <p className="text-slate-400">{t.Dashboard.selectOrAddPatientHint}</p>
              </div>
            </section>
          ) : (
            <section className="space-y-5">
              <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-700 bg-slate-900 p-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    {t.Dashboard.menu}
                  </p>
                  <h2 className="text-2xl font-bold text-sky-100">{title}</h2>
                </div>

                {tab === "measurements" ? (
                  <button type="button" onClick={openNewMeasurementModal} className="btn-primary">
                    {t.Measurement.add}
                  </button>
                ) : (
                  <button type="button" onClick={openNewEventModal} className="btn-primary">
                    {t.Event.add}
                  </button>
                )}
              </header>

              {tab === "measurements" ? (
                <MeasurementsList logs={logs} t={t} onEdit={openEditMeasurementModal} onDelete={deleteLog} />
              ) : (
                <EventsList events={events} t={t} onOpenFile={setDocumentFile} onEdit={openEditEventModal} onDelete={deleteEvent} />
              )}
            </section>
          )}
        </main>
      </div>

      <PatientSelectorModal
        open={patientSelectorOpen}
        patients={patients}
        selectedPatient={selectedPatient}
        t={t}
        onSelect={setSelectedPatient}
        onEdit={openEditPatientModal}
        onDelete={deletePatient}
        onClose={() => setPatientSelectorOpen(false)}
      />

      <PatientFormModal
        open={patientFormOpen}
        patient={editingPatient}
        t={t}
        onClose={() => setPatientFormOpen(false)}
        onSaved={async (updatedPatient) => {
          await loadPatients();
          if (updatedPatient && selectedPatient?.id === updatedPatient.id) {
            setSelectedPatient(updatedPatient);
          }
        }}
      />

      <MeasurementModal
        open={measurementOpen}
        patient={selectedPatient}
        log={editingLog}
        t={t}
        onClose={() => setMeasurementOpen(false)}
        onSaved={() => loadLogs()}
      />

      <EventModal
        open={eventOpen}
        patient={selectedPatient}
        event={editingEvent}
        t={t}
        onClose={() => setEventOpen(false)}
        onSaved={() => loadEvents()}
      />

      <DocumentModal file={documentFile} t={t} onClose={() => setDocumentFile(null)} />
    </div>
  );
}