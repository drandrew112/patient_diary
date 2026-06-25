import { useEffect, useState } from "react";
import { api } from "./api";
import { Auth } from "./components/Auth";
import { Dashboard } from "./components/Dashboard";
import { getDictionary, LANGUAGES, type Lang } from "./i18n";
import type { Account } from "./types";

const DEFAULT_LANG: Lang = "en";

function isLang(value: string | null): value is Lang {
  return LANGUAGES.some((language) => language.code === value);
}

function getInitialLang(): Lang {
  const saved = localStorage.getItem("lang");
  return isLang(saved) ? saved : DEFAULT_LANG;
}

export default function App() {
  const [lang, setLangState] = useState<Lang>(getInitialLang);
  const [account, setAccount] = useState<Account | null>(null);
  const t = getDictionary(lang);

  function setLang(nextLang: Lang) {
    setLangState(nextLang);
    localStorage.setItem("lang", nextLang);
  }

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    api<{ account: Account | null }>("me.php")
      .then((data) => setAccount(data.account))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {account ? (
        <Dashboard
          account={account}
          lang={lang}
          setLang={setLang}
          t={t}
          onLogout={() => setAccount(null)}
        />
      ) : (
        <Auth
          t={t}
          lang={lang}
          setLang={setLang}
          onLogin={setAccount}
        />
      )}
    </div>
  );
}
