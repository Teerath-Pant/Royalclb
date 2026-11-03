type Props = { total: number; page: number; perPage: number; onPage: (page: number) => void }

function pageNumbers(page: number, pages: number): (number | 'ellipsis')[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)
  if (page <= 4) return [1, 2, 3, 4, 5, 'ellipsis', pages]
  if (page >= pages - 3) return [1, 'ellipsis', pages - 4, pages - 3, pages - 2, pages - 1, pages]
  return [1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', pages]
}

export default function Pager({ total, page, perPage, onPage }: Props) {
  const pages = Math.max(Math.ceil(total / perPage), 1)
  const start = total ? (page - 1) * perPage + 1 : 0
  const end = Math.min(page * perPage, total)

  return (
    <div className="row">
      <div className="col-sm-12 col-md-5">
        <div className="dataTables_info" role="status">
          Showing {start} to {end} of {total.toLocaleString('en-US')} entries
        </div>
      </div>
      <div className="col-sm-12 col-md-7">
        <div className="dataTables_paginate paging_simple_numbers">
          <ul className="pagination">
            <li className={`paginate_button page-item previous${page <= 1 ? ' disabled' : ''}`}>
              <a
                href="#"
                className="page-link"
                onClick={(e) => {
                  e.preventDefault()
                  if (page > 1) onPage(page - 1)
                }}
              >
                Previous
              </a>
            </li>
            {pageNumbers(page, pages).map((n, i) =>
              n === 'ellipsis' ? (
                <li key={`e${i}`} className="paginate_button page-item disabled">
                  <a href="#" className="page-link" onClick={(e) => e.preventDefault()}>
                    …
                  </a>
                </li>
              ) : (
                <li key={n} className={`paginate_button page-item${n === page ? ' active' : ''}`}>
                  <a
                    href="#"
                    className="page-link"
                    onClick={(e) => {
                      e.preventDefault()
                      onPage(n)
                    }}
                  >
                    {n}
                  </a>
                </li>
              ),
            )}
            <li className={`paginate_button page-item next${page >= pages ? ' disabled' : ''}`}>
              <a
                href="#"
                className="page-link"
                onClick={(e) => {
                  e.preventDefault()
                  if (page < pages) onPage(page + 1)
                }}
              >
                Next
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
