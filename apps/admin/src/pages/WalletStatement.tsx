import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Pager from '../components/Pager'
import TableTools from '../components/TableTools'
import { useDatepicker } from '../lib/datepicker'
import { useWalletStatements } from '../queries/wallet'

const today = () => new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' }).replaceAll('/', '-')

export default function WalletStatement() {
  const [params, setParams] = useSearchParams()
  const hasParams = params.size > 0
  const userId = params.get('user_id') ?? ''
  const fromDate = hasParams ? (params.get('from_date') ?? '') : today()
  const toDate = hasParams ? (params.get('to_date') ?? '') : today()
  const userRef = useRef<HTMLInputElement>(null)
  const fromRef = useRef<HTMLInputElement>(null)
  const toRef = useRef<HTMLInputElement>(null)
  useDatepicker(fromRef)
  useDatepicker(toRef)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { data } = useWalletStatements(params.toString(), page, limit)

  useEffect(() => {
    if (data?.invalidUserId) alert('Invalid User Id')
  }, [data])

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12 ">
          <div className="iq-card">
            <div className="iq-card-header d-flex justify-content-between"></div>
            <div className="iq-card-body">
              <form
                key={params.toString()}
                onSubmit={(e) => {
                  e.preventDefault()
                  setParams({
                    user_id: userRef.current?.value ?? '',
                    from_date: fromRef.current?.value ?? '',
                    to_date: toRef.current?.value ?? '',
                  })
                  setPage(1)
                }}
              >
                <div className="form-row">
                  <div className="col-3">
                    <input
                      ref={userRef}
                      className="form-control"
                      type="text"
                      placeholder="Enter User ID"
                      name="user_id"
                      defaultValue={data?.invalidUserId ? '' : userId}
                    />
                  </div>
                  <div className="col-3">
                    <input
                      ref={fromRef}
                      type="text"
                      name="from_date"
                      id="from_date"
                      className="form-control "
                      placeholder="e.g. From Date"
                      required
                      defaultValue={fromDate}
                      readOnly
                    />
                  </div>
                  <div className="col-3">
                    <input
                      ref={toRef}
                      type="text"
                      name="to_date"
                      id="to_date"
                      className="form-control "
                      placeholder="e.g. To Date"
                      required
                      defaultValue={toDate}
                      readOnly
                    />
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
                <h4 className="card-title">Wallet Statement</h4>
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
                            <th>Name</th>
                            <th>User Id</th>
                            <th>Income Type</th>
                            <th>Date</th>
                            <th>Remark</th>
                            <th>Transaction Type</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.data.map((t) => (
                            <tr key={t.id}>
                              <td>{t.index}</td>
                              <td>{t.name}</td>
                              <td>{t.userId}</td>
                              <td>{t.walletType}</td>
                              <td>
                                <i className="fa fa-clock-o"></i> {t.date}
                              </td>
                              <td>{t.note}</td>
                              <td>{t.type}</td>
                              <td>{t.amount}</td>
                            </tr>
                          ))}
                          {data?.data.length === 0 && (
                            <tr className="odd">
                              <td valign="top" colSpan={8} className="dataTables_empty">
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
