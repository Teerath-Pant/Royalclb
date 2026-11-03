import { Link } from 'react-router-dom'
import { useAdminMe } from '../queries/auth'
import { useDashboard } from '../queries/dashboard'

const shareBtn = { display: 'inline-block', marginTop: '1px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '5px' }

export default function Dashboard() {
  const { data: me } = useAdminMe()
  const { data: d } = useDashboard()
  if (!d || !me) return null

  const domain = location.host
  const referralLink = `https://${domain}/register.php?referralCode=${me.userId}`
  const copyLink = () => navigator.clipboard.writeText(referralLink).then(() => alert('Referral Link Copied Successfully'))

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12 col-xs-12">
          <div className="form-group" style={{ textAlign: 'center', fontSize: 18, fontWeight: 600, color: '#fff' }}>
            <label>Referral Link</label>{' '}
            <a
              style={shareBtn}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                copyLink()
              }}
              className="btn btn-sm btn-success waves-effect"
            >
              <i className="fa fa-copy"></i>
              <span>Copy </span>
            </a>{' '}
            <a
              style={shareBtn}
              target="_blank"
              href={`https://${domain}/send?phone=&text=${referralLink}`}
              className="btn btn-sm btn-success waves-effect"
            >
              <i className="fa fa-whatsapp"></i>
              <span>Whatsapp</span>
            </a>{' '}
            <a
              style={shareBtn}
              target="_blank"
              href={`https://${domain}/sharer/sharer.php?u=${referralLink}&quote=text`}
              className="btn btn-sm btn-primary waves-effect"
            >
              <i className="fa fa-facebook-f"></i>
              <span>Facebook</span>
            </a>{' '}
            <a
              style={shareBtn}
              target="_blank"
              href={`https://${domain}/telegram.me/share/url?url=h?affiliateCode=${me.userId}&text=text`}
              className="btn btn-sm btn-primary waves-effect"
            >
              <i className="fa fa-telegram"></i>
              <span>Telegram</span>
            </a>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <Link to="/viewMember">
                <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
                  <div className="iq-card-body iq-bg-primary rounded">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="rounded-circle iq-card-icon bg-primary">
                        <i className="ri-user-fill"></i>
                      </div>
                      <div className="text-right">
                        <h3 className="mb-0">
                          <i className="fa fa-user"></i> {d.totalUser ?? '0'}
                        </h3>
                        <h6 className="">Total User</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-6 col-lg-3">
              <Link to="/viewActiveMember">
                <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
                  <div className="iq-card-body iq-bg-success rounded">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="rounded-circle iq-card-icon bg-success">
                        <i className="ri-user-fill"></i>
                      </div>
                      <div className="text-right">
                        <h3 className="mb-0">
                          <i className="fa fa-user"></i> {d.activeMember ?? '0'}
                        </h3>
                        <h6 className="">Active User</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-6 col-lg-3">
              <Link to="/viewInActiveMember">
                <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
                  <div className="iq-card-body iq-bg-danger rounded">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="rounded-circle iq-card-icon bg-danger">
                        <i className="ri-user-fill"></i>
                      </div>
                      <div className="text-right">
                        <h3 className="mb-0">
                          <i className="fa fa-user"></i> {d.inActiveMember ?? '0'}
                        </h3>
                        <h6 className="">In Active User</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-md-6 col-lg-3">
              <Link to="/activeIncomeUserMember">
                <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
                  <div className="iq-card-body iq-bg-primary rounded">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="rounded-circle iq-card-icon bg-danger">
                        <i className="ri-user-fill"></i>
                      </div>
                      <div className="text-right">
                        <h3 className="mb-0" style={{ fontSize: 14 }}>
                          {d.totalActiveIncome ?? '0'}
                        </h3>
                        <h6 className="">Active Income User</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-md-6 col-lg-3">
              <Link to="/recharges?status=PENDING">
                <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
                  <div className="iq-card-body iq-bg-success rounded">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="rounded-circle iq-card-icon bg-success">
                        <span>&#36;</span>
                      </div>
                      <div className="text-right">
                        <h3 className="mb-0" style={{ fontSize: 14 }}>
                          {d.fundRequest ?? '0.00'}₹
                        </h3>
                        <h6 className="">Pending Fund Request</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-6 col-lg-3">
              <Link to="/withdrawals?status=APPROVED">
                <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
                  <div className="iq-card-body iq-bg-success rounded">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="rounded-circle iq-card-icon bg-success">
                        <span>&#36;</span>
                      </div>
                      <div className="text-right">
                        <h3 className="mb-0" style={{ fontSize: 14 }}>
                          {d.totalWithdraw ?? '0.00'}₹
                        </h3>
                        <h6 className="">Total Withdraw</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-6 col-lg-3">
              <Link to="/withdrawals?status=PENDING">
                <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
                  <div className="iq-card-body iq-bg-success rounded">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="rounded-circle iq-card-icon bg-success">
                        <span>&#36;</span>
                      </div>
                      <div className="text-right">
                        <h3 className="mb-0" style={{ fontSize: 14 }}>
                          {d.totalPendingWithdraw ?? '0.00'}₹
                        </h3>
                        <h6 className="">Pending Withdrawal</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-6 col-lg-3">
              <Link to="/viewMember">
                <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
                  <div className="iq-card-body iq-bg-success rounded">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="rounded-circle iq-card-icon bg-success">
                        <span>&#36;</span>
                      </div>
                      <div className="text-right">
                        <h3 className="mb-0" style={{ fontSize: 14 }}>
                          {d.workingWallet ?? '0.00'} ₹
                        </h3>
                        <h6 className="">Income Wallet </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-md-6 col-lg-3">
              <Link to="/walletOutstanding">
                <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
                  <div className="iq-card-body iq-bg-warning rounded">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="rounded-circle iq-card-icon bg-warning">
                        <span>&#36;</span>
                      </div>
                      <div className="text-right">
                        <h3 className="mb-0" style={{ fontSize: 14 }}>
                          {d.fundWallet ?? '0.00'} ₹
                        </h3>
                        <h6 className="">Purchase Wallet</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
