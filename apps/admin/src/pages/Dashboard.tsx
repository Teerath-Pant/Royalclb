import { Link } from 'react-router-dom'

// Mock data — replaced by API in phase 2
const referralLink = 'https://royalclub.example/register.php?referralCode=admin'

export default function Dashboard() {
  const copy = () => navigator.clipboard.writeText(referralLink).then(() => alert('Referral Link Copied Successfully'))
  const btn = 'rounded px-2 py-0.5 text-sm font-bold text-white'

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-lg font-semibold text-ink">
        <span>Referral Link</span>
        <button onClick={copy} className={`${btn} cursor-pointer bg-success`}>Copy</button>
        <a target="_blank" href={`https://wa.me/?text=${referralLink}`} className={`${btn} bg-success`}>Whatsapp</a>
        <a target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=${referralLink}`} className={`${btn} bg-primary`}>Facebook</a>
        <a target="_blank" href={`https://t.me/share/url?url=${referralLink}`} className={`${btn} bg-primary`}>Telegram</a>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/viewMember" className="flex items-center justify-between rounded-2xl bg-primary/10 p-5">
          <span className="flex size-15 items-center justify-center rounded-full text-xl bg-primary text-white">U</span>
          <div className="text-right">
            <h3 className="text-lg font-semibold">1280</h3>
            <h6 className="text-sm">Total User</h6>
          </div>
        </Link>

        <Link to="/viewActiveMember" className="flex items-center justify-between rounded-2xl bg-success/10 p-5">
          <span className="flex size-15 items-center justify-center rounded-full text-xl bg-success text-white">U</span>
          <div className="text-right">
            <h3 className="text-lg font-semibold">420</h3>
            <h6 className="text-sm">Active User</h6>
          </div>
        </Link>

        <Link to="/viewInActiveMember" className="flex items-center justify-between rounded-2xl bg-danger/10 p-5">
          <span className="flex size-15 items-center justify-center rounded-full text-xl bg-danger text-white">U</span>
          <div className="text-right">
            <h3 className="text-lg font-semibold">860</h3>
            <h6 className="text-sm">In Active User</h6>
          </div>
        </Link>

        <Link to="/activeIncomeUserMember" className="flex items-center justify-between rounded-2xl bg-primary/10 p-5">
          <span className="flex size-15 items-center justify-center rounded-full text-xl bg-danger text-white">U</span>
          <div className="text-right">
            <h3 className="text-lg font-semibold">420</h3>
            <h6 className="text-sm">Active Income User</h6>
          </div>
        </Link>

        <Link to="/recharges" className="flex items-center justify-between rounded-2xl bg-success/10 p-5">
          <span className="flex size-15 items-center justify-center rounded-full text-xl bg-success text-white">$</span>
          <div className="text-right">
            <h3 className="text-lg font-semibold">12500.00₹</h3>
            <h6 className="text-sm">Pending Fund Requerst</h6>
          </div>
        </Link>

        <Link to="/walletWithdrawStatus" className="flex items-center justify-between rounded-2xl bg-success/10 p-5">
          <span className="flex size-15 items-center justify-center rounded-full text-xl bg-success text-white">$</span>
          <div className="text-right">
            <h3 className="text-lg font-semibold">98000.00₹</h3>
            <h6 className="text-sm">Total Withdraw</h6>
          </div>
        </Link>

        <Link to="/walletWithdrawStatus" className="flex items-center justify-between rounded-2xl bg-success/10 p-5">
          <span className="flex size-15 items-center justify-center rounded-full text-xl bg-success text-white">$</span>
          <div className="text-right">
            <h3 className="text-lg font-semibold">4300.00₹</h3>
            <h6 className="text-sm">Pending Withdrawal</h6>
          </div>
        </Link>

        <Link to="/viewMember" className="flex items-center justify-between rounded-2xl bg-success/10 p-5">
          <span className="flex size-15 items-center justify-center rounded-full text-xl bg-success text-white">$</span>
          <div className="text-right">
            <h3 className="text-lg font-semibold">152340.50 ₹</h3>
            <h6 className="text-sm">Income Wallet</h6>
          </div>
        </Link>

        <Link to="/walletOutstanding" className="flex items-center justify-between rounded-2xl bg-warning/10 p-5">
          <span className="flex size-15 items-center justify-center rounded-full text-xl bg-warning text-white">$</span>
          <div className="text-right">
            <h3 className="text-lg font-semibold">87210.00 ₹</h3>
            <h6 className="text-sm">Purchase Wallet</h6>
          </div>
        </Link>
      </div>
    </>
  )
}
