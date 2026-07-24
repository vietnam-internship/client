import { useEffect, useState } from 'react'
import { createBranch, getBranch, listBranches, updateBranch } from '@/api/branch'
import type { BranchDetail, BranchSummary } from '@/types'
import AdminLayout from '@/pages/Admin/components/AdminLayout'

const INPUT_CLASS =
  'h-11 rounded-lg border border-blue-300 px-3.5 text-[13px] text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none'

const NEW_BRANCH_VALUE = 'new'

interface FormState {
  name: string
  address: string
  latitude: string
  longitude: string
  phone: string
  businessHours: string
  pickupLocationDetail: string
  timeSlotCapacity: string
  supportedCurrencies: string
  active: boolean
}

const EMPTY_FORM: FormState = {
  name: '',
  address: '',
  latitude: '',
  longitude: '',
  phone: '',
  businessHours: '',
  pickupLocationDetail: '',
  timeSlotCapacity: '',
  supportedCurrencies: '',
  active: true,
}

function toForm(branch: BranchDetail): FormState {
  return {
    name: branch.name,
    address: branch.address,
    latitude: String(branch.latitude),
    longitude: String(branch.longitude),
    phone: branch.phone,
    businessHours: branch.businessHours,
    pickupLocationDetail: branch.pickupLocationDetail,
    timeSlotCapacity: String(branch.timeSlotCapacity),
    supportedCurrencies: branch.currencies.map((c) => c.currencyCode).join(', '),
    active: branch.active,
  }
}

interface BranchFormProps {
  selected: string
  onSaved: (branch: BranchDetail) => void
}

