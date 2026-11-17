import { useState } from 'react'

export default function Accordion({ items, className = '' }) {
  const [open, setOpen] = useState(() => items.findIndex(i => i.open))
  return (
    <div className={`acc ${className}`.trim()}>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} className={`acc-i ${isOpen ? 'open' : ''}`.trim()}>
            <button className="acc-h" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
              {item.q}
              <svg className="ic" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {isOpen && <div className="acc-b">{item.a}</div>}
          </div>
        )
      })}
    </div>
  )
}
