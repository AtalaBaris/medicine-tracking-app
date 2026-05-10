import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    navigate("/dashboard");
  }

  return (
    <main className="w-full min-h-screen flex font-body-lg bg-background text-on-surface antialiased">
      {/* Illustration Side */}
      <div className="hidden lg:flex w-1/2 bg-surface-container-low flex-col justify-center items-center p-xl relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Health technology background"
            className="w-full h-full object-cover opacity-80 mix-blend-multiply"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjIIOqyuzbrhno7PeYODzgzEhiwVJZRbSMMZnQkGKV6AOV61VtbhBPCSXotNj5XtcngPOor3pxAIlKzqOkseoWv1iHFuSxxA8fizdgf0BHoX_Y1QdjyRWJCX_VbTe0r03jXHfFhDLJtDgZxssY8mu4P-jv9tG2x4yiB8wC-by3JyHOdp2eNSoYcPxKDMxZv_J4CmbBYzZQwWUU6MAP3osIoluf07M0LkwXAhKtfaW5aU0Si_JWadlsbYQUUWMa2tuQTv0VV6IkN98"
          />
        </div>
        <div className="relative z-10 max-w-md text-center bg-surface/90 backdrop-blur-md p-xl rounded-2xl shadow-premium">
          <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-2xl flex items-center justify-center mx-auto mb-lg">
            <span className="material-symbols-outlined filled text-[32px]">monitor_heart</span>
          </div>
          <h2 className="font-display-lg text-display-lg text-primary mb-md">MedTrack Pro</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Join thousands managing their health journey with precision and clarity.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-lg sm:px-xl py-xl bg-surface">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-xl text-center lg:text-left">
            <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Create Account</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Start tracking your medications today.
            </p>
          </div>

          <form className="space-y-lg" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-md">
              {[
                { id: "first-name", label: "First Name", placeholder: "Sarah" },
                { id: "last-name", label: "Last Name", placeholder: "Jenkins" },
              ].map(({ id, label, placeholder }) => (
                <div key={id}>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs" htmlFor={id}>
                    {label}
                  </label>
                  <input
                    id={id}
                    placeholder={placeholder}
                    className="block w-full px-md py-sm bg-surface-container-low border-transparent focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary rounded-xl font-body-lg text-body-lg text-on-surface transition-all duration-300 placeholder:text-outline-variant"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs" htmlFor="reg-email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">mail</span>
                </div>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="name@example.com"
                  className="block w-full pl-xl pr-md py-sm bg-surface-container-low border-transparent focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary rounded-xl font-body-lg text-body-lg text-on-surface transition-all duration-300 placeholder:text-outline-variant"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs" htmlFor="reg-password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">lock</span>
                </div>
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="block w-full pl-xl pr-xl py-sm bg-surface-container-low border-transparent focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary rounded-xl font-body-lg text-body-lg text-on-surface transition-all duration-300 placeholder:text-outline-variant"
                />
                <div className="absolute inset-y-0 right-0 pr-md flex items-center">
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-outline hover:text-on-surface-variant transition-colors">
                    <span className="material-symbols-outlined">{showPassword ? "visibility" : "visibility_off"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded" id="terms" type="checkbox" />
              <label className="ml-sm font-body-sm text-body-sm text-on-surface-variant" htmlFor="terms">
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">Terms of Service</a> and{" "}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-sm px-md rounded-xl font-headline-md text-headline-md text-on-primary bg-primary hover:bg-primary-container hover:scale-[1.02] transition-all duration-300 shadow-premium hover:shadow-premium-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Create Account
            </button>
          </form>

          <p className="mt-lg text-center font-body-sm text-body-sm text-on-surface-variant">
            Already have an account?{" "}
            <Link to="/login" className="font-headline-md text-headline-md text-primary hover:text-primary-container transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
