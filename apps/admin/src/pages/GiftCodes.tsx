import { useEffect, useState } from 'react'
import Pager from '../components/Pager'
import RefreshIcon from '../components/RefreshIcon'
import TableTools from '../components/TableTools'
import { humanDate } from '../lib/date'
import { notyf } from '../lib/notyf'
import { useCreateGiftCode, useDeleteGiftCode, useGiftCodes } from '../queries/gift-codes'

const emptyForm = { code: '', amount: '', maxClaims: '' }

export default function GiftCodes() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const { data, refetch } = useGiftCodes(status, page, limit)
  const create = useCreateGiftCode()
  const remove = useDeleteGiftCode()

  useEffect(() => {
    document.body.classList.toggle('modal-open', modalOpen)
    return () => document.body.classList.remove('modal-open')
  }, [modalOpen])

  const clearForm = () => setForm(emptyForm)
  const closeModal = () => {
    clearForm()
    setModalOpen(false)
  }

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setForm({ ...form, code })
  }

  const submit = () => {
    if (!form.code || form.code.length < 4) return notyf.error('Code must be at least 4 characters.')
    if (!form.amount || parseFloat(form.amount) <= 0) return notyf.error('Amount must be a positive number.')
    if (!form.maxClaims || parseInt(form.maxClaims) < 1) return notyf.error('Max claims must be at least 1.')

    create.mutate(
      { code: form.code, amount: parseFloat(form.amount), maxClaims: parseInt(form.maxClaims) },
      { onSuccess: closeModal },
    )
  }

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
                <label htmlFor="status">Choose Status</label>
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
                  <option value="">All</option>
                  <option value="ACTIVE">Active</option>
                  <option value="EXPIRED">Expired</option>
                  <option value="DEPLETED">Depleted</option>
                </select>
              </div>
            </form>
            <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
              + Create Gift Code
            </button>
          </div>
        </div>
      </div>

      <div className="col-sm-12">
        <div className="iq-card">
          <div className="iq-card-header d-flex justify-content-between">
            <div className="iq-header-title">
              <h4 className="card-title">
                Gift Codes
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
                    <table id="gift-codes-table" className="table table-striped table-bordered dataTable no-footer">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Code</th>
                          <th>Amount</th>
                          <th>Max Claims</th>
                          <th>Claimed</th>
                          <th>Expires At</th>
                          <th>Status</th>
                          <th>Created At</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.items.map((g, i) => {
                          const pct = g.maxClaims > 0 ? Math.round((g.claimedCount / g.maxClaims) * 100) : 0

                          return (
                            <tr key={g.id}>
                              <td>{(page - 1) * limit + i + 1}</td>
                              <td>
                                <strong>{g.code}</strong>
                              </td>
                              <td>{g.amount}</td>
                              <td>{g.maxClaims}</td>
                              <td>
                                {g.claimedCount} / {g.maxClaims} <small className="text-muted">({pct}%)</small>
                              </td>
                              <td>{humanDate(g.expiresAt)}</td>
                              <td>
                                {g.status === 'ACTIVE' && <span className="badge badge-success">{g.status}</span>}
                                {g.status === 'EXPIRED' && <span className="badge badge-warning">{g.status}</span>}
                                {g.status === 'DEPLETED' && <span className="badge badge-secondary">{g.status}</span>}
                                {!['ACTIVE', 'EXPIRED', 'DEPLETED'].includes(g.status) && (
                                  <span className="badge badge-light">{g.status}</span>
                                )}
                              </td>
                              <td>{humanDate(g.createdAt)}</td>
                              <td>
                                {g.claimedCount > 0 ? (
                                  <span className="text-muted">Cannot delete (claimed)</span>
                                ) : (
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() =>
                                      confirm('Are you sure you want to delete this gift code?') && remove.mutate(g.id)
                                    }
                                  >
                                    Delete
                                  </button>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                        {data?.items.length === 0 && (
                          <tr className="odd">
                            <td valign="top" colSpan={9} className="dataTables_empty">
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

      {modalOpen && (
        <>
          <div className="modal fade show" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create Gift Code</h5>
                  <button type="button" className="close" aria-label="Close" onClick={closeModal}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="gc-code">
                      Code <small className="text-muted">(4-64 chars, auto uppercased)</small>
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        id="gc-code"
                        placeholder="e.g. WELCOME100"
                        value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value })}
                      />
                      <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={generateCode} title="Generate random code">
                          &#x2684; Generate
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="gc-amount">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      className="form-control"
                      id="gc-amount"
                      placeholder="e.g. 50.00"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gc-maxClaims">Max Claims</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      className="form-control"
                      id="gc-maxClaims"
                      placeholder="e.g. 100"
                      value={form.maxClaims}
                      onChange={(e) => setForm({ ...form, maxClaims: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={submit} disabled={create.isPending}>
                    {create.isPending ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  )
}
