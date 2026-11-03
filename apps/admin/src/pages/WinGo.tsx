import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import Pager from '../components/Pager'
import RefreshIcon from '../components/RefreshIcon'
import TableTools from '../components/TableTools'
import { useDatepicker } from '../lib/datepicker'
import { humanDate } from '../lib/date'
import { useSetWinGoMode, useWinGoHistory, useWinGoMode } from '../queries/win-go'

const modes = [
  { value: 'random', label: 'Random' },
  { value: 'least', label: 'Least Bet' },
  ...Array.from({ length: 10 }, (_, i) => ({ value: String(i), label: String(i) })),
]

export default function WinGo() {
  const [params] = useSearchParams()
  const interval = Number(params.get('interval') ?? 0.5)
  const qc = useQueryClient()
  const fromRef = useRef<HTMLInputElement>(null)
  const toRef = useRef<HTMLInputElement>(null)
  useDatepicker(fromRef)
  useDatepicker(toRef)

  const [searchInput, setSearchInput] = useState('')
  const [filters, setFilters] = useState({ search: '', fromDate: '', toDate: '' })
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [period, setPeriod] = useState('-')
  const [timer, setTimer] = useState('00:00')

  const { data: modeData } = useWinGoMode(interval)
  const setMode = useSetWinGoMode(interval)
  const { data, refetch } = useWinGoHistory(interval, { page, limit, ...filters })

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchInput.trim() }))
      setPage(1)
    }, 400)
    return () => clearTimeout(timeout)
  }, [searchInput])

  useEffect(() => {
    const socket = io('/win-go', { path: '/api/socket.io' })
    let lastPeriod: string | null = null

    socket.on('connect', () => socket.emit('join-room', interval))
    socket.on(
      `game_win_go_${interval}`,
      (game: { period: string; timerMin: number; timerSec: number; gameStatus: string }) => {
        setPeriod(game.period)
        setTimer(`${String(game.timerMin).padStart(2, '0')}:${String(game.timerSec).padStart(2, '0')}`)

        if (game.gameStatus === 'betting' && game.period !== lastPeriod) {
          if (lastPeriod !== null) qc.invalidateQueries({ queryKey: ['admin-win-go-history'] })
          lastPeriod = game.period
        }
      },
    )

    return () => {
      socket.disconnect()
    }
  }, [interval, qc])

  return (
    <div className="container-fluid">
      <div className="col-sm-12">
        <div className="iq-card">
          <div className="iq-card-header d-flex justify-content-between">
            <form
              className="text-center"
              style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}
              id="settings-form"
            >
              <div className="form-group">
                <label htmlFor="winning_mode">Choose Winner</label>
                <select
                  key={modeData?.mode}
                  defaultValue={modeData?.mode ?? ''}
                  onChange={(e) => setMode.mutate(e.target.value.trim())}
                  name="winning_mode"
                  id="winning_mode"
                  className="form-control"
                  required
                >
                  {modes.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>

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
                <div className="col-md-3 col-6 mb-2">
                  <input ref={fromRef} type="text" name="from_date" id="from_date" className="form-control " placeholder="e.g. From Date" readOnly />
                </div>
                <div className="col-md-3 col-6 mb-2">
                  <input ref={toRef} type="text" name="to_date" id="to_date" className="form-control " placeholder="e.g. To Date" readOnly />
                </div>
                <div className="col-md-1 col-6 mb-2">
                  <input className="btn btn-danger" style={{ height: '100%', width: '100%' }} type="reset" value="Reset" />
                </div>
                <div className="col-md-1 col-6 mb-2">
                  <input className="btn btn-primary" style={{ height: '100%', width: '100%' }} type="submit" value="Search" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="col-sm-12">
        <div className="iq-card">
          <div className="iq-card-header d-flex justify-content-between align-items-center flex-wrap">
            <div className="iq-header-title">
              <h4 className="card-title">
                Win Go History {interval < 1 ? `(${interval * 60} Sec)` : `(${interval} Min)`}
                <button className="btn" id="refresh-btn" onClick={() => refetch()}>
                  <RefreshIcon />
                </button>
              </h4>
            </div>
            <div className="d-flex" style={{ gap: '1.5rem' }}>
              <div className="text-center">
                <div style={{ fontSize: '0.75rem', color: '#8a8a8a' }}>Active Period</div>
                <div id="active-period-id" style={{ fontWeight: 600 }}>
                  {period}
                </div>
              </div>
              <div className="text-center">
                <div style={{ fontSize: '0.75rem', color: '#8a8a8a' }}>Time Remaining</div>
                <div id="active-timer" style={{ fontWeight: 600, color: '#dc3545' }}>
                  {timer}
                </div>
              </div>
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
                          <th>Game Id</th>
                          <th>Date and Time</th>
                          <th>Users</th>
                          <th>Total Bet</th>
                          <th>Admin Profit</th>
                          <th>Winning Amount</th>
                          <th>User Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.data.map((g) => (
                          <tr key={g.id}>
                            <td>{g.index}</td>
                            <td>{g.period}</td>
                            <td>{humanDate(g.dateTime)}</td>
                            <td>
                              <Link to={`/winGoBets?id=${g.id}&interval=${interval}`}>{g.users}</Link>
                            </td>
                            <td>{g.totalBet}</td>
                            <td>{g.adminProfit}</td>
                            <td>{g.totalWinAmount}</td>
                            <td>{g.totalNetWinAmount}</td>
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
  )
}
