const STAR = 'm12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z'

// The bright part of a star is cut off at 0, half or full width (whole class names so Tailwind can see them)
const CUT = { 0: 'w-0', 0.5: 'w-1/2', 1: 'w-full' }

function Star({ fill, size }) {
  const dim = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
  const icon = (cls, filled) => (
    <svg className={`absolute left-0 top-0 ${dim} ${cls}`} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'var(--border)'} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d={STAR} />
    </svg>
  )
  return (
    <span className={`relative inline-block ${dim}`}>
      {icon('text-border-strong', false)}
      <span className={`absolute left-0 top-0 h-full overflow-hidden ${CUT[fill]}`}>{icon('text-accent-strong', true)}</span>
    </span>
  )
}

/** Star rating (0 to 5, in halves). `label` is the text next to the stars, e.g. "4.5 (12)". */
export default function Stars({ value = 0, label, size = 'md' }) {
  const v = Math.max(0, Math.min(5, Math.round((Number(value) || 0) * 2) / 2))
  return (
    <span className="rating">
      <span className="stars" role="img" aria-label={`${v} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={size} fill={v >= i ? 1 : v >= i - 0.5 ? 0.5 : 0} />)}
      </span>
      {label && <span className="text-sm leading-[22px] text-ink-muted">{label}</span>}
    </span>
  )
}
