import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Pager from '../components/Pager'
import TableTools from '../components/TableTools'
import { useK3Bets } from '../queries/k3'

export default function BetHistoryK3() {
  const [params] = useSearchParams()
  const sessionId = params.get('sessionId') ?? ''
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { data } = useK3Bets(sessionId, page, limit, search)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 400)
    return () => clearTimeout(timeout)
  }, [searchInput])

  if (!sessionId) return <>Invalid Game Session Id</>

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <div className="iq-card">
            <div className="iq-card-header d-flex justify-content-between">
              <div className="iq-header-title">
                <h4 className="card-title">Bet History (Game ID: {data?.gameId})</h4>
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
                    search={searchInput}
                    onSearch={setSearchInput}
                  />
                  <div className="row">
                    <div className="col-sm-12">
                      <table id="example" className="table table-striped table-bordered dataTable no-footer">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>User Id</th>
                            <th>Name</th>
                            <th>Total Wallet</th>
                            <th>Bet On</th>
                            <th>Bet Amount</th>
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
                              <td>{b.totalWallet}</td>
                              <td>{b.betOn}</td>
                              <td>{b.betAmount}</td>
                              <td>{b.winAmount}</td>
                              <td>{b.charge}</td>
                              <td>{b.netWinAmount}</td>
                              <td>
                                {b.status === 1 && <span className="text-success">Win</span>}
                                {b.status === 2 && <span className="text-danger">Lost</span>}
                                {b.status !== 1 && b.status !== 2 && <span className="text-info">Pending</span>}
                              </td>
                              <td>{b.dateTime}</td>
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
