import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useImpersonate, useSearchMembers } from '../queries/members'

function Highlight({ text, search }: { text: string; search: string }) {
  if (!search) return text
  const lower = text.toLowerCase()
  const query = search.toLowerCase()
  const parts: ReactNode[] = []
  let from = 0
  let at = lower.indexOf(query)
  while (at !== -1) {
    parts.push(text.slice(from, at))
    parts.push(
      <span key={at} className="highlight">
        {search.toUpperCase()}
      </span>,
    )
    from = at + query.length
    at = lower.indexOf(query, from)
  }
  parts.push(text.slice(from))
  return parts
}

export default function SearchMember() {
  const [input, setInput] = useState('')
  const [search, setSearch] = useState<string | null>(null)
  const { data } = useSearchMembers(search)
  const impersonate = useImpersonate()
  const q = search ?? ''

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12 ">
          <div className="iq-card">
            <div className="iq-card-header d-flex justify-content-between"></div>
            <div className="iq-card-body">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-row">
                  <div className="col-3">
                    <input
                      type="text"
                      id="search_value"
                      className="form-control"
                      placeholder="Search Value"
                      name="user_id"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && setSearch(input)}
                    />
                  </div>
                  <div className="col-3">
                    <button type="button" className="btn btn-primary btn-lg m-l-15 waves-effect" id="SubmitSearch" onClick={() => setSearch(input)}>
                      {' '}
                      Search{' '}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div id="show" style={{ width: '100%' }}>
          {data && (
            <div className="col-sm-12">
              <div className="iq-card">
                <div className="iq-card-header d-flex justify-content-between">
                  <div className="iq-header-title">
                    <h4 className="card-title">Search Member Result</h4>
                  </div>
                </div>
                <div className="iq-card-body">
                  <div className="table-responsive">
                    <table
                      id="example"
                      className="table table-striped table-bordered"
                      style={{ overflowX: 'scroll', fontSize: 12 }}
                    >
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>User Id</th>
                          <th>Name</th>
                          <th>Phone</th>
                          <th>Sponser ID</th>
                          <th>Sponser Name</th>
                          <th>Joinig Date</th>
                          <th>Password</th>
                          <th>More Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {q && data.length === 0 && (
                          <tr>
                            <td colSpan={9}>
                              <b>
                                <center> No Record Found </center>
                              </b>{' '}
                            </td>
                          </tr>
                        )}
                        {data.map((m, i) => (
                          <tr key={m.memberId}>
                            <td>{i + 1}</td>
                            <td><Highlight text={m.userId ?? ''} search={q} /></td>
                            <td><Highlight text={m.name} search={q} /></td>
                            <td><Highlight text={m.phone} search={q} /></td>
                            <td><Highlight text={m.sponserUserId} search={q} /></td>
                            <td><Highlight text={m.sponserName} search={q} /></td>
                            <td><Highlight text={m.dateOfJoining} search={q} /></td>
                            <td><Highlight text={m.password} search={q} /></td>
                            <td>
                              <Link className="btn btn-success" to={`/viewMemberDetails?user_id=${m.userId}`}>
                                More
                              </Link>
                              &nbsp;{' '}
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault()
                                  impersonate.mutate(m.memberId)
                                }}
                                className="btn btn-primary btn-sm"
                              >
                                Dashboard
                              </a>{' '}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
