import { fileUrl } from "../api";
import type { Translation } from "../i18n";
import { getFileKind } from "../utils";
import { Modal } from "./Modal";

type Props = {
  file: string | null;
  t: Translation;
  onClose: () => void;
};

export function DocumentModal({ file, t, onClose }: Props) {
  const open = Boolean(file);
  const kind = file ? getFileKind(file) : "other";
  const src = file ? fileUrl(file) : "";

  return (
    <Modal title={t.Document.title} open={open} onClose={onClose} wide>
      {kind === "image" && (
        <img src={src} alt={t.Document.imageAlt} className="mx-auto max-h-[75vh] rounded-xl object-contain" />
      )}

      {kind === "video" && (
        <video src={src} controls className="mx-auto max-h-[75vh] w-full rounded-xl">
          {t.Document.videoNotSupported}
        </video>
      )}

      {kind === "pdf" && (
        <iframe
          title={t.Document.pdfTitle}
          src={src}
          className="h-[75vh] w-full rounded-xl border border-slate-700"
        />
      )}

      {kind === "other" && (
        <div className="space-y-4">
          <p className="text-slate-300">{t.Document.unsupported}</p>
          <a className="btn-primary inline-block" href={src} target="_blank" rel="noreferrer">
            {t.Document.openInNewTab}
          </a>
        </div>
      )}
    </Modal>
  );
}
