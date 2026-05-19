import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../services/api";
import { setStoredUser } from "../../utils/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user } = await auth.login(email, password);
      setStoredUser(user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="w-full min-h-screen flex font-body-lg bg-background text-on-surface antialiased">
      {/* ── Illustration Side ───────────────────────────────── */}
      <div className="hidden lg:flex w-1/2 bg-surface-container-low flex-col justify-center items-center p-xl relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Sağlık teknolojisi arka plan görseli"
            className="w-full h-full object-cover opacity-80 mix-blend-multiply"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjIIOqyuzbrhno7PeYODzgzEhiwVJZRbSMMZnQkGKV6AOV61VtbhBPCSXotNj5XtcngPOor3pxAIlKzqOkseoWv1iHFuSxxA8fizdgf0BHoX_Y1QdjyRWJCX_VbTe0r03jXHfFhDLJtDgZxssY8mu4P-jv9tG2x4yiB8wC-by3JyHOdp2eNSoYcPxKDMxZv_J4CmbBYzZQwWUU6MAP3osIoluf07M0LkwXAhKtfaW5aU0Si_JWadlsbYQUUWMa2tuQTv0VV6IkN98"
          />
        </div>
        <div className="relative z-10 max-w-md text-center bg-surface/90 backdrop-blur-md p-xl rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
          <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-2xl flex items-center justify-center mx-auto mb-lg shadow-[0px_10px_30px_rgba(0,82,204,0.08)]">
            <span className="material-symbols-outlined filled text-[32px]">monitor_heart</span>
          </div>
          <h2 className="font-display-lg text-display-lg text-primary mb-md">MedTrack Pro</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Sağlık yolculuğunuzda zahmetsiz kontrol. İlaç yönetiminiz için hassasiyet, güvenlik ve
            netlik.
          </p>
        </div>
      </div>

      {/* ── Form Side ───────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-lg sm:px-xl py-xl bg-surface">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile logo */}
          <div className="mb-xl text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-md">
              <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined filled text-[20px]">monitor_heart</span>
              </div>
            </div>
            <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Tekrar Hoş Geldiniz</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Panonuza erişmek için bilgilerinizi girin.
            </p>
          </div>

          <form className="space-y-lg" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                className="block font-label-caps text-label-caps text-on-surface-variant mb-xs"
                htmlFor="email"
              >
                E-posta Adresi
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex w-12 items-center justify-center">
                  <span className="material-symbols-outlined text-[20px] text-outline">mail</span>
                </div>
                <input
                  className="block w-full py-sm pl-12 pr-4 bg-surface-container-low border-transparent focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary rounded-xl font-body-lg text-body-lg text-on-surface transition-all duration-300 placeholder:text-outline-variant"
                  id="email"
                  name="email"
                  placeholder="ornek@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block font-label-caps text-label-caps text-on-surface-variant mb-xs"
                htmlFor="password"
              >
                Şifre
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex w-12 items-center justify-center">
                  <span className="material-symbols-outlined text-[20px] text-outline">lock</span>
                </div>
                <input
                  className="block w-full py-sm pl-12 pr-12 bg-surface-container-low border-transparent focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary rounded-xl font-body-lg text-body-lg text-on-surface transition-all duration-300 placeholder:text-outline-variant"
                  id="password"
                  name="password"
                  placeholder="Şifrenizi girin"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex w-12 items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-outline hover:text-on-surface-variant transition-colors"
                    aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-error font-body-sm text-body-sm" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-sm px-md rounded-xl font-headline-md text-headline-md text-on-primary bg-primary hover:bg-primary-container hover:scale-[1.02] transition-all duration-300 shadow-premium hover:shadow-premium-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <p className="mt-lg text-center font-body-sm text-body-sm text-on-surface-variant">
            Hesabınız yok mu?{" "}
            <Link
              to="/register"
              className="font-headline-md text-headline-md text-primary hover:text-primary-container transition-colors"
            >
              Kayıt ol
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
