import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddMedication() {
  const navigate = useNavigate();
  const [meal, setMeal] = useState("with");
  const [times, setTimes] = useState(["08:00"]);

  function addTime() {
    setTimes((t) => [...t, "12:00"]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    navigate("/medications");
  }

  const inputCls =
    "w-full bg-surface-container-low border border-transparent focus:border-primary focus:bg-surface-container-lowest rounded-2xl px-md py-sm font-body-lg text-on-surface transition-colors duration-200 focus:ring-0 placeholder:text-outline/50";

  const cardCls =
    "bg-surface-container-lowest rounded-2xl p-lg shadow-premium border border-outline-variant/30";

  return (
    <div className="min-h-screen bg-background font-body-lg">

      {/* Focused header (replaces shared nav on this task screen) */}
      <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-outline-variant/20">
        <div className="flex justify-between items-center w-full px-lg py-sm max-w-container-max mx-auto">
          <button onClick={() => navigate("/medications")} className="flex items-center gap-sm text-primary font-display-lg text-headline-md tracking-tight">
            <span className="material-symbols-outlined filled">medical_services</span>
            MedTrack Pro
          </button>
          <button onClick={() => navigate(-1)} className="text-on-surface-variant hover:bg-surface-container p-sm rounded-full transition-all duration-300">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-gutter py-xl">
        <div className="mb-lg">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Add New Medication</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Enter the details of your prescription to set up tracking and reminders.</p>
        </div>

        <form className="space-y-lg" onSubmit={handleSubmit}>

          {/* Basic Details */}
          <div className={cardCls}>
            <div className="space-y-md">
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit" htmlFor="med_name">Medication Name</label>
                <input className={inputCls} id="med_name" placeholder="e.g. Amoxicillin" type="text" />
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit" htmlFor="dosage">Dosage</label>
                  <input className={inputCls} id="dosage" placeholder="e.g. 500" type="text" />
                </div>
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit" htmlFor="unit">Unit</label>
                  <select className={inputCls} id="unit">
                    <option>mg</option><option>ml</option><option>mcg</option><option>pills</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit" htmlFor="form">Form</label>
                <select className={inputCls} id="form">
                  <option>Tablet</option><option>Capsule</option><option>Liquid</option><option>Injection</option>
                </select>
              </div>
            </div>
          </div>

          {/* Set Reminder */}
          <div className={cardCls}>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">notifications_active</span>
              Set Reminder
            </h3>
            <div className="space-y-md">
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit" htmlFor="frequency">Frequency</label>
                <select className={inputCls} id="frequency">
                  <option>Once a day</option><option>Twice a day</option><option>Three times a day</option><option>As needed</option>
                </select>
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit">Times</label>
                <div className="space-y-sm">
                  {times.map((t, i) => (
                    <div key={i} className="flex gap-sm items-center">
                      <input
                        className={`${inputCls} flex-1`}
                        type="time"
                        defaultValue={t}
                      />
                      {i === times.length - 1 && (
                        <button type="button" onClick={addTime} className="p-sm text-outline hover:text-primary transition-colors">
                          <span className="material-symbols-outlined">add_circle</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-sm border-t border-outline-variant/30 mt-md">
                <div>
                  <p className="font-body-lg text-on-surface">Meal Dependency</p>
                  <p className="font-body-sm text-on-surface-variant">Does this need to be taken with food?</p>
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
                      <span className="font-body-sm capitalize">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className={cardCls}>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-unit" htmlFor="notes">Notes / Instructions</label>
            <textarea
              className={`${inputCls} resize-none`}
              id="notes"
              placeholder="Any special instructions..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-md pt-md">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-surface-container border border-outline-variant rounded-2xl px-lg py-md font-headline-md text-headline-md text-on-surface hover:bg-surface-variant transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary-container text-on-primary rounded-2xl px-lg py-md font-headline-md text-headline-md hover:scale-[1.02] hover:shadow-premium-hover transition-all duration-300"
            >
              Save Medication
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
