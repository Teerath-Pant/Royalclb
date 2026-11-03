import type { RefObject } from 'react'
import { useEffect } from 'react'

const loadJquery = async () => {
  const { default: $ } = await import('jquery')
  Object.assign(window, { jQuery: $, $ })
  await import('bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js')
  return $
}

/**
 * Attaches the datepicker to the input. It checks after every render because some pages remount
 * their form (`key={...}`), which swaps in a fresh input that the old picker is not attached to.
 */
export function useDatepicker(ref: RefObject<HTMLInputElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let cancelled = false

    void loadJquery().then(($) => {
      if (cancelled || !el.isConnected || $(el).data('datepicker')) return
      $(el).datepicker({ format: 'dd-mm-yyyy' })
    })

    return () => {
      cancelled = true
    }
  })

  useEffect(
    () => () => {
      const el = ref.current
      if (el) void loadJquery().then(($) => $(el).datepicker('destroy'))
    },
    [ref],
  )
}
