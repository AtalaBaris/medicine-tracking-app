import { useEffect, useMemo, useState } from "react";
import { logs } from "../services/api";
import { formatTime24 } from "../utils/scheduleForm";
import ConfirmModal from "./ui/ConfirmModal";

function resolveReminderId(entry) {
  const id = entry.reminderId ?? entry.id;
  return Number(id);
}

export default function IntakeChecklist({
  entries = [],
  onRefresh,
  allowToggle = true,
  showBulkButton = true,
  logDate,
  emptyMessage = "Bu gün için planlanmış ilaç yok.",
}) {
  const [busyId, setBusyId] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const [statusOverrides, setStatusOverrides] = useState({});

  const entryKey = useMemo(
    () => entries.map((e) => `${resolveReminderId(e)}-${e.time}`).join("|"),
    [entries]
  );

  useEffect(() => {
    setStatusOverrides({});
  }, [entryKey]);

  const sorted = useMemo(
    () => [...entries].sort((a, b) => String(a.time).localeCompare(String(b.time))),
    [entries]
  );

  function getStatus(entry) {
    const rid = resolveReminderId(entry);
    if (statusOverrides[rid] !== undefined) {
      return statusOverrides[rid];
    }
    return entry.status;
  }

  const takenCount = sorted.filter((e) => getStatus(e) === "taken").length;
  const pending = sorted.filter((e) => getStatus(e) !== "taken" && getStatus(e) !== "skipped");

  async function toggleEntry(entry, checked) {
    if (!allowToggle) return;

    const reminderId = resolveReminderId(entry);
    if (!reminderId || Number.isNaN(reminderId)) {
      alert("Bu kayıt için hatırlatıcı bulunamadı.");
      return;
    }

    setBusyId(reminderId);
    setStatusOverrides((prev) => ({
      ...prev,
      [reminderId]: checked ? "taken" : "later",
    }));

    try {
      if (checked) {
        await logs.mark(reminderId, "Alındı", logDate);
      } else {
        await logs.unmark(reminderId, logDate);
      }
      await onRefresh?.();
    } catch (err) {
      setStatusOverrides((prev) => {
        const next = { ...prev };
        delete next[reminderId];
        return next;
      });
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function markAllTaken() {
    if (!pending.length) return;
    setBulkLoading(true);
    try {
      for (const entry of pending) {
        const reminderId = resolveReminderId(entry);
        if (!reminderId || Number.isNaN(reminderId)) continue;
        await logs.mark(reminderId, "Alındı", logDate);
      }
      setBulkConfirm(false);
      await onRefresh?.();
    } catch (err) {
      alert(err.message);
    } finally {
      setBulkLoading(false);
    }
  }

  if (sorted.length === 0) {
    return <p className="text-on-surface-variant font-body-sm py-md text-center">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-md">
      <div className="flex flex-wrap items-center justify-between gap-sm">
        <p className="font-body-sm text-on-surface-variant">
          <span className="font-semibold text-on-surface">{takenCount}</span> / {sorted.length} alındı
        </p>
        {showBulkButton && pending.length > 0 && allowToggle && (
          <button
            type="button"
            onClick={() => setBulkConfirm(true)}
            disabled={bulkLoading}
            className="inline-flex items-center gap-xs bg-surface-container text-on-surface border border-outline-variant/40 px-md py-sm rounded-xl font-label-caps text-label-caps hover:bg-surface-variant transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">done_all</span>
            Tümünü aldım
          </button>
        )}
      </div>

      <div className="space-y-sm">
        {sorted.map((entry) => {
          const reminderId = resolveReminderId(entry);
          const status = getStatus(entry);
          const isTaken = status === "taken";
          const isSkipped = status === "skipped";
          const loading = busyId === reminderId;

          return (
            <div
              key={`reminder-${reminderId}-${entry.time}-${entry.medicationId ?? entry.med}`}
              className={`flex items-center gap-md p-md rounded-xl border transition-all
                ${isTaken ? "bg-green-50/80 border-green-200" : "bg-surface-container-lowest border-outline-variant/20 hover:border-primary/30"}
                ${!allowToggle ? "opacity-80" : ""}`}
            >
              <input
                type="checkbox"
                id={`intake-check-${reminderId}`}
                className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary shrink-0 cursor-pointer"
                checked={isTaken}
                disabled={!allowToggle || loading || isSkipped}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleEntry(entry, e.target.checked);
                }}
              />
              <label
                htmlFor={`intake-check-${reminderId}`}
                className={`flex-1 min-w-0 ${allowToggle && !isSkipped ? "cursor-pointer" : "cursor-default"}`}
              >
                <div className="flex items-center gap-sm flex-wrap">
                  <span
                    className={`font-body-lg font-semibold text-on-surface ${isTaken ? "line-through opacity-70" : ""}`}
                  >
                    {entry.med || entry.name}
                  </span>
                  {(entry.dose || entry.dosage) && (
                    <span className="font-body-sm text-on-surface-variant">
                      {entry.dose || entry.dosage}
                    </span>
                  )}
                </div>
                <p className="font-body-sm text-on-surface-variant mt-xs">
                  <span className="material-symbols-outlined text-[14px] align-middle mr-xs">schedule</span>
                  {formatTime24(entry.time)}
                  {entry.note ? ` · ${entry.note}` : ""}
                </p>
              </label>
              {loading && (
                <span className="text-on-surface-variant font-label-caps text-label-caps shrink-0">
                  ...
                </span>
              )}
              {isSkipped && (
                <span className="text-error font-label-caps text-label-caps shrink-0">Atlandı</span>
              )}
              {status === "upcoming" && !isTaken && (
                <span className="text-primary font-label-caps text-label-caps shrink-0">Şimdi</span>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmModal
        open={bulkConfirm}
        title="Tümünü alındı işaretle"
        message={`Bugün için bekleyen ${pending.length} ilacın tamamını alındı olarak işaretlemek istiyor musunuz?`}
        confirmLabel="Evet, hepsini işaretle"
        cancelLabel="Vazgeç"
        variant="primary"
        loading={bulkLoading}
        onConfirm={markAllTaken}
        onCancel={() => !bulkLoading && setBulkConfirm(false)}
      />
    </div>
  );
}
