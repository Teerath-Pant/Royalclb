type Props = {
  perPage: number
  onPerPage: (perPage: number) => void
  search?: string
  onSearch?: (search: string) => void
}

export default function TableTools({ perPage, onPerPage, search, onSearch }: Props) {
  return (
    <div className="row">
      <div className="col-sm-12 col-md-6">
        <div className="dataTables_length">
          <label>
            Show{' '}
            <select
              className="custom-select custom-select-sm form-control form-control-sm"
              value={perPage}
              onChange={(e) => onPerPage(Number(e.target.value))}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>{' '}
            entries
          </label>
        </div>
      </div>
      <div className="col-sm-12 col-md-6">
        {onSearch && <div className="dataTables_filter">
          <label>
            Search:
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder=""
              value={search ?? ''}
              onChange={(e) => onSearch(e.target.value)}
            />
          </label>
        </div>}
      </div>
    </div>
  )
}
