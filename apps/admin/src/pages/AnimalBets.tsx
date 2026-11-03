import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Pager from '../components/Pager'
import RefreshIcon from '../components/RefreshIcon'
import TableTools from '../components/TableTools'
import { useDatepicker } from '../lib/datepicker'
import { humanDate } from '../lib/date'
import { useAnimalBets } from '../queries/animal'

const money = (value: string | number) => Number(value).toFixed(2)

export default function AnimalBets() {
  const [params] = useSearchParams()
  const gameId = params.get('id') ?? ''
  const fromRef = useRef<HTMLInputElement>(null)
  const toRef = useRef<HTMLInputElement>(null)
  useDatepicker(fromRef)
  useDatepicker(toRef)

  const [searchInput, setSearchInput] = useState('')
  const [filters, setFilters] = useState({ search: '', fromDate: '', toDate: '' })
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data, refetch } = useAnimalBets(gameId, { page, limit, ...filters })

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchInput.trim() }))
      setPage(1)
    }, 400)
    return () => clearTimeout(timeout)
  }, [searchInput])

  return (
    <div className="container-fluid">
      <div className="col-sm-12">
        <div className="iq-card">
          <div className="iq-card-body">
            <form
              id="date-form"
              onSubmit={(e) => {
                e.preventDefault()
                setFilters((f) => ({ ...f, fromDate: fromRef.current?.value ?? '', toDate: toRef.current?.value ?? '' }))
                setPage(1)
              }}
              onReset={(e) => {
                e.preventDefault()
                if (fromRef.current) fromRef.current.value = ''
                if (toRef.current) toRef.current.value = ''
                setFilters((f) => ({ ...f, fromDate: '', toDate: '' }))
                setPage(1)
              }}
            >
              <div className="form-row">
                <div className="col-3">
                  <input ref={fromRef} type="text" name="from_date" id="from_date" className="form-control " placeholder="e.g. From Date" readOnly />
                </div>
                <div className="col-3">
                  <input ref={toRef} type="text" name="to_date" id="to_date" className="form-control " placeholder="e.g. To Date" readOnly />
                </div>
                <div className="col-1">
                  <input className="btn btn-danger" style={{ height: '100%', width: '100%' }} type="reset" value="Reset" />
                </div>
                <div className="col-1">
                  <input className="btn btn-primary" style={{ height: '100%', width: '100%' }} type="submit" value="Search" />
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
              <h4 className="card-title">
                Win Go Bet History
                <button className="btn" id="refresh-btn" onClick={() => refetch()}>
                  <RefreshIcon />
                </button>
              </h4>
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
                  search={searchInput}
                  onSearch={setSearchInput}
                />
                <div className="row">
                  <div className="col-sm-12">
                    <table id="gameHistoryTable" className="table table-striped table-bordered dataTable no-footer">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>User Id</th>
                          <th>Name</th>
                          <th>Bet On</th>
                          <th>Total Wallet</th>
                          <th>Bet Amount</th>
                          <th>Winning Amount</th>
                          <th>Charge</th>
                          <th>Net Win Amount</th>
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
                            <td>{b.betOn}</td>
                            <td>{b.totalWallet}</td>
                            <td>
                              <span className="text-orange">{money(b.betAmount)}</span>
                            </td>
                            <td>
                              <span className="text-green-light">{money(b.winAmount)}</span>
                            </td>
                            <td>
                              <span className="text-red">{money(b.charge)}</span>
                            </td>
                            <td>
                              <span className="text-green-dark">{money(b.netWinAmount)}</span>
                            </td>
                            <td>
                              {b.status === 'WIN' && <span className="text-success">Win</span>}
                              {b.status === 'LOSE' && <span className="text-danger">Lose</span>}
                              {b.status !== 'WIN' && b.status !== 'LOSE' && <span className="text-primary">Pending</span>}
                            </td>
                            <td>{humanDate(b.dateTime)}</td>
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
  )
}
