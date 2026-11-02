import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function App() {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('unreachable'))
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-4xl font-bold">Royalclub Admin</h1>
        <p className="mt-2 text-slate-400">Server: {status}</p>
      </motion.div>
    </main>
  )
}
