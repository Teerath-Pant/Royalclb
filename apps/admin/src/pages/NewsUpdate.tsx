import { useEffect, useState } from 'react'
import Pager from '../components/Pager'
import TableTools from '../components/TableTools'
import { useAddNews, useDeleteNews, useNews } from '../queries/app-banner'

export default function NewsUpdate() {
  const [modalOpen, setModalOpen] = useState(false)
  const [news, setNews] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { data } = useNews()
  const add = useAddNews()
  const remove = useDeleteNews()

  useEffect(() => {
    document.body.classList.toggle('modal-open', modalOpen)
    return () => document.body.classList.remove('modal-open')
  }, [modalOpen])

  const items = data ?? []
  const visible = items.slice((page - 1) * limit, page * limit)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    add.mutate(news, {
      onSuccess: () => {
        setNews('')
        setModalOpen(false)
      },
    })
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="iq-card">
              <div className="iq-card-header d-flex justify-content-between">
                <div className="iq-header-title">
                  <h4 className="card-title">Member Notice</h4>
                </div>
                <a
                  href="#"
                  className="btn btn-success btn_bg float-right"
                  style={items.length > 0 ? { display: 'none' } : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    setModalOpen(true)
                  }}
                >
                  Add News
                </a>
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
                              <th>Notice</th>
                              <th>Add Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {visible.map((n, i) => (
                              <tr key={n.id}>
                                <td>{(page - 1) * limit + i + 1}</td>
                                <td>{n.news}</td>
                                <td>
                                  <i className="fa fa-clock"></i> {n.addDate}
                                </td>
                                <td>
                                  <a
                                    href="#"
                                    className="btn btn-danger btn-xs"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      if (confirm('Are you sure to Delete this News?')) remove.mutate(n.id)
                                    }}
                                  >
                                    Delete
                                  </a>
                                </td>
                              </tr>
                            ))}
                            {items.length === 0 && (
                              <tr className="odd">
                                <td valign="top" colSpan={4} className="dataTables_empty">
                                  No data available in table
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <Pager total={items.length} page={page} perPage={limit} onPage={setPage} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <>
          <div className="modal fade show" tabIndex={-1} style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Add News : </h4>
                  <button type="button" className="close" aria-label="Close" onClick={() => setModalOpen(false)}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <form onSubmit={submit} onReset={() => setNews('')}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label className="control-label" htmlFor="news">
                        News
                      </label>
                      <textarea
                        className="form-control"
                        name="news"
                        placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in venenatis enim"
                        required
                        value={news}
                        onChange={(e) => setNews(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <input type="submit" name="addNews" className="btn btn-success" value="Submit" disabled={add.isPending} />
                    <input type="reset" className="btn btn-danger" value="Reset" />
                    <button type="button" className="btn btn-primary" onClick={() => setModalOpen(false)}>
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  )
}
