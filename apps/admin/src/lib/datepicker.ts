import type { RefObject } from 'react'
import { useEffect } from 'react'

export function useDatepicker(ref: RefObject<HTMLInputElement | null>) {
  useEffect(() => {
    let destroy = () => {}

    ;(async () => {
      const { default: $ } = await import('jquery')
      Object.assign(window, { jQuery: $, $ })
      await import('bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js')
      const el = ref.current
      if (!el) return
      $(el).datepicker({ format: 'dd-mm-yyyy' })
      destroy = () => $(el).datepicker('destroy')
    })()

    return () => destroy()
  }, [ref])
}
