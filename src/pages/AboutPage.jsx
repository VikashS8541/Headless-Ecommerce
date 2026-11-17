import Layout from '../components/layout/Layout.jsx'
import Html from '../components/ui/Html.jsx'
import SmartLink from '../components/ui/SmartLink.jsx'
import { usePage, useSite } from '../api/hooks.js'

// All text and pictures come from WordPress: Aurelo Content > About page. Empty parts are not shown.
// If a WordPress Page with the slug "about" has content, it is shown at the end.

const OVERLINE = 'font-body text-xs font-semibold leading-4 tracking-[.14em] uppercase text-accent-strong'
const SECTION = 'pt-12 pb-12 md:pt-16 md:pb-16 lg:pt-24 lg:pb-24'
const WRAP = 'mx-auto w-full max-w-[1320px] px-4 md:px-6 lg:px-8'
const VALUE_ICONS = [
  <path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15zM5 19l8-8" />,
  <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="m9 12 2 2 4-4" /></>,
  <path d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4" />,
]

export default function AboutPage() {
  const { data: site } = useSite()
  const { data: page } = usePage('about')
  const o = site?.options || {}
  const values = [1, 2, 3].map(n => ({ n, title: o[`about_v${n}_title`], text: o[`about_v${n}_text`] })).filter(v => v.title || v.text)
  const stats = [1, 2, 3, 4].map(n => ({ n, value: o[`about_s${n}_value`], label: o[`about_s${n}_label`] })).filter(s => s.value || s.label)
  const gallery = [o.about_gallery1, o.about_gallery2, o.about_gallery3].filter(Boolean)
  const pageHtml = page?.content?.rendered?.trim()
  const hasTop = o.about_overline || o.about_title || o.about_text
  const hasValuesHead = o.about_values_overline || o.about_values_title
  const hasCta = o.about_cta_title || o.about_cta_label

  return (
    <Layout>
      {(hasTop || o.about_image) && (
        <section className="pg-hero py-12 md:py-16 lg:py-24">
          <div className={`${WRAP} grid grid-cols-1 items-center gap-8 ${hasTop && o.about_image ? 'lg:grid-cols-[1fr_1fr] lg:gap-16' : ''}`}>
            {hasTop && (
              <div className="flex flex-col items-start gap-4">
                {o.about_overline && <span className={OVERLINE}>{o.about_overline}</span>}
                {o.about_title && <h1 className="display text-[39px] leading-[47px] lg:text-[56px] lg:leading-[62px]">{o.about_title}</h1>}
                {o.about_text && <p className="text-[18px] leading-[30px] text-ink-muted">{o.about_text}</p>}
              </div>
            )}
            {o.about_image && <img src={o.about_image} alt="" width="1200" height="900" loading="lazy" decoding="async" className="h-auto aspect-[4/3] w-full rounded-sm object-cover" />}
          </div>
        </section>
      )}

      {values.length > 0 && (
        <section className={SECTION}>
          <div className={WRAP}>
            {hasValuesHead && (
              <div className="mb-10">
                {o.about_values_overline && <span className={OVERLINE}>{o.about_values_overline}</span>}
                {o.about_values_title && <h2 className="h2 mt-2">{o.about_values_title}</h2>}
              </div>
            )}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {values.map(v => (
                <div className="card" key={v.n}>
                  <div className="benefit">
                    <div className="ring">
                      <svg className="ic" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{VALUE_ICONS[v.n - 1]}</svg>
                    </div>
                    <div>
                      {v.title && <b className="h5">{v.title}</b>}
                      {v.text && <p className="mt-2 text-sm leading-[22px] text-ink-muted">{v.text}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {stats.length > 0 && (
        <section className={`${SECTION} bg-surface-warm`}>
          <div className={WRAP}>
            <div className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
              {stats.map(s => (
                <div key={s.n}>
                  {s.value && <div className="display text-[39px] lg:text-[56px]">{s.value}</div>}
                  {s.label && <p className="text-ink-muted">{s.label}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className={SECTION}>
          <div className={WRAP}>
            <div className={`grid grid-cols-1 gap-6 ${gallery.length === 3 ? 'lg:grid-cols-[2fr_1fr_1fr]' : gallery.length === 2 ? 'lg:grid-cols-2' : ''}`}>
              {gallery.map((src, i) => (
                <img key={src} src={src} alt="" loading="lazy" decoding="async" className={`h-auto w-full rounded-sm object-cover ${i === 0 && gallery.length === 3 ? 'aspect-[4/3]' : 'aspect-[3/4]'}`} />
              ))}
            </div>
          </div>
        </section>
      )}

      {pageHtml && (
        <section className={SECTION}>
          <div className={WRAP}>
            <Html className="legal" html={page.content.rendered} />
          </div>
        </section>
      )}

      {hasCta && (
        <section className={`${SECTION} bg-surface-beige`}>
          <div className={WRAP}>
            <div className="flex flex-col items-center gap-4 text-center">
              {o.about_cta_title && <h2 className="display text-[28px] lg:text-[40px]">{o.about_cta_title}</h2>}
              {o.about_cta_label && <SmartLink className="btn btn-primary btn-lg" to={o.about_cta_link}>{o.about_cta_label}</SmartLink>}
            </div>
          </div>
        </section>
      )}
    </Layout>
  )
}
