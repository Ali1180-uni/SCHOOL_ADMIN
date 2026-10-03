import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { School } from "lucide-react";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { login, user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && role === "admin") {
      navigate("/", { replace: true });
    }
  }, [loading, navigate, role, user]);

  const validateForm = () => {
    const nextErrors = {};
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      nextErrors.email = "Please enter your email address.";
    } else if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Please enter your password.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate("/", { replace: true });
    } catch (error) {
      toast.error("Invalid Credentials");
      console.error("Login error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#f7f8f4] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#e1e8e1] bg-white p-8 shadow-[0_20px_60px_rgba(23,50,77,0.08)]">
        <div className="mb-6 flex flex-col items-center gap-2">
          <School className="h-10 w-10 text-emerald-500" />
          <h1 className="text-lg font-semibold text-[#17324d]">Bright Future School</h1>
          <p className="text-xs text-[#819098]">Admin Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-[#58707b]">Email Address</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((current) => ({ ...current, email: "" }));
              }}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full rounded-lg border bg-[#f7f8f4] px-3 py-2 text-sm text-[#17324d] focus:outline-none ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-700 focus:border-emerald-600"
              }`}
              placeholder="admin@school.edu"
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-xs text-red-400">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-xs text-[#58707b]">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((current) => ({ ...current, password: "" }));
              }}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`w-full rounded-lg border bg-[#f7f8f4] px-3 py-2 text-sm text-[#17324d] focus:outline-none ${
                errors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-700 focus:border-emerald-600"
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p id="password-error" className="mt-1 text-xs text-red-400">
                {errors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
