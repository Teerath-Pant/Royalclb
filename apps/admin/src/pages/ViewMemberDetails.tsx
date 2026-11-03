import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMemberDetails, useUpdateMemberDetails, type MemberDetails } from '../queries/members'

function Form({ member }: { member: MemberDetails | null }) {
  const update = useUpdateMemberDetails()
  const [name, setName] = useState(member?.name ?? '')
  const [phone, setPhone] = useState(member?.phone ?? '')
  const [emailId, setEmailId] = useState(member?.emailId ?? '')
  const [password, setPassword] = useState(member?.password ?? '')

  return (
    <form
      className="form-horizontal form-bordered"
      onSubmit={(e) => {
        e.preventDefault()
        if (member) update.mutate({ memberId: member.memberId, name, phone, emailId, password })
      }}
    >
      <div className="form-group">
        <label className="control-label col-md-3 col-sm-3">User ID * :</label>
        <div className="col-md-6 col-sm-6">
          <input className="form-control" value={member?.userId ?? ''} placeholder="Enter Name" disabled />
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-3 col-sm-3">Name * :</label>
        <div className="col-md-6 col-sm-6">
          <input
            className="form-control"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            placeholder="Enter Name"
          />
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-3 col-sm-3">Phone * :</label>
        <div className="col-md-6 col-sm-6">
          <input
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            name="phone"
            placeholder="Enter Phone"
            maxLength={10}
          />
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-3 col-sm-3">EmailID :</label>
        <div className="col-md-6 col-sm-6">
          <input
            className="form-control"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            name="email_id"
            placeholder="Enter EmailID"
          />
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-3 col-sm-3">Sponser Id * :</label>
        <div className="col-md-6 col-sm-6">
          <input className="form-control" disabled value={member?.sponser ?? ' ()'} placeholder="Enter Sponser Id" />
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-3 col-sm-3">Date of Joining * :</label>
        <div className="col-md-6 col-sm-6">
          <input className="form-control" disabled value={member?.dateOfJoining ?? ''} name="date_time" />
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-3 col-sm-3">Login Password * :</label>
        <div className="col-md-6 col-sm-6">
          <input
            className="form-control"
            type="text"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Login Password"
          />
        </div>
      </div>

      <div className="mt-3">
        <button className="btn btn-success" type="submit" disabled={update.isPending}>
          Update
        </button>
      </div>
    </form>
  )
}

export default function ViewMemberDetails() {
  const [params] = useSearchParams()
  const { data, isSuccess } = useMemberDetails(params.get('user_id') ?? '')

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12 col-lg-12">
          <div className="iq-card">
            <div className="iq-card-header d-flex justify-content-between">
              <div className="iq-header-title">
                <h4 className="card-title">View Member Details</h4>
              </div>
            </div>
            <div className="iq-card-body">
              <ul className="nav nav-pills mb-3 nav-fill" id="pills-tab-1" role="tablist">
                <li className="nav-item">
                  <a className="nav-link active" id="pills-home-tab-fill" href="#profile" role="tab" onClick={(e) => e.preventDefault()}>
                    Profile
                  </a>
                </li>
              </ul>
              <div className="tab-content" id="pills-tabContent-1">
                <div className="tab-pane fade show active" id="profile" role="tabpanel">
                  {isSuccess && <Form key={data?.memberId} member={data} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
