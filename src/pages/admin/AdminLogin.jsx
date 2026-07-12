import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { ACCENT, getThemeClasses } from "../../constants/theme";

export default function AdminLogin() {
  const { dark } = useTheme();
  const { bg, text, card, muted } = getThemeClasses(dark);
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = `w-full rounded-lg border px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-[#00c896] ${
    dark ? "border-[#2a2a2a]" : "border-[#ddd]"
  }`;

  return (
    <div className={`${bg} ${text} min-h-screen flex items-center justify-center font-mono px-4`}>
      <form onSubmit={handleSubmit} className={`${card} border rounded-2xl p-8 w-full max-w-sm space-y-5`}>
        <div>
          <h1 className="text-xl font-bold tracking-widest" style={{ color: ACCENT }}>
            Admin Login
          </h1>
          <p className={`text-xs ${muted} mt-1`}>Sign in to manage portfolio content.</p>
        </div>
        <div>
          <label className={`block text-xs uppercase tracking-wide ${muted} mb-1`}>Email</label>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={`block text-xs uppercase tracking-wide ${muted} mb-1`}>Password</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-lg text-sm font-bold text-black disabled:opacity-50"
          style={{ backgroundColor: ACCENT }}
        >
          {submitting ? "Signing in…" : "Sign In"}
        </button>
        <a href="/" className={`block text-center text-xs ${muted} hover:text-[#00c896]`}>
          ← Back to site
        </a>
      </form>
    </div>
  );
}
