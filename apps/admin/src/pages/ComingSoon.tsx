import { useLocation } from 'react-router-dom'
import Card from '../components/Card'

// Placeholder for pages not ported yet. Replace one route at a time in App.tsx.
export default function ComingSoon() {
  const { pathname } = useLocation()
  return <Card title={pathname.slice(1)}>Not ported yet.</Card>
}
