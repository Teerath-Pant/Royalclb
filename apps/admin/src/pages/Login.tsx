import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminLogin, useAdminMe, useVerifyAdminOtp } from '../queries/auth'

export default function Login() {
  const me = useAdminMe()
  const login = useAdminLogin()
  const verify = useVerifyAdminOtp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [awaitingOtp, setAwaitingOtp] = useState(false)

  if (me.data) return <Navigate to="/dashboard" replace />

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (awaitingOtp) return verify.mutate({ email: email.trim(), otp: otp.trim() })
    login.mutate(
      { email: email.trim(), password: password.trim() },
      { onSuccess: (res) => (res.data as { requiresOtp?: boolean } | null)?.requiresOtp && setAwaitingOtp(true) },
    )
  }

  return (
    <section className="sign-in-page">
      <div className="container sign-in-page-bg mt-5 p-0">
        <div className="row no-gutters">
          <div className="col-md-6 text-center">
            <div className="sign-in-detail text-white">
              <div className="item">
                <h4 className="mb-1 text-white"></h4>
              </div>
            </div>
          </div>
          <div className="col-md-6 position-relative">
            <div className="sign-in-from">
              <h1 className="mb-0">Sign in</h1>
              <form className="mt-4" id="loginForm" onSubmit={submit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    className="form-control mb-0"
                    id="email"
                    name="email"
                    placeholder="Email"
                    required
                    autoFocus
                    disabled={awaitingOtp}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control mb-0"
                    name="password"
                    id="password"
                    placeholder="Password"
                    required
                    disabled={awaitingOtp}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {awaitingOtp && (
                  <div className="form-group" id="otpSection">
                    <label htmlFor="inputOtp">OTP</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-control mb-0"
                      maxLength={6}
                      name="otp"
                      id="inputOtp"
                      placeholder="Enter 6-digit OTP"
                      autoFocus
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                )}

                <div className="d-inline-block w-100">
                  <div className="custom-control custom-checkbox d-inline-block mt-2 pt-1"></div>
                  <button
                    type="submit"
                    id="loginBtn"
                    className="btn btn-primary float-right"
                    disabled={login.isPending || verify.isPending}
                  >
                    {awaitingOtp ? 'Verify OTP' : 'Sign in'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
