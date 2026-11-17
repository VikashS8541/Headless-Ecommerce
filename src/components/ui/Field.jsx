/** A labelled form field in the Aurelo style, with an optional error or hint line. */
export default function Field({ label, error, hint, className = '', children }) {
  return (
    <div className={`field ${className}`.trim()}>
      <label>{label}</label>
      {children}
      {error ? <span className="msg err" role="alert">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  )
}
