import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Pager from '../components/Pager'
import RefreshIcon from '../components/RefreshIcon'
import TableTools from '../components/TableTools'
import { useDatepicker } from '../lib/datepicker'
import { humanDate } from '../lib/date'
import { useRechargeResponse, useRecharges, type Recharge } from '../queries/fund'

function Actions({ recharge }: { recharge: Recharge }) {
  const respond = useRechargeResponse()
  const [remark, setRemark] = useState('')

  if (recharge.status !== 'PENDING') return <span className="text-muted">No action</span>

  const send = (response: string) => respond.mutate({ id: recharge.id, remark, response })

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input
        name="remark"
        type="text"
        required
        className="form-control"
        placeholder="Remarks.."
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
      />
      <div style={{ display: 'flex', gap: 10, marginTop: '.5rem' }}>
        <button type="button" className="btn btn-danger" onClick={() => send('REJECTED')}>
          Reject
        </button>
        <button type="button" className="btn btn-primary" onClick={() => send('APPROVED')}>
          Approve
        </button>
      </div>
    </form>
  )
}

export default function Recharges() {
  const [searchParams] = useSearchParams()
  const initialStatus = searchParams.get('status') ?? ''

  const fromRef = useRef<HTMLInputElement>(null)
  const toRef = useRef<HTMLInputElement>(null)
  useDatepicker(fromRef)
  useDatepicker(toRef)

  const [searchInput, setSearchInput] = useState('')
  const [filters, setFilters] = useState({ search: '', fromDate: '', toDate: '', status: initialStatus })
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data, refetch } = useRecharges({ page, limit, ...filters })

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
          <div className="iq-card-header d-flex justify-content-between">
            <form
              className="text-center"
              style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}
              id="settings-form"
            >
              <div className="form-group">
                <label htmlFor="status">Choose Status</label>
                <select
                  name="status"
                  id="status"
                  className="form-control"
                  required
                  value={filters.status}
                  onChange={(e) => {
                    setFilters((f) => ({ ...f, status: e.target.value.trim() }))
                    setPage(1)
                  }}
                >
                  <option value="">All</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
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
          <div className="iq-card-header d-flex justify-content-between">
            <div className="iq-header-title">
              <h4 className="card-title">
                Recharge History
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
                          <th>Amount</th>
                          <th>UTR No.</th>
                          <th>Type</th>
                          <th>Remark</th>
                          <th>Date Time</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.data.map((r, i) => (
                          <tr key={r.id}>
                            <td>{(page - 1) * limit + i + 1}</td>
                            <td>{r.uid}</td>
                            <td>{r.name}</td>
                            <td>{r.amount}</td>
                            <td>{r.utrNo}</td>
                            <td>{r.type}</td>
                            <td>{r.remark}</td>
                            <td>{humanDate(r.createdAt)}</td>
                            <td>
                              {r.status === 'PENDING' && <span className="badge badge-primary">{r.status}</span>}
                              {r.status === 'APPROVED' && <span className="badge badge-success">{r.status}</span>}
                              {r.status === 'REJECTED' && <span className="badge badge-danger">{r.status}</span>}
                            </td>
                            <td>
                              <Actions recharge={r} />
                            </td>
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
  )
}
