import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Pager from '../components/Pager'
import TableTools from '../components/TableTools'
import { useAviatorBets } from '../queries/aviator'

export default function BetHistoryAviator() {
  const [params] = useSearchParams()
  const sessionId = params.get('sessionId') ?? ''
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { data } = useAviatorBets(sessionId, page, limit)

  if (!sessionId) return <>Invalid Game Session Id</>

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <div className="iq-card">
            <div className="iq-card-header d-flex justify-content-between">
              <div className="iq-header-title">
                <h4 className="card-title">Bet History</h4>
              </div>
            </div>
          </div>
          <div className="iq-card">
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
                            <th>Bet Amount</th>
                            <th>Fly X</th>
                            <th>Winning Amount</th>
                            <th>Charge</th>
                            <th>Net Amount</th>
                            <th>Status</th>
                            <th>Date Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.data.map((b) => (
                            <tr key={b.id}>
                              <td>{b.index}</td>
                              <td>{b.uid}</td>
                              <td>{b.name}</td>
                              <td>{b.betAmount}</td>
                              <td>{b.cashoutMultiplier ? `${b.cashoutMultiplier}x` : '-'}</td>
                              <td>{b.winAmount}</td>
                              <td>{b.tax}%</td>
                              <td>{b.netAmount}</td>
                              <td>
                                {b.status === 'CASHED_OUT' && <span className="text-success">Cashed out</span>}
                                {b.status === 'LOST' && <span className="text-danger">Lost</span>}
                                {b.status !== 'CASHED_OUT' && b.status !== 'LOST' && <span className="text-info">Pending</span>}
                              </td>
                              <td>{b.createdAt}</td>
                            </tr>
                          ))}
                          {data?.data.length === 0 && (
                            <tr className="odd">
                              <td valign="top" colSpan={10} className="dataTables_empty">
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
