import { useState } from 'react'
import { useTelegramLink, useUpdateTelegramLink } from '../queries/settings'

function Form({ savedLink }: { savedLink: string }) {
  const [saved, setSaved] = useState(savedLink)
  const [telegramLink, setTelegramLink] = useState(savedLink)
  const update = useUpdateTelegramLink()

  return (
    <form
      className="text-center"
      id="link-form"
      onSubmit={(e) => {
        e.preventDefault()
        const link = telegramLink.trim()
        update.mutate(link, { onSuccess: (res) => setSaved((res.data as { link: string }).link) })
      }}
      onReset={(e) => {
        e.preventDefault()
        setTelegramLink(saved)
      }}
    >
      <fieldset>
        <div className="form-card text-left">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="telegram_link">Telegram Link</label>
                <input
                  type="text"
                  name="telegram_link"
                  id="telegram_link"
                  className="form-control"
                  required
                  value={telegramLink}
                  onChange={(e) => setTelegramLink(e.target.value)}
                />
              </div>
            </div>
          </div>
          <button type="reset" className="btn btn-danger action-button-previous float-left">
            Reset
          </button>
          <button type="submit" className="btn btn-primary action-button float-left ml-3" disabled={update.isPending}>
            Update
          </button>
        </div>
      </fieldset>
    </form>
  )
}

export default function LinksSettings() {
  const { data } = useTelegramLink()

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <div className="iq-card">
            <div className="iq-card-header d-flex justify-content-between">
              <div className="iq-header-title">
                <h4 className="card-title">Links Settings</h4>
              </div>
            </div>
            <div className="iq-card-body">{data && <Form savedLink={data.link} />}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
