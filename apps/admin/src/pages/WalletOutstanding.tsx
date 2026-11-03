import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Pager from '../components/Pager'
import TableTools from '../components/TableTools'
import { useWalletOutstanding } from '../queries/member-lists'

export default function WalletOutstanding() {
  const [params, setParams] = useSearchParams()
  const userId = params.get('user_id') ?? ''
  const userRef = useRef<HTMLInputElement>(null)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { data } = useWalletOutstanding(params.toString(), page, limit)

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
                  <div className="col-3">
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
                <h4 className="card-title">Wallet Outstanding</h4>
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
                            <th>Name</th>
                            <th>User ID</th>
                            <th>Join Date</th>
                            <th>Wallet</th>
                            <th>Purchase Wallet</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.data.map((u) => (
                            <tr key={u.memberId}>
                              <td>{u.index}</td>
                              <td>{u.name}</td>
                              <td>{u.userId}</td>
                              <td>{u.dateTime}</td>
                              <td> {u.wallet} USD</td>
                              <td> {u.fundWallet} USD</td>
                            </tr>
                          ))}
                          {data?.data.length === 0 && (
                            <tr className="odd">
                              <td valign="top" colSpan={6} className="dataTables_empty">
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
