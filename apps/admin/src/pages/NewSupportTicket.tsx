import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Pager from '../components/Pager'
import TableTools from '../components/TableTools'
import {
  attachmentUrl,
  useSupportSubjects,
  useSupportTickets,
  useUpdateSupportTicket,
  type SupportTicket,
} from '../queries/support'

function RemarkModal({ ticket, onClose }: { ticket: SupportTicket; onClose: () => void }) {
  const { data: subjects } = useSupportSubjects()
  const update = useUpdateSupportTicket()
  const [subjectId, setSubjectId] = useState(String(ticket.subjectId))
  const [ticketStatus, setTicketStatus] = useState(String(ticket.ticketStatus))

  return (
    <>
      <div className="modal fade show" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: '#5d9cec' }}>
                <h4 className="modal-title" style={{ color: '#ffffff' }}>
                  Ticket Remark-: {ticket.ticketCode}
                </h4>
                <button type="button" className="close" onClick={onClose}>
                  x
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  update.mutate(
                    { ticketId: ticket.ticketId, subjectId: Number(subjectId), ticketStatus: Number(ticketStatus) },
                    { onSuccess: onClose },
                  )
                }}
              >
                <div className="modal-body">
                  <div className="form-group">
                    <label className="control-label">Change Subject :</label>
                    <select
                      className="form-control"
                      required
                      id="subjectId"
                      name="subjectId"
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                    >
                      <option value=""> Select One </option>
                      {subjects?.map((s) => (
                        <option key={s.subjectId} value={s.subjectId}>
                          {' '}
                          {s.subjectName}{' '}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="control-label">Change Status :</label>
                    <select
                      className="form-control"
                      required
                      id="ticketStatus"
                      name="ticketStatus"
                      value={ticketStatus}
                      onChange={(e) => setTicketStatus(e.target.value)}
                    >
                      <option value=""> Select One </option>
                      <option value="1"> Open </option>
                      <option value="2"> Processing </option>
                      <option value="3"> Completed </option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="control-label">User Message :</label>
                    <textarea className="form-control" readOnly value={ticket.ticketMessage ?? ''} />
                  </div>
                </div>
                <div className="modal-footer" style={{ backgroundColor: '#ff902bb5' }}>
                  <input type="submit" name="ticketUpdate" className="btn btn-success" value="Update Ticket" disabled={update.isPending} />
                  <button type="button" className="btn btn-danger" onClick={onClose}>
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  )
}

export default function NewSupportTicket() {
  const [params, setParams] = useSearchParams()
  const hasParams = params.size > 0
  const subjectId = params.get('subjectId') ?? ''
  const ticketStatus = hasParams ? (params.get('ticketStatus') ?? '') : '1'
  const subjectRef = useRef<HTMLSelectElement>(null)
  const statusRef = useRef<HTMLSelectElement>(null)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [remarkTicket, setRemarkTicket] = useState<SupportTicket | null>(null)
  const query = hasParams ? params.toString() : 'ticketStatus=1'
  const { data } = useSupportTickets(query, page, limit)
  const { data: subjects } = useSupportSubjects()

  useEffect(() => {
    document.body.classList.toggle('modal-open', remarkTicket !== null)
    return () => document.body.classList.remove('modal-open')
  }, [remarkTicket])

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 ">
            <div className="iq-card">
              <div className="iq-card-header d-flex justify-content-between"></div>
              <div className="iq-card-body">
                <form
                  key={`${params.toString()}-${subjects?.length}`}
                  onSubmit={(e) => {
                    e.preventDefault()
                    setParams({
                      subjectId: subjectRef.current?.value ?? '',
                      ticketStatus: statusRef.current?.value ?? '',
                    })
                    setPage(1)
                  }}
                >
                  <div className="form-row">
                    <div className="col-3">
                      <select ref={subjectRef} className="form-control" name="subjectId" defaultValue={subjectId}>
                        <option value=""> Select One </option>
                        {subjects?.map((s) => (
                          <option key={s.subjectId} value={s.subjectId}>
                            {' '}
                            {s.subjectName}{' '}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-3">
                      <select ref={statusRef} className="form-control" name="ticketStatus" defaultValue={ticketStatus}>
                        <option value=""> Select One </option>
                        <option value="1"> Open </option>
                        <option value="2"> Processing </option>
                      </select>
                    </div>
                    <div className="col-3">
                      <input className="btn btn-primary" type="submit" value="Search" />
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
                  <h4 className="card-title">New Support Tickets</h4>
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
                        <table id="example" className="table table-striped table-bordered dataTable no-footer">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>UserId</th>
                              <th>Name</th>
                              <th>TicketNo</th>
                              <th>Subject</th>
                              <th>Message</th>
                              <th>Support Img</th>
                              <th>Raise Date</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data?.data.map((t) => (
                              <tr key={t.ticketId}>
                                <td>{t.index}</td>
                                <td>{t.userId}</td>
                                <td>{t.name}</td>
                                <td>{t.ticketCode}</td>
                                <td>{t.subjectName}</td>
                                <td>{t.ticketMessage}</td>
                                <td>
                                  {t.hasAttachment && (
                                    <a href={attachmentUrl(t.ticketId)} target="_blank">
                                      <img src={attachmentUrl(t.ticketId)} height="150px" width="150px" />
                                    </a>
                                  )}
                                </td>
                                <td>
                                  <i className="fa fa-clock-o"></i> {t.raiseDate}
                                </td>
                                <td>
                                  {t.ticketStatus === 1 && <span className="badge badge-primary">OPEN</span>}
                                  {t.ticketStatus === 2 && <span className="badge badge-warning">PROCESSING</span>}
                                  {t.ticketStatus === 3 && <span className="badge badge-success">RESOLVED</span>}
                                </td>
                                <td>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      setRemarkTicket(t)
                                    }}
                                  >
                                    <span className="badge badge-success">Remark</span>
                                  </a>
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
      </div>

      {remarkTicket && <RemarkModal key={remarkTicket.ticketId} ticket={remarkTicket} onClose={() => setRemarkTicket(null)} />}
    </>
  )
}
