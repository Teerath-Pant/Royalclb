import { useEffect, useState } from 'react'
import Pager from '../components/Pager'
import RefreshIcon from '../components/RefreshIcon'
import TableTools from '../components/TableTools'
import { humanDate } from '../lib/date'
import { notyf } from '../lib/notyf'
import { useAddUpi, useRemoveUpi, useSetUpiStatus, useUpis } from '../queries/payment-settings'

export default function Upi() {
  const [status, setStatus] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [modalOpen, setModalOpen] = useState(false)
  const [upiId, setUpiId] = useState('')

  const { data, refetch } = useUpis(status, search, page, limit)
  const add = useAddUpi()
  const setUpiStatus = useSetUpiStatus()
  const remove = useRemoveUpi()

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 400)
    return () => clearTimeout(timeout)
  }, [searchInput])

  useEffect(() => {
    document.body.classList.toggle('modal-open', modalOpen)
    return () => document.body.classList.remove('modal-open')
  }, [modalOpen])

  const clear = () => setUpiId('')
  const closeModal = () => {
    clear()
    setModalOpen(false)
  }

  const submit = () => {
    setModalOpen(false)
    if (!upiId) return notyf.error('UPI ID is required.')
    add.mutate(upiId, { onSuccess: clear })
  }

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
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value.trim())
                    setPage(1)
                  }}
                >
                  <option value="">All</option>
                  <option value="ENABLE">Enable</option>
                  <option value="DISABLE">Disable</option>
                </select>
              </div>
            </form>
            <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
              Add UPI
            </button>
          </div>
        </div>
      </div>

      <div className="col-sm-12">
        <div className="iq-card">
          <div className="iq-card-header d-flex justify-content-between">
            <div className="iq-header-title">
              <h4 className="card-title">
                UPI's
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
                    <table id="data-table" className="table table-striped table-bordered dataTable no-footer">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>UPI ID</th>
                          <th>Views</th>
                          <th>Status</th>
                          <th>Added At</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.data.map((u, i) => {
                          const isEnable = u.status === 'ENABLE'

                          return (
                            <tr key={u.id}>
                              <td>{(page - 1) * limit + i + 1}</td>
                              <td>{u.upiId}</td>
                              <td>{u.views}</td>
                              <td>
                                {u.status === 'ENABLE' && <span className="badge bg-success">{u.status}</span>}
                                {u.status === 'DISABLE' && <span className="badge bg-danger">{u.status}</span>}
                              </td>
                              <td>{humanDate(u.createdAt)}</td>
                              <td>
                                <form onSubmit={(e) => e.preventDefault()}>
                                  <div style={{ display: 'flex', gap: 10, marginTop: '.5rem' }}>
                                    <button
                                      type="button"
                                      className={`btn btn-${isEnable ? 'danger' : 'success'}`}
                                      onClick={() => setUpiStatus.mutate({ id: u.id, status: isEnable ? 'DISABLE' : 'ENABLE' })}
                                    >
                                      {isEnable ? 'DISABLE' : 'ENABLE'}
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={() => remove.mutate(u.id)}>
                                      REMOVE
                                    </button>
                                  </div>
                                </form>
                              </td>
                            </tr>
                          )
                        })}
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

      {modalOpen && (
        <>
          <div className="modal fade show" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Modal title</h5>
                  <button type="button" className="close" aria-label="Close" onClick={closeModal}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="upi-id">UPI ID</label>
                    <input
                      type="text"
                      className="form-control"
                      id="upi-id"
                      placeholder="Enter UPI Id"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                  <button type="button" className="btn btn-primary" onClick={submit}>
                    Add
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
