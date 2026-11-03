import Pager from '../components/Pager'
import TableTools from '../components/TableTools'
import { usePopup, useUpdatePopupImage, useUpdatePopupStatus } from '../queries/settings'

const legacyUrl = import.meta.env.VITE_LEGACY_URL ?? ''

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

export default function PopupUpdate() {
  const { data } = usePopup()
  const updateImage = useUpdatePopupImage()
  const updateStatus = useUpdatePopupStatus()

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const file = new FormData(e.currentTarget).get('dashboardImage') as File
    updateImage.mutate({ fileName: file.name, image: await toBase64(file) })
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <div className="iq-card">
            <div className="iq-card-header d-flex justify-content-between">
              <div className="iq-header-title">
                <h4 className="card-title">Popup Update</h4>
              </div>
            </div>
            <div className="iq-card-body">
              <div className="table-responsive">
                <div className="dataTables_wrapper dt-bootstrap4 no-footer">
                  <TableTools perPage={10} onPerPage={() => undefined} />
                  <div className="row">
                    <div className="col-sm-12">
                      <table id="example" className="table table-striped table-bordered dataTable no-footer">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Dashboard Notice</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data && (
                            <tr>
                              <td>1</td>
                              <td>
                                <form id="popup-form" onSubmit={submit}>
                                  <img src={`${legacyUrl}/${data.dashboardImage}`} className="img-responsive" height="100px" width="100px" />
                                  &nbsp;{' '}
                                  <input
                                    type="file"
                                    name="dashboardImage"
                                    className="form-control-file"
                                    required
                                    accept=".jpg, .JPG, .png, .PNG, .jpeg, .JPEG, .gif, .GIF"
                                  />
                                </form>
                              </td>
                              <td className="text-center">
                                <input
                                  type="submit"
                                  form="popup-form"
                                  className="btn btn-success"
                                  name="imageUpdate"
                                  value="Update"
                                  disabled={updateImage.isPending}
                                />{' '}
                                {data.imageStatus === 0 ? (
                                  <a
                                    href="#"
                                    className="btn btn-warning"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      updateStatus.mutate(1)
                                    }}
                                  >
                                    Show
                                  </a>
                                ) : (
                                  <a
                                    href="#"
                                    className="btn btn-danger"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      updateStatus.mutate(0)
                                    }}
                                  >
                                    Hide
                                  </a>
                                )}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <Pager total={data ? 1 : 0} page={1} perPage={10} onPage={() => undefined} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
