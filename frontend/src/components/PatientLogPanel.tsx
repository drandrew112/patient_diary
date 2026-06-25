import { useEffect, useState } from "react";
import { api } from "../api";
import type { Patient, PatientLog } from "../types";
import type { Translation } from "../i18n";

type Props = {
  t: Translation;
  patient: Patient;
};

export function PatientLogPanel({ t, patient }: Props) {
  const [logs, setLogs] = useState<PatientLog[]>([]);
  const [form, setForm] = useState({
    ab_oxysat: "",
    c_pulse: "",
    c_bp_left_sis: "",
    c_bp_left_dis: "",
    c_bp_right_sis: "",
    c_bp_right_dis: "",
    notes: ""
  });

  async function loadLogs() {
    const data = await api<PatientLog[]>(`patient_log.php?patient_id=${patient.id}`);
    setLogs(data);
  }

  function nullableNumber(value: string) {
    return value === "" ? null : Number(value);
  }

  async function saveLog() {
    await api<{ success: boolean }>("patient_log.php", {
      method: "POST",
      body: JSON.stringify({
        patient_id: patient.id,
        ab_oxysat: nullableNumber(form.ab_oxysat),
        c_pulse: nullableNumber(form.c_pulse),
        c_bp_left_sis: nullableNumber(form.c_bp_left_sis),
        c_bp_left_dis: nullableNumber(form.c_bp_left_dis),
        c_bp_right_sis: nullableNumber(form.c_bp_right_sis),
        c_bp_right_dis: nullableNumber(form.c_bp_right_dis),
        notes: form.notes
      })
    });

    setForm({
      ab_oxysat: "",
      c_pulse: "",
      c_bp_left_sis: "",
      c_bp_left_dis: "",
      c_bp_right_sis: "",
      c_bp_right_dis: "",
      notes: ""
    });

    await loadLogs();
  }

  async function deleteLog(id: number) {
    await api<{ success: boolean }>(`patient_log.php?id=${id}`, { method: "DELETE" });
    await loadLogs();
  }

  useEffect(() => {
    loadLogs().catch(() => {});
  }, [patient.id]);

  return (
    <section className="card">
      <h3 className="mb-4 text-xl font-bold text-skysoft">{t.Measurement.title}</h3>

      <div className="grid gap-3 md:grid-cols-2">
        <input className="input" placeholder={t.Measurement.oxygenSaturation} value={form.ab_oxysat} onChange={(e) => setForm({ ...form, ab_oxysat: e.target.value })} />
        <input className="input" placeholder={t.Measurement.pulse} value={form.c_pulse} onChange={(e) => setForm({ ...form, c_pulse: e.target.value })} />

        <input className="input" placeholder={`${t.Measurement.bloodPressure.leftArm} - ${t.Measurement.bloodPressure.systolic}`} value={form.c_bp_left_sis} onChange={(e) => setForm({ ...form, c_bp_left_sis: e.target.value })} />
        <input className="input" placeholder={`${t.Measurement.bloodPressure.leftArm} - ${t.Measurement.bloodPressure.diastolic}`} value={form.c_bp_left_dis} onChange={(e) => setForm({ ...form, c_bp_left_dis: e.target.value })} />

        <input className="input" placeholder={`${t.Measurement.bloodPressure.rightArm} - ${t.Measurement.bloodPressure.systolic}`} value={form.c_bp_right_sis} onChange={(e) => setForm({ ...form, c_bp_right_sis: e.target.value })} />
        <input className="input" placeholder={`${t.Measurement.bloodPressure.rightArm} - ${t.Measurement.bloodPressure.diastolic}`} value={form.c_bp_right_dis} onChange={(e) => setForm({ ...form, c_bp_right_dis: e.target.value })} />
      </div>

      <textarea className="input mt-3 min-h-24" placeholder={t.Measurement.notes} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      <button className="btn-primary mt-3" onClick={saveLog}>{t.Measurement.save}</button>

      <div className="mt-6 space-y-3">
        {logs.length === 0 && <p className="text-slate-400">{t.Common.noData}</p>}

        {logs.map((log) => (
          <div key={log.id} className="rounded-xl border border-slate-700 bg-panel2 p-4">
            <div className="mb-2 flex items-center justify-between">
              <strong className="text-orangehot">{log.created_at}</strong>
              <button className="text-sm text-slate-400 hover:text-orangehot" onClick={() => deleteLog(log.id)}>{t.Common.delete}</button>
            </div>

            <div className="grid gap-2 text-sm text-slate-300 md:grid-cols-2">
              <span>{t.Measurement.oxygenSaturation}: {log.ab_oxysat ?? "-"}</span>
              <span>{t.Measurement.pulse}: {log.c_pulse ?? "-"}</span>
              <span>{t.Measurement.bloodPressure.leftArm}: {log.c_bp_left_sis ?? "-"}/{log.c_bp_left_dis ?? "-"}</span>
              <span>{t.Measurement.bloodPressure.rightArm}: {log.c_bp_right_sis ?? "-"}/{log.c_bp_right_dis ?? "-"}</span>
            </div>

            {log.notes && <p className="mt-3 text-slate-200">{log.notes}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}