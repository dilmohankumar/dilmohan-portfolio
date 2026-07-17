import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { ACCENT, getThemeClasses } from "../constants/theme";

export default function Landing() {
  const { dark, toggleDark } = useTheme();
  const { bg, text, card, muted } = getThemeClasses(dark);
  const { isAdmin, username } = useAuth();

  return (
    <div className={`${bg} ${text} min-h-screen font-mono transition-colors duration-500`}>
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <span className="text-xl font-bold tracking-widest" style={{ color: ACCENT }}>
          Portfolio<span className={dark ? "text-white" : "text-black"}>.</span>
        </span>
        <button
          onClick={toggleDark}
          className="w-10 h-5 rounded-full relative"
          style={{ backgroundColor: dark ? ACCENT : "#ccc" }}
        >
          <span
            className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300"
            style={{ left: dark ? "22px" : "2px" }}
          />
        </button>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 text-center">
        <p className={`text-sm tracking-[0.3em] uppercase ${muted} mb-4`}>Free & open</p>
        <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-6">
          Build your own <span style={{ color: ACCENT }}>developer portfolio</span>
        </h1>
        <p className={`${muted} text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed`}>
          Sign up, drag-and-drop your sections into place, pick your colors, add your projects — and get a live
          page at your own link to share with the world.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          {isAdmin ? (
            <Link
              to="/admin"
              className="px-6 py-3 rounded-sm text-sm tracking-widest font-bold text-black transition-all hover:scale-105"
              style={{ backgroundColor: ACCENT }}
            >
              Go to your dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="px-6 py-3 rounded-sm text-sm tracking-widest font-bold text-black transition-all hover:scale-105"
                style={{ backgroundColor: ACCENT }}
              >
                Create your portfolio →
              </Link>
              <Link
                to="/admin/login"
                className={`px-6 py-3 rounded-sm text-sm tracking-widest border transition-all hover:scale-105 ${dark ? "border-[#333] hover:border-[#555]" : "border-[#ccc] hover:border-[#999]"}`}
              >
                Log in
              </Link>
            </>
          )}
        </div>

        {username && (
          <p className={`text-xs ${muted} mt-6`}>
            Your portfolio is live at{" "}
            <Link to={`/u/${username}`} className="hover:underline" style={{ color: ACCENT }}>
              /u/{username}
            </Link>
          </p>
        )}

        <div className={`${card} border rounded-2xl p-6 mt-16 text-left`}>
          <p className="text-sm font-bold mb-2">What you get</p>
          <ul className={`text-sm ${muted} space-y-1 list-disc list-inside`}>
            <li>Drag-and-drop section reordering, visibility toggles, and custom sections</li>
            <li>Your own accent color, header logo text, and nav links</li>
            <li>Dedicated pages for projects, experience, education, skills, and contact info</li>
            <li>A shareable link at /u/your-username</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
