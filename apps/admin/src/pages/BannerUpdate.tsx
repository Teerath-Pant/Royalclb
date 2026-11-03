import { useEffect, useState } from 'react'
import Pager from '../components/Pager'
import TableTools from '../components/TableTools'
import { useAddBanner, useBanners, useDeleteBanner } from '../queries/app-banner'

const legacyUrl = import.meta.env.VITE_LEGACY_URL ?? ''

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

export default function BannerUpdate() {
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { data } = useBanners()
  const add = useAddBanner()
  const remove = useDeleteBanner()

  useEffect(() => {
    document.body.classList.toggle('modal-open', modalOpen)
    return () => document.body.classList.remove('modal-open')
  }, [modalOpen])

  const banners = data ?? []
  const visible = banners.slice((page - 1) * limit, page * limit)

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const file = new FormData(e.currentTarget).get('paymentImage') as File
    const image = await toBase64(file)
    add.mutate({ fileName: file.name, image }, { onSuccess: () => setModalOpen(false) })
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="iq-card">
              <div className="iq-card-header d-flex justify-content-between">
                <div className="iq-header-title">
                  <h4 className="card-title">App Banner Update</h4>
                </div>
                <a
                  className="btn btn-success"
                  href="#"
                  style={{ float: 'right' }}
                  onClick={(e) => {
                    e.preventDefault()
                    setModalOpen(true)
                  }}
                >
                  <i className="fa fa-plus"></i> Add New Banner
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
                              <th>Banner</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {visible.map((b, i) => (
                              <tr key={b.id}>
                                <td>{(page - 1) * limit + i + 1}</td>
                                <td>
                                  <img src={`${legacyUrl}/${b.image}`} height="150px" width="250px" />
                                </td>
                                <td>
                                  <a
                                    href="#"
                                    className="btn btn-danger btn-xs"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      if (confirm('Are you sure to Delete this Bannner?')) remove.mutate(b.id)
                                    }}
                                  >
                                    {' '}
                                    Delete{' '}
                                  </a>
                                </td>
                              </tr>
                            ))}
                            {banners.length === 0 && (
                              <tr className="odd">
                                <td valign="top" colSpan={3} className="dataTables_empty">
                                  No data available in table
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <Pager total={banners.length} page={page} perPage={limit} onPage={setPage} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <>
          <div className="modal fade show" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Update Banner </h4>
                  <button type="button" className="close" onClick={() => setModalOpen(false)}>
                    ×
                  </button>
                </div>
                <form onSubmit={submit}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label className="control-label">Update Banner </label>
                      <input
                        className="form-control"
                        name="paymentImage"
                        type="file"
                        required
                        accept=".jpg, .JPG, .png, .PNG, .jpeg, .JPEG, .gif, .GIF"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <input type="submit" className="btn btn-primary" name="addPaymentMode" value="Add Banner" disabled={add.isPending} />
                    <button type="button" className="btn btn-danger" onClick={() => setModalOpen(false)}>
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
