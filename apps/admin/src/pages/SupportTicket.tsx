import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Pager from '../components/Pager'
import TableTools from '../components/TableTools'
import { useSupportSubjects, useSupportTickets } from '../queries/support'

export default function SupportTicket() {
  const [params, setParams] = useSearchParams()
  const subjectId = params.get('subjectId') ?? ''
  const ticketStatus = params.get('ticketStatus') ?? ''
  const subjectRef = useRef<HTMLSelectElement>(null)
  const statusRef = useRef<HTMLSelectElement>(null)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { data } = useSupportTickets(params.toString(), page, limit)
  const { data: subjects } = useSupportSubjects()

  return (
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
                      <option value="3"> Completed </option>
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
                            <th>Raise Date</th>
                            <th>Resolve Date</th>
                            <th>Status</th>
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
                                <i className="fa fa-clock-o"></i> {t.raiseDate}
                              </td>
                              <td>
                                <i className="fa fa-clock-o"></i> {t.actionDate}
                              </td>
                              <td>
                                {t.ticketStatus === 1 && <span className="badge badge-primary">OPEN</span>}
                                {t.ticketStatus === 2 && <span className="badge badge-warning">PROCESSING</span>}
                                {t.ticketStatus === 3 && <span className="badge badge-success">COMPLETED</span>}
                              </td>
                            </tr>
                          ))}
                          {data?.data.length === 0 && (
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
      </div>
    </div>
  )
}
