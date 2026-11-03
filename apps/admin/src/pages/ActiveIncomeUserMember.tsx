import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Pager from '../components/Pager'
import TableTools from '../components/TableTools'
import { useDatepicker } from '../lib/datepicker'
import { useMembersByJoinDate } from '../queries/member-lists'
import { useImpersonate, useSetMemberStatus } from '../queries/members'

const today = () => new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' }).replaceAll('/', '-')

export default function ActiveIncomeUserMember() {
  const [params, setParams] = useSearchParams()
  const hasParams = params.size > 0
  const userId = params.get('user_id') ?? ''
  const fromDate = hasParams ? (params.get('from_date') ?? '') : today()
  const toDate = hasParams ? (params.get('to_date') ?? '') : today()
  // No params means the page opened with today's date in the inputs, so the query must use it too.
  const query = hasParams ? params.toString() : new URLSearchParams({ from_date: fromDate, to_date: toDate }).toString()
  const userRef = useRef<HTMLInputElement>(null)
  const fromRef = useRef<HTMLInputElement>(null)
  const toRef = useRef<HTMLInputElement>(null)
  useDatepicker(fromRef)
  useDatepicker(toRef)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { data } = useMembersByJoinDate(query, page, limit)
  const status = useSetMemberStatus()
  const impersonate = useImpersonate()

  useEffect(() => {
    if (data?.invalidUserId) alert('Invalid User Id')
  }, [data])

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
                key={params.toString()}
                onSubmit={(e) => {
                  e.preventDefault()
                  setParams({
                    user_id: userRef.current?.value ?? '',
                    from_date: fromRef.current?.value ?? '',
                    to_date: toRef.current?.value ?? '',
                  })
                  setPage(1)
                }}
              >
                <div className="form-row">
                  <div className="col-3">
                    <input
                      ref={userRef}
                      className="form-control"
                      type="text"
                      placeholder="Enter User ID"
                      name="user_id"
                      defaultValue={data?.invalidUserId ? '' : userId}
                    />
                  </div>
                  <div className="col-3">
                    <input
                      ref={fromRef}
                      type="text"
                      name="from_date"
                      id="from_date"
                      className="form-control "
                      placeholder="e.g. From Date"
                      required
                      defaultValue={fromDate}
                      readOnly
                    />
                  </div>
                  <div className="col-3">
                    <input
                      ref={toRef}
                      type="text"
                      name="to_date"
                      id="to_date"
                      className="form-control "
                      placeholder="e.g. To Date"
                      required
                      defaultValue={toDate}
                      readOnly
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
                  <TableTools
                    perPage={limit}
                    onPerPage={(n) => {
                      setLimit(n)
                      setPage(1)
                    }}
                  />
                  <div className="row">
                    <div className="col-sm-12">
                      <table id="example" className="table table-striped table-bordered dataTable no-footer">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>User Id</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Sponser</th>
                            <th>Joinig Date</th>
                            <th>Status</th>
                            <th>More Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.data.map((m) => (
                            <tr key={m.memberId}>
                              <td>{m.index}</td>
                              <td>{m.userId}</td>
                              <td>{m.name}</td>
                              <td>{m.phone}</td>
                              <td>{m.sponser}</td>
                              <td>{m.dateTime}</td>
                              <td>
                                <strong>{m.topupFlag === 1 ? 'Active' : 'In-Active'}</strong>
                              </td>
                              <td>
                                <Link to={`/viewMemberDetails?user_id=${m.userId}`}>
                                  <span className="badge badge-success">More</span>
                                </Link>
                                &nbsp;
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    impersonate.mutate(m.memberId)
                                  }}
                                >
                                  <span className="badge badge-primary">Dashboard</span>
                                </a>
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
                          {data?.data.length === 0 && (
                            <tr className="odd">
                              <td valign="top" colSpan={8} className="dataTables_empty">
                                No data available in table
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {data && <Pager total={data.total} page={page} perPage={limit} onPage={setPage} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
