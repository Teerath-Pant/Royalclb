import { useState } from 'react'
import { useFundTransfer, useSponserName } from '../queries/fund'

export default function FundTransfer() {
  const [sponserId, setSponserId] = useState('')
  const [sponserName, setSponserName] = useState('')
  const [amount, setAmount] = useState('')
  const lookup = useSponserName()
  const transfer = useFundTransfer()

  const sponserValid = (id: string) => {
    setSponserName('')
    if (id === '') return
    lookup.mutate(id, {
      onSuccess: ({ name }) => {
        if (name.trim() !== '') {
          setSponserName(name.trim())
        } else {
          alert('Invalid User ID')
          setSponserId('')
        }
      },
    })
  }

  const submitFundTransfer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirm('Are you sure?')) return

    transfer.mutate(
      { userId: sponserId, amount },
      {
        onSuccess: (body) => {
          alert(body.message || 'Fund Transfer Successfully!!!')
          window.location.reload()
        },
        onError: (error) => alert(error.message || 'Fund transfer failed!!!'),
      },
    )
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-6 col-lg-6">
          <div className="iq-card">
            <div className="iq-card-header d-flex justify-content-between">
              <div className="iq-header-title">
                <h4 className="card-title">Fund Transfer</h4>
              </div>
            </div>
            <div className="iq-card-body">
              <form className="text-center" id="fundTransferForm" onSubmit={submitFundTransfer}>
                <fieldset>
                  <div className="form-card text-left">
                    <div className="row">
                      <div className="col-12">
                        <h3 className="mb-4">Fund Transfer</h3>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>User ID -:</label>
                          <input
                            type="text"
                            name="sponser_id"
                            id="sponser_id"
                            className="form-control"
                            placeholder="e.g. xxxxxxxxxx"
                            value={sponserId}
                            onChange={(e) => setSponserId(e.target.value)}
                            onBlur={(e) => sponserValid(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Name -: </label>
                          <input type="text" id="sponser_name" className="form-control" placeholder="e.g. John Doe" value={sponserName} disabled readOnly />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Amount To Transfer -:</label>
                          <input
                            type="text"
                            id="amount"
                            name="amount"
                            className="form-control"
                            placeholder="e.g. Transfer Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.charCode > 31 && (e.charCode < 48 || e.charCode > 57)) e.preventDefault()
                            }}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button type="submit" name="fundTransfer" className="btn btn-primary action-button float-left" value="Submit">
                    Transfer Now
                  </button>
                  <button
                    type="button"
                    name="previous"
                    className="btn btn-danger action-button-previous float-left ml-3"
                    value="Reset"
                    onClick={() => window.location.reload()}
                  >
                    Reset
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
