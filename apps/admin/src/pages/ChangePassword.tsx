import { useState } from 'react'
import { useChangeAdminPassword } from '../queries/auth'

export default function ChangePassword() {
  const [password, setPassword] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const change = useChangeAdminPassword()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirm('Are you sure?')) return

    change.mutate(
      { password, password1, password2 },
      {
        onSuccess: (body) => {
          alert(body.message)
          window.location.reload()
        },
        onError: (error) => {
          alert(error.message)
          window.location.reload()
        },
      },
    )
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-6 col-lg-6">
          <div className="iq-card">
            <div className="iq-card-header d-flex justify-content-between">
              <div className="iq-header-title">
                <h4 className="card-title">Change Login Password</h4>
              </div>
            </div>
            <div className="iq-card-body">
              <form className="text-center" onSubmit={submit}>
                <fieldset>
                  <div className="form-card text-left">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Current Password *</label>
                          <input
                            type="password"
                            className="form-control"
                            required
                            name="password"
                            placeholder="*******"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>New Password *</label>
                          <input
                            type="password"
                            className="form-control"
                            name="password1"
                            id="loginPassword"
                            placeholder="*********"
                            required
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Re-Type New Password *</label>
                          <input
                            type="password"
                            className="form-control"
                            name="password2"
                            placeholder=" *********"
                            required
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button type="submit" name="loginPassword" className="btn btn-primary action-button float-left" disabled={change.isPending}>
                    Change
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
