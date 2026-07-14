import { useState } from 'react'

const RECENT_KEY = 'travelx.recentSearches'

function loadRecent(): string[] {
  const saved = localStorage.getItem(RECENT_KEY)
  return saved ? JSON.parse(saved) : ['USD', 'VND']
}

function saveRecent(items: string[]) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(items))
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
