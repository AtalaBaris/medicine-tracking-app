import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { medications } from "../../services/api";
import { getStoredUser } from "../../utils/auth";
import {
  FORM_TO_DB,
  FREQUENCY_TO_DB,
  DB_TO_FORM,
  parseDosage,
  daysStringToMode,
  frequencyFromDb,
} from "../../utils/medications";
import {
  WEEK_DAYS_TR,
  TIME_PRESETS,
  FREQUENCY_OPTIONS,
  defaultTimesForFrequency,
  ensureSlotsForFrequency,
  slotsRequiredForFrequency,
  daysFromMode,
  todayIso,
} from "../../utils/scheduleForm";

function newSlot(time = "08:00") {
  return { id: crypto.randomUUID(), time, label: "" };
}

export default function AddMedication() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const user = getStoredUser();
  const [meal, setMeal] = useState("with");
  const [slots, setSlots] = useState([newSlot("08:00")]);
  const [dayMode, setDayMode] = useState("everyday");
  const [customDays, setCustomDays] = useState(() =>
    Object.fromEntries(WEEK_DAYS_TR.map((d) => [d.id, true]))
  );
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [unit, setUnit] = useState("mg");
  const [form, setForm] = useState("Tablet");
  const [frequency, setFrequency] = useState("Once a day");
  const [stock, setStock] = useState(30);
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState(todayIso());
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) return;
    const times = defaultTimesForFrequency(frequency);
    setSlots(times.map((t) => newSlot(t)));
  }, [frequency, isEdit]);

  useEffect(() => {
    if (!isEdit || !id) return;

    async function loadMedication() {
      setPageLoading(true);
      setError("");
      try {
        const data = await medications.get(id);
        const { value, unit } = parseDosage(data.dosage);
        setName(data.name);
        setDosage(value);
        setUnit(unit === "adet" ? " adet" : unit);
        setForm(DB_TO_FORM[data.form] || "Tablet");
        setStock(data.stockQuantity ?? 30);
        setStartDate(data.startDate || todayIso());
        setEndDate(data.endDate || "");
        const freqKey = frequencyFromDb(data.frequency);
        setFrequency(freqKey);
        const { mode, custom } = daysStringToMode(data.days);
        setDayMode(mode);
        setCustomDays(custom);
        const loadedSlots = (data.schedules?.length ? data.schedules : [{ time: "08:00", label: "" }]).map(
          (s) => ({
            id: crypto.randomUUID(),
            time: String(s.time).slice(0, 5),
            label: s.label || "",
          })
        );
        setSlots(ensureSlotsForFrequency(freqKey, loadedSlots, newSlot));
      } catch (err) {
        setError(err.message);
      } finally {
        setPageLoading(false);
      }
    }

    loadMedication();
  }, [id, isEdit]);

  function addSlot(presetTime) {
    setSlots((s) => [...s, newSlot(presetTime || "12:00")]);
  }

  function updateSlot(id, field, value) {
    setSlots((s) => s.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  }

  function removeSlot(id) {
    setSlots((s) => (s.length > 1 ? s.filter((x) => x.id !== id) : s));
  }

  function toggleCustomDay(dayId) {
    setCustomDays((prev) => ({ ...prev, [dayId]: !prev[dayId] }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user?.id) return;
    setError("");
    setLoading(true);

    const mealNote =
      meal === "with"
        ? "Yemekle birlikte"
        : meal === "before"
        ? "Yemekten önce"
        : "Yemekten sonra";

    const daysLabel = daysFromMode(dayMode, customDays);
    const preparedSlots = ensureSlotsForFrequency(frequency, slots, newSlot);
    const validSlots = preparedSlots.filter((s) => s.time);
    const required = slotsRequiredForFrequency(frequency);

    if (validSlots.length === 0) {
      setError("En az bir içme saati seçmelisiniz.");
      setLoading(false);
      return;
    }

    if (frequency !== "As needed" && validSlots.length < required) {
      setError(`"${FREQUENCY_TO_DB[frequency] || frequency}" için ${required} saat gerekir.`);
      setLoading(false);
      return;
    }

    const payload = {
      name,
      dosage: dosage ? `${dosage}${unit}` : null,
      form: FORM_TO_DB[form] || form,
      stockQuantity: Number(stock) || 30,
      startDate: startDate || null,
      endDate: endDate || null,
      frequency: FREQUENCY_TO_DB[frequency] || frequency,
      days: daysLabel,
      schedules: validSlots.map((s) => ({
        time: s.time,
        days: daysLabel,
        label: s.label || undefined,
      })),
      note: notes ? `${mealNote}. ${notes}` : mealNote,
    };

    try {
      if (isEdit) {
        await medications.update(id, payload);
      } else {
        await medications.create({ userId: user.id, ...payload });
      }
      navigate("/medications");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full bg-surface-container-low border border-transparent focus:border-primary focus:bg-surface-container-lowest rounded-2xl px-md py-sm font-body-lg text-on-surface transition-colors duration-200 focus:ring-0 placeholder:text-outline/50";

  const cardCls =
    "bg-surface-container-lowest rounded-2xl p-lg shadow-premium border border-outline-variant/30";

  return (
    <div className="min-h-screen bg-background font-body-lg">
      <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-outline-variant/20">
        <div className="flex justify-between items-center w-full px-lg py-sm max-w-container-max mx-auto">
          <button
            onClick={() => navigate("/medications")}
            className="flex items-center gap-sm text-primary font-display-lg text-headline-md tracking-tight"
          >
            <span className="material-symbols-outlined filled">medical_services</span>
            MedTrack Pro
          </button>
          <button
            onClick={() => navigate(-1)}
            className="text-on-surface-variant hover:bg-surface-container p-sm rounded-full transition-all duration-300"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-gutter py-xl">
        <div className="mb-lg">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">
            {isEdit ? "İlaç Düzenle" : "Yeni İlaç Ekle"}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            {isEdit
              ? "İlaç bilgilerini ve içme planını güncelleyin."
              : "İçme saatlerini ve hangi günlerde alacağınızı detaylı belirleyin."}
          </p>
        </div>

        {pageLoading ? (
          <p className="text-on-surface-variant font-body-sm">Yükleniyor...</p>
        ) : (
        <form className="space-y-lg" onSubmit={handleSubmit}>
          <div className={cardCls}>
            <div className="space-y-md">
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit" htmlFor="med_name">
                  İlaç Adı
                </label>
                <input
                  className={inputCls}
                  id="med_name"
                  placeholder="örn. Parol"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit" htmlFor="dosage">
                    Dozaj
                  </label>
                  <input
                    className={inputCls}
                    id="dosage"
                    placeholder="örn. 500"
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit" htmlFor="unit">
                    Birim
                  </label>
                  <select className={inputCls} id="unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
                    <option value="mg">mg</option>
                    <option value="ml">ml</option>
                    <option value="mcg">mcg</option>
                    <option value=" adet">adet</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit" htmlFor="form">
                  Form
                </label>
                <select className={inputCls} id="form" value={form} onChange={(e) => setForm(e.target.value)}>
                  <option>Tablet</option>
                  <option>Capsule</option>
                  <option>Liquid</option>
                  <option>Injection</option>
                </select>
              </div>
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit" htmlFor="stock">
                  Stok Adedi
                </label>
                <input
                  className={inputCls}
                  id="stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={cardCls}>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">notifications_active</span>
              İçme Planı
            </h3>
            <div className="space-y-lg">
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit" htmlFor="frequency">
                  Sıklık
                </label>
                <select
                  className={inputCls}
                  id="frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  {FREQUENCY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {frequency !== "As needed" && (
                  <p className="font-body-sm text-on-surface-variant mt-xs">
                    {slotsRequiredForFrequency(frequency)} hatırlatıcı:{" "}
                    {defaultTimesForFrequency(frequency).join(", ")}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit">Hangi günler?</label>
                <div className="flex flex-wrap gap-sm mb-md">
                  {[
                    { id: "everyday", label: "Her gün" },
                    { id: "weekdays", label: "Hafta içi" },
                    { id: "weekends", label: "Hafta sonu" },
                    { id: "custom", label: "Özel" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDayMode(opt.id)}
                      className={`px-md py-sm rounded-xl font-body-sm transition-colors ${
                        dayMode === opt.id
                          ? "bg-primary-container text-on-primary"
                          : "bg-surface-container text-on-surface-variant hover:bg-surface-variant"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {dayMode === "custom" && (
                  <div className="flex flex-wrap gap-xs">
                    {WEEK_DAYS_TR.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => toggleCustomDay(d.id)}
                        className={`w-10 h-10 rounded-full font-label-caps text-label-caps transition-colors ${
                          customDays[d.id]
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        {d.short}
                      </button>
                    ))}
                  </div>
                )}
                <p className="font-body-sm text-on-surface-variant mt-sm">
                  Plan: <strong>{daysFromMode(dayMode, customDays)}</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit" htmlFor="startDate">
                    Başlangıç
                  </label>
                  <input
                    className={inputCls}
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit" htmlFor="endDate">
                    Bitiş (isteğe bağlı)
                  </label>
                  <input
                    className={inputCls}
                    id="endDate"
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit">
                  İçme saatleri
                </label>
                <div className="flex flex-wrap gap-xs mb-md">
                  {TIME_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => addSlot(p.time)}
                      className="px-sm py-xs rounded-lg bg-surface-container text-on-surface-variant font-body-sm hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      + {p.label} ({p.time})
                    </button>
                  ))}
                </div>
                <div className="space-y-sm">
                  {slots.map((slot, i) => (
                    <div key={slot.id} className="flex flex-col sm:flex-row gap-sm p-sm rounded-xl bg-surface-container/50">
                      <input
                        className={`${inputCls} sm:w-36`}
                        type="time"
                        value={slot.time}
                        onChange={(e) => updateSlot(slot.id, "time", e.target.value)}
                        required
                      />
                      <input
                        className={`${inputCls} flex-1`}
                        type="text"
                        placeholder="Not (örn. kahvaltıdan sonra)"
                        value={slot.label}
                        onChange={(e) => updateSlot(slot.id, "label", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeSlot(slot.id)}
                        disabled={slots.length <= 1}
                        className="p-sm text-outline hover:text-error disabled:opacity-30 self-center"
                        title="Saati kaldır"
                      >
                        <span className="material-symbols-outlined">remove_circle</span>
                      </button>
                      {i === slots.length - 1 && (
                        <button
                          type="button"
                          onClick={() => addSlot()}
                          className="p-sm text-outline hover:text-primary self-center"
                          title="Saat ekle"
                        >
                          <span className="material-symbols-outlined">add_circle</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-sm border-t border-outline-variant/30">
                <div>
                  <p className="font-body-lg text-on-surface">Yemek ile</p>
                  <p className="font-body-sm text-on-surface-variant">İlaç yemekle mi alınacak?</p>
                </div>
                <div className="flex gap-sm">
                  {["before", "with", "after"].map((opt) => (
                    <label key={opt} className="flex items-center gap-unit cursor-pointer">
                      <input
                        className="text-primary focus:ring-primary h-4 w-4"
                        name="meal"
                        type="radio"
                        checked={meal === opt}
                        onChange={() => setMeal(opt)}
                      />
                      <span className="font-body-sm">
                        {opt === "before" ? "Önce" : opt === "with" ? "İle" : "Sonra"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={cardCls}>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit" htmlFor="notes">
              Notlar
            </label>
            <textarea
              className={`${inputCls} resize-none`}
              id="notes"
              placeholder="Özel talimatlar..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-error font-body-sm" role="alert">
              {error}
            </p>
          )}

          <div className="flex gap-md pt-md">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-surface-container border border-outline-variant rounded-2xl px-lg py-md font-headline-md text-headline-md text-on-surface hover:bg-surface-variant transition-colors duration-300"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-container text-on-primary rounded-2xl px-lg py-md font-headline-md text-headline-md hover:scale-[1.02] hover:shadow-premium-hover transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Kaydediliyor..." : isEdit ? "Güncelle" : "Kaydet"}
            </button>
          </div>
        </form>
        )}
      </main>
    </div>
  );
}
