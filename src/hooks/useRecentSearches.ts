import { useState } from 'react'
import { DEFAULT_RECENT_SEARCHES, RECENT_SEARCHES_KEY } from '@/constants/storage'

function loadRecent(): string[] {
  const saved = localStorage.getItem(RECENT_SEARCHES_KEY)
  return saved ? JSON.parse(saved) : DEFAULT_RECENT_SEARCHES
}

function saveRecent(items: string[]) {
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(items))
}

function useRecentSearches() {
  const [recent, setRecent] = useState<string[]>(loadRecent)

  const update = (items: string[]) => {
    setRecent(items)
    saveRecent(items)
  }

  const addRecent = (code: string) => {
    update([code, ...recent.filter((item) => item !== code)])
  }

  const removeRecent = (code: string) => {
    update(recent.filter((item) => item !== code))
  }

  const clearRecent = () => {
    update([])
  }

  return { recent, addRecent, removeRecent, clearRecent }
}

export default useRecentSearches
