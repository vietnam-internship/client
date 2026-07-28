import { useEffect, useState } from 'react'
import { listBranches } from '@/api/branch'
import type { BranchSummary, UserProfile } from '@/types'

/**
 * admin 화면이 지점별 API를 호출할 때 쓸 branchId를 관리한다.
 * BRANCH_ADMIN은 자기 소속 지점(user.branchId)에 고정, ADMIN은 전체 지점 중 골라 쓴다
 * (서버 assertBranchAccess가 BRANCH_ADMIN의 다른 지점 접근을 막으므로 프론트도 맞춰야 한다).
 */
function useAdminBranch(user: UserProfile | null) {
  const isBranchAdmin = user?.role === 'BRANCH_ADMIN'
  const [branches, setBranches] = useState<BranchSummary[]>([])
  const [branchId, setBranchId] = useState<number | null>(isBranchAdmin ? user.branchId : null)

  useEffect(() => {
    if (isBranchAdmin) return
    listBranches()
      .then((result) => {
        setBranches(result)
        setBranchId((current) => current ?? (result[0]?.id ?? null))
      })
      .catch(() => setBranches([]))
  }, [isBranchAdmin])

  return {
    branchId,
    setBranchId,
    branches,
    /** true면 BranchSelect를 숨기고 이 지점에 고정해야 한다. */
    locked: isBranchAdmin,
  }
}

export default useAdminBranch
