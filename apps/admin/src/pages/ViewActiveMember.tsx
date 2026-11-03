import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Pager from '../components/Pager'
import TableTools from '../components/TableTools'
import { useActiveMembers } from '../queries/member-lists'

export default function ViewActiveMember() {
  const [params, setParams] = useSearchParams()
  const userId = params.get('user_id') ?? ''
  const userRef = useRef<HTMLInputElement>(null)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { data } = useActiveMembers(params.toString(), page, limit)

  useEffect(() => {
    if (data?.invalidUserId) alert('Invalid User Id')
  }, [data])

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
                  setParams({ user_id: userRef.current?.value ?? '' })
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
                <h4 className="card-title">View Active Member</h4>
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
                            <th>Active Date</th>
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
                              <td>{m.activationDate}</td>
                              <td>
                                <Link to={`/viewMemberDetails?user_id=${m.userId}`} className="btn btn-success btn-sm">
                                  More
                                </Link>
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
