import { useLocation } from 'react-router-dom'

export default function ComingSoon() {
  const { pathname } = useLocation()

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <div className="iq-card">
            <div className="iq-card-header d-flex justify-content-between">
              <div className="iq-header-title">
                <h4 className="card-title">{pathname.slice(1)}</h4>
              </div>
            </div>
            <div className="iq-card-body">Not ported yet.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
