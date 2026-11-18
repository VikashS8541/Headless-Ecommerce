import { useSite } from '../../api/hooks.js'

export default function AnnouncementBar() {
  const { data, isPending } = useSite()
  const text = data?.options?.announcement_text
  // Keep the 40px strip while loading so nothing jumps down when the text arrives
  if (!text) return isPending ? <div className="announce" aria-hidden="true" /> : null
  return <div className="announce">{text}</div>
}
