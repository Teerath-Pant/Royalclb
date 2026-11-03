import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Pager from '../components/Pager'
import TableTools from '../components/TableTools'
import { useDatepicker } from '../lib/datepicker'
import { useOnlineDeposits } from '../queries/fund'

const today = () => new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' }).replaceAll('/', '-')

const ucfirst = (value: string) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()

export default function FundDepositHistory() {
  const [params, setParams] = useSearchParams()
  const withdrawStatus = params.get('withdrawStatus') ?? ''
  const fromDate = params.get('from_date') || today()
  const toDate = params.get('to_date') || today()
  const statusRef = useRef<HTMLSelectElement>(null)
  const fromRef = useRef<HTMLInputElement>(null)
  const toRef = useRef<HTMLInputElement>(null)
  useDatepicker(fromRef)
  useDatepicker(toRef)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { data } = useOnlineDeposits(withdrawStatus, fromDate, toDate, page, limit)

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <div className="iq-card">
            <div className="iq-card-header d-flex justify-content-between">
              <div className="iq-header-title">
                <h4 className="card-title">Online Deposit History</h4>
              </div>
            </div>
            <div className="iq-card-body">
              <form
                key={params.toString()}
                onSubmit={(e) => {
                  e.preventDefault()
                  setParams({
                    withdrawStatus: statusRef.current?.value ?? '',
                    from_date: fromRef.current?.value ?? '',
                    to_date: toRef.current?.value ?? '',
                  })
                  setPage(1)
                }}
              >
                <div className="form-row">
                  <div className="col-2">
                    <select ref={statusRef} className="form-control" name="withdrawStatus" defaultValue="">
                      <option value=""> Select One </option>
                      <option value="0"> Pending </option>
                      <option value="1"> Success </option>
                      <option value="2"> Failed </option>
                    </select>
                  </div>
                  <div className="col-2">
                    <input
                      ref={fromRef}
                      type="text"
                      name="from_date"
                      id="from_date"
                      className="form-control"
                      placeholder="e.g. From Date"
                      required
                      defaultValue={fromDate}
                      readOnly
                    />
                  </div>
                  <div className="col-2">
                    <input
                      ref={toRef}
                      type="text"
                      name="to_date"
                      id="to_date"
                      className="form-control"
                      placeholder="e.g. To Date"
                      required
                      defaultValue={toDate}
                      readOnly
                    />
                  </div>
                  <div className="col-2">
                    <input className="btn btn-primary" type="submit" value="Search" />
                  </div>
                </div>
              </form>
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
                      <table id="example" className="table table-striped table-bordered dataTable no-footer" style={{ fontSize: 13 }}>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>UserId</th>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Curruncy</th>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.data.map((d) => (
                            <tr key={d.id}>
                              <td>{d.index}</td>
                              <td>{d.username}</td>
                              <td>{d.name}</td>
                              <td> {d.amount} </td>
                              <td>USDT</td>
                              <td>{d.createdAt}</td>
                              <td>{ucfirst(d.status)}</td>
                            </tr>
                          ))}
                          {data?.data.length === 0 && (
                            <tr className="odd">
                              <td valign="top" colSpan={7} className="dataTables_empty">
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
