import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    navigate("/dashboard");
  }

  return (
    <main className="w-full min-h-screen flex font-body-lg bg-background text-on-surface antialiased">
      {/* ── Illustration Side ───────────────────────────────── */}
      <div className="hidden lg:flex w-1/2 bg-surface-container-low flex-col justify-center items-center p-xl relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Abstract health technology background"
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
            Effortless control over your health journey. Precision, security, and clarity for your
            medication management.
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
            <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Welcome Back</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Enter your details to access your dashboard.
            </p>
          </div>

          <form className="space-y-lg" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                className="block font-label-caps text-label-caps text-on-surface-variant mb-xs"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">mail</span>
                </div>
                <input
                  className="block w-full pl-xl pr-md py-sm bg-surface-container-low border-transparent focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary rounded-xl font-body-lg text-body-lg text-on-surface transition-all duration-300 placeholder:text-outline-variant"
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-xs">
                <label
                  className="block font-label-caps text-label-caps text-on-surface-variant"
                  htmlFor="password"
                >
                  Password
                </label>
                <a className="font-body-sm text-body-sm text-primary hover:text-primary-container transition-colors" href="#">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">lock</span>
                </div>
                <input
                  className="block w-full pl-xl pr-xl py-sm bg-surface-container-low border-transparent focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary rounded-xl font-body-lg text-body-lg text-on-surface transition-all duration-300 placeholder:text-outline-variant"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                />
                <div className="absolute inset-y-0 right-0 pr-md flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-outline hover:text-on-surface-variant transition-colors"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <input
                className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded bg-surface-container-low"
                id="remember-me"
                name="remember-me"
                type="checkbox"
              />
              <label className="ml-sm block font-body-sm text-body-sm text-on-surface-variant" htmlFor="remember-me">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-sm px-md rounded-xl font-headline-md text-headline-md text-on-primary bg-primary hover:bg-primary-container hover:scale-[1.02] transition-all duration-300 shadow-premium hover:shadow-premium-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sign In
            </button>
          </form>

          {/* OAuth */}
          <div className="mt-xl">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-variant" />
              </div>
              <div className="relative flex justify-center font-body-sm text-body-sm">
                <span className="px-sm bg-surface text-on-surface-variant">Or continue with</span>
              </div>
            </div>

            <div className="mt-lg grid grid-cols-2 gap-md">
              {[
                {
                  label: "Google",
                  svg: (
                    <svg className="w-5 h-5 mr-sm" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  ),
                },
                {
                  label: "Apple",
                  svg: (
                    <svg className="w-5 h-5 mr-sm text-on-surface" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.85 1.99-1.92 3.65-2.53 4.08zM12.03 7.25C11.83 3.56 15.22 1 15.22 1c-.13 3.86-3.8 6.55-3.19 6.25z" />
                    </svg>
                  ),
                },
              ].map(({ label, svg }) => (
                <button
                  key={label}
                  type="button"
                  className="w-full inline-flex justify-center py-sm px-md border border-surface-variant rounded-xl shadow-sm bg-surface-container-lowest font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container-low transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {svg}
                  {label}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-lg text-center font-body-sm text-body-sm text-on-surface-variant">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-headline-md text-headline-md text-primary hover:text-primary-container transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
