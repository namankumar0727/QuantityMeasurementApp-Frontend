import { useState } from 'react'

export function useFormError() {
  const [error, setError] = useState('')

  function showError(msg) {
    setError(msg)
    setTimeout(() => setError(''), 3500)
  }

  function clearError() {
    setError('')
  }

  return { error, showError, clearError }
}