// selected가 바뀌면 부모가 key={selected}로 이 컴포넌트를 통째로 리마운트시켜서,
// effect 안에서 동기적으로 상태를 리셋할 필요 없이 항상 깨끗한 초기 상태로 시작한다.
function BranchForm({ selected, onSaved }: BranchFormProps) {
  const isNew = selected === NEW_BRANCH_VALUE
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isNew) return
    let cancelled = false
    getBranch(Number(selected))
      .then((branch) => {
        if (!cancelled) setForm(toForm(branch))
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load this branch.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [isNew, selected])

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    setError(null)
    setSaved(false)

    const supportedCurrencies = form.supportedCurrencies
      .split(',')
      .map((code) => code.trim().toUpperCase())
      .filter(Boolean)

    try {
      const saved = isNew
        ? await createBranch({
            name: form.name,
            address: form.address,
            latitude: Number(form.latitude),
            longitude: Number(form.longitude),
            phone: form.phone,
            businessHours: form.businessHours,
            pickupLocationDetail: form.pickupLocationDetail || undefined,
            timeSlotCapacity: Number(form.timeSlotCapacity),
            supportedCurrencies,
          })
        : await updateBranch(Number(selected), {
            name: form.name,
            address: form.address,
            latitude: Number(form.latitude),
            longitude: Number(form.longitude),
            phone: form.phone,
            businessHours: form.businessHours,
            pickupLocationDetail: form.pickupLocationDetail || undefined,
            timeSlotCapacity: Number(form.timeSlotCapacity),
            supportedCurrencies,
            active: form.active,
          })
      onSaved(saved)
      setSaved(true)
    } catch {
      setError('Failed to save this branch. Please check the fields and try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="mt-8 text-[13px] text-gray-400">Loading…</p>
  }

  return (
    <>
      <div className="mt-8 border-t border-gray-200">
        <div className="flex items-center justify-between border-b border-gray-200 py-6 pl-7">
          <span className="text-[15px] font-bold text-gray-900">Name</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="Branch name"
            className={`${INPUT_CLASS} w-[360px]`}
          />
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 py-6 pl-7">
          <span className="text-[15px] font-bold text-gray-900">Address</span>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setField('address', e.target.value)}
            placeholder="Street address"
            className={`${INPUT_CLASS} w-[360px]`}
          />
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 py-6 pl-7">
          <span className="text-[15px] font-bold text-gray-900">Phone</span>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setField('phone', e.target.value)}
            placeholder="02-000-0000"
            className={`${INPUT_CLASS} w-[360px]`}
          />
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 py-6 pl-7">
          <span className="text-[15px] font-bold text-gray-900">Location</span>
          <div className="flex gap-5">
            <input
              type="text"
              inputMode="decimal"
              value={form.latitude}
              onChange={(e) => setField('latitude', e.target.value)}
              placeholder="Latitude"
              className={`${INPUT_CLASS} w-[170px]`}
            />
            <input
              type="text"
              inputMode="decimal"
              value={form.longitude}
              onChange={(e) => setField('longitude', e.target.value)}
              placeholder="Longitude"
              className={`${INPUT_CLASS} w-[170px]`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 py-6 pl-7">
          <span className="text-[15px] font-bold text-gray-900">Business hours</span>
          <input
            type="text"
            value={form.businessHours}
            onChange={(e) => setField('businessHours', e.target.value)}
            placeholder="Mon-Fri 09:00-18:00, Sat 09:00-13:00"
            className={`${INPUT_CLASS} w-[360px]`}
          />
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 py-6 pl-7">
          <span className="text-[15px] font-bold text-gray-900">Pickup location detail</span>
          <input
            type="text"
            value={form.pickupLocationDetail}
            onChange={(e) => setField('pickupLocationDetail', e.target.value)}
            placeholder="1F, 3rd booth"
            className={`${INPUT_CLASS} w-[360px]`}
          />
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 py-6 pl-7">
          <span className="text-[15px] font-bold text-gray-900">
            Available Reservation per One Time Slot
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={form.timeSlotCapacity}
            onChange={(e) => setField('timeSlotCapacity', e.target.value)}
            placeholder="4"
            className={`${INPUT_CLASS} w-[360px]`}
          />
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 py-6 pl-7">
          <span className="text-[15px] font-bold text-gray-900">Supported currencies</span>
          <input
            type="text"
            value={form.supportedCurrencies}
            onChange={(e) => setField('supportedCurrencies', e.target.value)}
            placeholder="VND, USD"
            className={`${INPUT_CLASS} w-[360px]`}
          />
        </div>

        {!isNew && (
          <div className="flex items-center justify-between border-b border-gray-200 py-6 pl-7">
            <span className="text-[15px] font-bold text-gray-900">Active</span>
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setField('active', e.target.checked)}
              className="h-5 w-5 cursor-pointer accent-primary"
            />
          </div>
        )}
      </div>

      {error && <p className="mt-4 text-[13px] text-red-500">{error}</p>}
      {saved && <p className="mt-4 text-[13px] text-green-600">Saved.</p>}

      <div className="mt-16 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="h-12 w-[300px] cursor-pointer rounded-lg bg-primary text-[16px] font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-40"
        >
          {saving ? 'Saving…' : isNew ? 'Create branch' : 'Save changes'}
        </button>
      </div>
    </>
  )
}

function AdminSettingsPage() {
  const [branches, setBranches] = useState<BranchSummary[]>([])
  const [selected, setSelected] = useState<string>(NEW_BRANCH_VALUE)

  useEffect(() => {
    listBranches()
      .then(setBranches)
      .catch(() => {})
  }, [])

  const handleSaved = (branch: BranchDetail) => {
    setBranches((prev) => {
      const exists = prev.some((b) => b.id === branch.id)
      return exists ? prev.map((b) => (b.id === branch.id ? { ...b, name: branch.name } : b)) : [...prev, branch]
    })
    setSelected(String(branch.id))
  }

  return (
    <AdminLayout
      active="settings"
      title="Exchange Shop Information"
      subtitle="Register or edit a branch"
    >
      <div className="mt-10">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="h-11 w-[300px] cursor-pointer rounded-lg border border-gray-200 px-3.5 text-[14px] text-gray-700 focus:border-primary focus:outline-none"
        >
          <option value={NEW_BRANCH_VALUE}>+ New branch</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>

      <BranchForm key={selected} selected={selected} onSaved={handleSaved} />
    </AdminLayout>
  )
}

export default AdminSettingsPage
