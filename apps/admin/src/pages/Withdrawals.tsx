import { Fragment, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Pager from '../components/Pager'
import RefreshIcon from '../components/RefreshIcon'
import TableTools from '../components/TableTools'
import { humanDate } from '../lib/date'
import { notyf } from '../lib/notyf'
import { useApproveWithdrawal, useRejectWithdrawal, useWithdrawals, type Withdrawal } from '../queries/withdrawals'

function Destination({ value }: { value: string | null }) {
  if (!value) return <>-</>

  try {
    const parsed = JSON.parse(value) as Record<string, unknown>
    return (
      <>
        {Object.entries(parsed).map(([k, v], i) => (
          <Fragment key={k}>
            {i > 0 && <br />}
            <small>
              <strong>{k}:</strong> {String(v)}
            </small>
          </Fragment>
        ))}
      </>
    )
  } catch {
    return <small>{value}</small>
  }
}

function Actions({ withdrawal }: { withdrawal: Withdrawal }) {
  const approve = useApproveWithdrawal()
  const reject = useRejectWithdrawal()
  const [inputVal, setInputVal] = useState('')

  if (withdrawal.status !== 'PENDING') {
    if (withdrawal.status === 'APPROVED' && withdrawal.transactionRef) {
      return <small className="text-success">Ref: {withdrawal.transactionRef}</small>
    }
    if (withdrawal.status === 'REJECTED' && withdrawal.rejectionReason) {
      return <small className="text-danger">Reason: {withdrawal.rejectionReason}</small>
    }
    return <span className="text-muted">Completed</span>
  }

  const onApprove = () => {
    const transactionRef = inputVal.trim()
    if (!transactionRef) return notyf.error('Transaction Reference is required for approval.')
    approve.mutate({ id: withdrawal.id, transactionRef })
  }

  const onReject = () => {
    const rejectionReason = inputVal.trim()
    if (!rejectionReason) return notyf.error('Rejection Reason is required for rejection.')
    reject.mutate({ id: withdrawal.id, rejectionReason })
  }

  return (
    <form style={{ minWidth: 180 }} onSubmit={(e) => e.preventDefault()}>
      <input
        name="inputVal"
        type="text"
        className="form-control form-control-sm mb-1"
        placeholder="Ref No / Reason"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
      />
      <div style={{ display: 'flex', gap: 5 }}>
        <button type="button" className="btn btn-primary btn-sm" onClick={onApprove}>
          Approve
        </button>
        <button type="button" className="btn btn-danger btn-sm" onClick={onReject}>
          Reject
        </button>
      </div>
    </form>
  )
}

export default function Withdrawals() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState(searchParams.get('status') ?? '')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { data, refetch } = useWithdrawals(status, page, limit)

  return (
    <div className="container-fluid">
      <div className="col-sm-12">
        <div className="iq-card">
          <div className="iq-card-header d-flex justify-content-between" style={{ alignItems: 'center' }}>
            <form
              className="text-center"
              style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}
              id="settings-form"
            >
              <div className="form-group">
                <label htmlFor="status">Filter Status</label>
                <select
                  name="status"
                  id="status"
                  className="form-control"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value.trim())
                    setPage(1)
                  }}
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
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
                Withdrawal Requests
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
                />
                <div className="row">
                  <div className="col-sm-12">
                    <table id="withdrawals-table" className="table table-striped table-bordered dataTable no-footer">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>User</th>
                          <th>Method</th>
                          <th>Currency</th>
                          <th>Original Amount</th>
                          <th>Amount</th>
                          <th>Charge</th>
                          <th>Net Amount</th>
                          <th>Destination</th>
                          <th>Requested At</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.data.map((w, i) => (
                          <tr key={w.id}>
                            <td>{(page - 1) * limit + i + 1}</td>
                            <td>
                              <div>
                                <strong>{w.meddolic_user_details?.name || 'N/A'}</strong>
                                <br />
                                <small className="text-muted">ID: {w.userId}</small>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-info">{w.type}</span>
                            </td>
                            <td>{w.currency}</td>
                            <td>{w.originalAmount}</td>
                            <td>{w.amount}</td>
                            <td>{w.charge}</td>
                            <td>
                              <strong>₹{w.netAmount}</strong>
                            </td>
                            <td>
                              <Destination value={w.destinationSnapshot} />
                            </td>
                            <td>{humanDate(w.requestedAt)}</td>
                            <td>
                              {w.status === 'PENDING' && <span className="badge badge-warning">{w.status}</span>}
                              {w.status === 'APPROVED' && <span className="badge badge-success">{w.status}</span>}
                              {w.status === 'REJECTED' && <span className="badge badge-danger">{w.status}</span>}
                              {!['PENDING', 'APPROVED', 'REJECTED'].includes(w.status) && (
                                <span className="badge badge-light">{w.status}</span>
                              )}
                            </td>
                            <td>
                              <Actions withdrawal={w} />
                            </td>
                          </tr>
                        ))}
                        {data?.data.length === 0 && (
                          <tr className="odd">
                            <td valign="top" colSpan={12} className="dataTables_empty">
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
