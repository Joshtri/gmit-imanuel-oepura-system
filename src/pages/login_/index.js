import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else{
      setLoading(false);
      router.push("/");
    }
  }

  return (
    <div className="w-full h-screen grid place-items-center bg-base-100 overflow-x-hidden">
      <form onSubmit={handleLogin}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">Login</legend>

          <label className="label">Email</label>
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="label">Password</label>
          <div className="form-control w-full">
            <label className="input input-bordered flex items-center gap-2">
              <input
                type={showPassword ? "text" : "password"}
                className="grow"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
              </button>
            </label>
          </div>

          {error && <div className="text-error mt-2">{error}</div>}

          <button
            className="btn btn-success text-white font-bold mt-4 w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </fieldset>
      </form>
    </div>
  );
}
