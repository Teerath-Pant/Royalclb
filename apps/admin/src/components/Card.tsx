import type { ReactNode } from 'react'

export default function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="mb-6 rounded-3xl bg-white shadow-sm">
      {title && <h4 className="border-b border-page px-6 py-4 text-lg font-semibold text-ink">{title}</h4>}
      <div className="p-6">{children}</div>
    </section>
  )
}
