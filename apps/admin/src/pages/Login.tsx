import { useNavigate } from 'react-router-dom'

const input = 'w-full rounded-lg border border-primary-light px-3 py-2 outline-none focus:border-primary'

export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[40px] bg-white shadow-lg md:grid-cols-2">
        <div className="hidden bg-linear-to-r from-primary to-primary-dark md:block" />
        <form
          className="p-10 md:p-16"
          onSubmit={(e) => {
            e.preventDefault() // no API yet (phase 1)
            navigate('/dashboard')
          }}
        >
          <h1 className="mb-6 text-3xl font-bold text-ink">Sign in</h1>
          <label className="mb-1 block text-sm">User ID</label>
          <input name="username" placeholder="Username" required autoFocus className={`${input} mb-4`} />
          <label className="mb-1 block text-sm">Password</label>
          <input name="password" type="password" placeholder="Password" required className={`${input} mb-6`} />
          <button className="float-right cursor-pointer rounded-lg bg-primary px-6 py-2 text-white">Sign in</button>
        </form>
      </div>
    </div>
  )
}
