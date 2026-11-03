import { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Pager from '../components/Pager'
import TableTools from '../components/TableTools'
import { useDatepicker } from '../lib/datepicker'
import { useAviatorGames, useResetAviatorBucket } from '../queries/aviator'

const today = () => new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' }).replaceAll('/', '-')

export default function GameHistoryAviator() {
  const [params, setParams] = useSearchParams()
  const fromDate = params.get('from_date') || today()
  const toDate = params.get('to_date') || today()
  const fromRef = useRef<HTMLInputElement>(null)
  const toRef = useRef<HTMLInputElement>(null)
  useDatepicker(fromRef)
  useDatepicker(toRef)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { data } = useAviatorGames(fromDate, toDate, page, limit)
  const reset = useResetAviatorBucket()

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12 ">
          <div className="iq-card">
            <div className="iq-card-header d-flex justify-content-between">
              <form
                className="text-center"
                style={{ marginTop: '1rem' }}
                onSubmit={(e) => {
                  e.preventDefault()
                  reset.mutate()
                }}
              >
                <p style={{ color: 'black' }}>
                  Bucket: <span>{data?.bucket}</span>
                </p>
                <button className="reset-btn" type="submit">
                  Reset Bucket
                </button>
              </form>
            </div>
            <div className="iq-card-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setParams({ from_date: fromRef.current?.value ?? '', to_date: toRef.current?.value ?? '' })
                  setPage(1)
                }}
              >
                <div className="form-row">
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
                    <input className="btn btn-primary" style={{ height: '100%', paddingInline: '1.5rem' }} type="submit" value="Search" />
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
                <h4 className="card-title">Game History</h4>
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
                            <th>Bucket Amount</th>
                            <th>Max Fly</th>
                            <th>Users</th>
                            <th>Total Bet</th>
                            <th>Admin Profit</th>
                            <th>Winning Amount</th>
                            <th>User Amount</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Ended At</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.data.map((g) => (
                            <tr key={g.id}>
                              <td>{g.index}</td>
                              <td>{g.bucketAmount}</td>
                              <td>{g.maxFly}</td>
                              <td>
                                <Link to={`/betHistoryAviator?sessionId=${g.id}`}>{g.users}</Link>
                              </td>
                              <td>{g.totalBet}</td>
                              <td>
                                {g.adminProfitSign > 0 && <span className="text-success">{g.adminProfit}</span>}
                                {g.adminProfitSign < 0 && <span className="text-danger">{g.adminProfit}</span>}
                                {g.adminProfitSign === 0 && <span>{g.adminProfit}</span>}
                              </td>
                              <td>{g.winningAmount}</td>
                              <td>{g.userAmount}</td>
                              <td>{g.status}</td>
                              <td>{g.createdAt}</td>
                              <td>{g.endedAt}</td>
                            </tr>
                          ))}
                          {data?.data.length === 0 && (
                            <tr className="odd">
                              <td valign="top" colSpan={11} className="dataTables_empty">
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
