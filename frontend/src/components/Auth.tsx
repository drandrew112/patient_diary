import { useState } from "react";
import { api } from "../api";
import type { Account } from "../types";

import { LANGUAGES, type Lang } from "../i18n";
import type { Translation } from "../i18n";

type Props = {
  t: Translation;
  lang: Lang;
  setLang: (lang: Lang) => void;
  onLogin: (account: Account) => void;
};

export function Auth({ t, lang, setLang, onLogin }: Props) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit() {
    setError("");

    try {
      if (tab === "register") {
        await api("register.php", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });
      }

      const data = await api<{ success: boolean; account: Account }>("login.php", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      onLogin(data.account);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.Common.error);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.16),_transparent_35%)] px-4 py-8">
      <section className="w-full max-w-md rounded-3xl border border-slate-700/80 bg-slate-900/95 p-6 shadow-2xl shadow-black/40">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-400 text-2xl font-black text-slate-950">
            B
          </div>
          <h1 className="text-3xl font-bold text-sky-200">{t.Common.appName}</h1>
          <p className="mt-1 text-sm text-slate-400">{t.Auth.tagline}</p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-2xl border border-slate-700 bg-slate-950 p-1">
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`rounded-xl py-2.5 text-sm font-semibold transition ${
              tab === "login" ? "bg-sky-400 text-slate-950" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            {t.Auth.login}
          </button>
          <button
            type="button"
            onClick={() => setTab("register")}
            className={`rounded-xl py-2.5 text-sm font-semibold transition ${
              tab === "register" ? "bg-orange-500 text-white" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            {t.Auth.register}
          </button>
        </div>

        <div className="space-y-4">
          <input
            className="field"
            placeholder={t.Auth.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="field"
            placeholder={t.Auth.password}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
          />

          {error && <div className="rounded-xl border border-red-800 bg-red-950/60 p-3 text-sm text-red-200">{error}</div>}

          <button
            type="button"
            onClick={submit}
            className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-400"
          >
            {tab === "login" ? t.Auth.login : t.Auth.register}
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4 text-sm text-slate-400">
          <span>{t.Common.language}</span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            className="rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-sm font-semibold text-sky-100 outline-none focus:border-sky-400"
          >
            {LANGUAGES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label[lang]}
              </option>
            ))}
          </select>
        </div>
      </section>
    </main>
  );
}