'use client'

import { useEffect } from 'react'

export function Cursor() {
  useEffect(() => {
    // Ensure native cursor by cleaning up any lingering has-cursor class
    document.documentElement.classList.remove('has-cursor')
  }, [])

  return null
}
