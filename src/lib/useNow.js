import { useState, useEffect } from 'react'

// Returns `initialIso` (the build time) on the first render so server and client
// markup match, then switches to the visitor's real clock after mount.
export default function useNow(initialIso, intervalMs = 60000) {
  const [now, setNow] = useState(() => new Date(initialIso))
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}
