import { Link, useNavigate } from "react-router-dom";

/**
 * @param {{ title?: string, showAdd?: boolean, onClose?: () => void }} props
 */
export default function TopBar({ title = "MedTrack Pro", showAdd = true, onClose }) {
  const navigate = useNavigate();

  return (
    <header className="md:hidden bg-surface/80 backdrop-blur-md sticky top-0 w-full z-50 shadow-sm border-b border-surface-container-lowest/50">
      <div className="flex justify-between items-center w-full px-lg py-sm max-w-container-max mx-auto">
        <Link
          to="/dashboard"
          className="font-display-lg text-headline-md tracking-tight text-primary font-extrabold"
        >
          {title}
        </Link>

        {showAdd ? (
          <button
            onClick={() => navigate("/add-medication")}
            className="bg-primary-container text-on-primary px-md py-sm rounded-full font-label-caps text-label-caps hover:scale-105 transition-all duration-300"
          >
            İlaç Ekle
          </button>
        ) : (
          <button
            onClick={onClose ?? (() => navigate(-1))}
            className="text-on-surface-variant hover:bg-surface-container p-sm rounded-full transition-all duration-300"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>
    </header>
  );
}
