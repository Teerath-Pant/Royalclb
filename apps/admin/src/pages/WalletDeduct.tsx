import { useState } from 'react'
import { useUserWallet, useWalletDeduct, type UserWallet } from '../queries/fund'

const walletKeyMap = {
  WALLET: 'wallet',
  FUND_WALLET: 'fundWallet',
  BONUS_WALLET: 'bonusWallet',
} as const

type WalletType = keyof typeof walletKeyMap

export default function WalletDeduct() {
  const [userId, setUserId] = useState('')
  const [userName, setUserName] = useState('')
  const [walletType, setWalletType] = useState<WalletType>('WALLET')
  const [balances, setBalances] = useState<UserWallet | null>(null)
  const [amount, setAmount] = useState('')
  const lookup = useUserWallet()
  const deduct = useWalletDeduct()

  const walletBalance = balances ? (balances[walletKeyMap[walletType]] ?? '0.00') : ''

  const userLookup = (id: string) => {
    setBalances(null)
    setUserName('')
    if (!id) return

    lookup.mutate(id, {
      onSuccess: (data) => {
        setUserName(data.name)
        setBalances(data)
      },
      onError: (error) => {
        alert(error.message || 'Invalid User ID')
        setUserId('')
      },
    })
  }

  const submitWalletDeduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirm('Are you sure?')) return

    deduct.mutate(
      { userId, wallet: walletType, amount },
      {
        onSuccess: (body) => {
          alert(body.message || 'Amount Deducted Successfully!!!')
          window.location.reload()
        },
        onError: (error) => alert(error.message || 'Wallet deduction failed!!!'),
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
                <h4 className="card-title">Wallet Deduction</h4>
              </div>
            </div>
            <div className="iq-card-body">
              <form className="text-center" id="walletDeductForm" onSubmit={submitWalletDeduct}>
                <fieldset>
                  <div className="form-card text-left">
                    <div className="row">
                      <div className="col-12">
                        <h3 className="mb-4">Wallet Deduction</h3>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>User ID -:</label>
                          <input
                            type="text"
                            name="user_id"
                            id="user_id"
                            className="form-control"
                            placeholder="e.g. xxxxxxxxxx"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            onBlur={(e) => userLookup(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Name -: </label>
                          <input type="text" id="user_name" className="form-control" placeholder="e.g. John Doe" value={userName} disabled readOnly />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Wallet -:</label>
                          <select
                            id="wallet_type"
                            name="wallet_type"
                            className="form-control"
                            disabled={!balances}
                            value={walletType}
                            onChange={(e) => setWalletType(e.target.value as WalletType)}
                          >
                            <option value="WALLET">Winning Wallet</option>
                            <option value="FUND_WALLET">Fund Wallet</option>
                            <option value="BONUS_WALLET">Bonus Wallet</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Wallet Balance -: </label>
                          <input type="text" id="wallet_balance" className="form-control" placeholder="0.00" value={walletBalance} disabled readOnly />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Amount To Deduct -:</label>
                          <input
                            type="text"
                            id="amount"
                            name="amount"
                            className="form-control"
                            placeholder="e.g. Deduction Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.charCode > 31 && (e.charCode < 48 || e.charCode > 57)) e.preventDefault()
                            }}
                            disabled={!balances}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button type="submit" name="walletDeduct" className="btn btn-primary action-button float-left" value="Submit">
                    Deduct Now
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
