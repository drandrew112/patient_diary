import type { PatientLog } from "../types";
import type { Translation } from "../i18n";

type Props = {
  logs: PatientLog[];
  t: Translation;
  onEdit: (log: PatientLog) => void;
  onDelete: (id: number) => void;
};

export function MeasurementsList({ logs, t, onEdit, onDelete }: Props) {
  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div key={log.id} className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-sm text-orange-300">{log.created_at}</div>
            <div className="flex gap-2">
              <button className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-sky-700" onClick={() => onEdit(log)}>
                {t.Common.edit}
              </button>
              <button
                className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-red-700"
                onClick={() => {
                  if (window.confirm(t.Common.confirmDelete)) onDelete(log.id);
                }}
              >
                {t.Common.delete}
              </button>
            </div>
          </div>

          <div className="grid gap-2 text-sm text-slate-200 md:grid-cols-3">
            <div>SpO₂: {log.ab_oxysat ?? "-"}</div>
            <div>{t.Measurement.pulse}: {log.c_pulse ?? "-"}</div>
            <div>{t.Measurement.bloodPressure.leftSystolic}/{t.Measurement.bloodPressure.leftDiastolic}: {log.c_bp_left_sis ?? "-"}/{log.c_bp_left_dis ?? "-"}</div>
            <div>{t.Measurement.bloodPressure.rightSystolic}/{t.Measurement.bloodPressure.rightDiastolic}: {log.c_bp_right_sis ?? "-"}/{log.c_bp_right_dis ?? "-"}</div>
          </div>

          {log.notes && <p className="mt-3 rounded-xl bg-slate-950 p-3 text-slate-300">{log.notes}</p>}
        </div>
      ))}

      {logs.length === 0 && <p className="text-slate-400">{t.Measurement.noMeasurements}</p>}
    </div>
  );
}