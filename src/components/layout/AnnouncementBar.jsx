import { useSite } from '../../api/hooks.js'

export default function AnnouncementBar() {
  const { data } = useSite()
  const text = data?.options?.announcement_text
  if (!text) return null
  return <div className="announce">{text}</div>
}
