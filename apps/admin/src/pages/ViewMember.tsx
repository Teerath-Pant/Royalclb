import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Pager from '../components/Pager'
import { MEMBERS_PER_PAGE, useImpersonate, useMembers, useSetMemberStatus } from '../queries/members'

export default function ViewMember() {
  const [params, setParams] = useSearchParams()
  const userId = params.get('user_id') ?? ''
  const page = Number(params.get('page')) || 1
  const [input, setInput] = useState(userId)
  const { data } = useMembers(userId, page)
  const status = useSetMemberStatus()
  const impersonate = useImpersonate()

  useEffect(() => {
    if (data?.invalidUserId) alert('Invalid User Id')
  }, [data])

  const goToPage = (p: number) => {
    const next = new URLSearchParams(params)
    next.set('page', String(p))
    setParams(next)
  }

  const block = (memberId: number) =>
    confirm('Are you sure to Block this Member?') && status.mutate({ memberId, blockStatus: 0 })
  const unBlock = (memberId: number) =>
    confirm('Are you sure to Un-Block this Member?') && status.mutate({ memberId, blockStatus: 1 })

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12 ">
          <div className="iq-card">
            <div className="iq-card-header d-flex justify-content-between"></div>
            <div className="iq-card-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setParams(input ? { user_id: input } : {})
                }}
              >
                <div className="form-row">
                  <div className="col-3">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter User ID"
                      name="user_id"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                  </div>
                  <div className="col-2">
                    <input className="btn btn-primary" type="submit" value="Search" />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-sm-12">
          <div className="iq-card">
            <div className="iq-card-header d-flex justify-content-between">
              <div className="iq-header-title">
                <h4 className="card-title">View Member</h4>
              </div>
            </div>
            <div className="iq-card-body">
              <div className="table-responsive">
                <div className="dataTables_wrapper dt-bootstrap4 no-footer">
                  <div className="row">
                    <div className="col-sm-12">
                      <table className="table table-striped table-bordered dataTable no-footer">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>User Id</th>
                            <th>Member Id</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Password</th>
                            <th>Sponser</th>
                            <th>Recharge Wallet</th>
                            <th>Winning Wallet</th>
                            <th>Bonus Wallet</th>
                            <th>Total Wallet</th>
                            <th>Joinig Date</th>
                            <th>More Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.data.map((m, i) => (
                            <tr key={m.memberId}>
                              <td>{(page - 1) * MEMBERS_PER_PAGE + i + 1}</td>
                              <td>{m.uid}</td>
                              <td>{m.userId}</td>
                              <td>{m.name}</td>
                              <td>{m.phone}</td>
                              <td>{m.password}</td>
                              <td>{m.sponser}</td>
                              <td>{m.fundWallet}</td>
                              <td>{m.wallet}</td>
                              <td>{m.bonusWallet}</td>
                              <td>{m.totalWallet}</td>
                              <td>{m.dateTime}</td>
                              <td>
                                <Link to={`/viewMemberDetails?user_id=${m.userId}`}>
                                  <span className="badge badge-success">More</span>
                                </Link>
                                &nbsp;
                                <button className="impersonate-button" onClick={() => impersonate.mutate(m.memberId)}>
                                  <span className="badge badge-primary">Dashboard</span>
                                </button>
                                &nbsp;
                                {m.accountStatus === 1 ? (
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      block(m.memberId)
                                    }}
                                  >
                                    <span className="badge badge-danger">Block</span>
                                  </a>
                                ) : (
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      unBlock(m.memberId)
                                    }}
                                  >
                                    <span className="badge badge-warning">Un-Block</span>
                                  </a>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {data && <Pager total={data.total} page={page} perPage={MEMBERS_PER_PAGE} onPage={goToPage} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
