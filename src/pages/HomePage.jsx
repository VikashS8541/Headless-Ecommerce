import { Link } from 'react-router'
import Layout from '../components/layout/Layout.jsx'
import ProductGrid from '../components/ui/ProductGrid.jsx'
import SmartLink from '../components/ui/SmartLink.jsx'
import NewsletterForm from '../components/ui/NewsletterForm.jsx'
import { useCategories, useProducts, useSite, useTestimonials } from '../api/hooks.js'
import { stripHtml } from '../lib/format.js'

// Every piece of text and every picture on this page comes from WordPress (Aurelo Content, Testimonials,
// WooCommerce). A part that is empty in WordPress is not shown at all.

const OVERLINE = 'font-body text-xs font-semibold leading-4 tracking-[.14em] uppercase text-accent-strong'
const SECTION = 'pt-12 pb-12 md:pt-16 md:pb-16 lg:pt-24 lg:pb-24'
const WRAP = 'mx-auto w-full max-w-[1320px] px-4 md:px-6 lg:px-8'

const Ico = ({ children, size = 22 }) => (
  <svg className="ic" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
)

const BENEFIT_ICONS = [
  <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
  <><path d="M4 12a8 8 0 1 0 3-6.2" /><path d="M4 4v4h4" /></>,
  <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="m9 12 2 2 4-4" /></>,
  <path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15zM5 19l8-8" />,
]

function SectionHead({ overline, title, linkLabel, linkTo = '/shop' }) {
  if (!overline && !title && !linkLabel) return null
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        {overline && <span className={OVERLINE}>{overline}</span>}
        {title && <h2 className="h2 mt-2">{title}</h2>}
      </div>
      {linkLabel && <Link className="btn btn-ghost" to={linkTo}>{linkLabel}</Link>}
    </div>
  )
}

function ProductSection({ overline, title, linkLabel, params, warm }) {
  const { data, isLoading, isError } = useProducts({ per_page: 4, ...params })
  if (!isLoading && !isError && !data?.items?.length) return null
  return (
    <section className={`${SECTION} ${warm ? 'bg-surface-warm' : ''}`}>
      <div className={WRAP}>
        <SectionHead overline={overline} title={title} linkLabel={linkLabel} />
        <ProductGrid products={data?.items} loading={isLoading} error={isError} />
      </div>
    </section>
  )
}

export default function HomePage() {
  const { data: site } = useSite()
  const o = site?.options || {}
  const { data: cats } = useCategories()
  const { data: testimonials } = useTestimonials()

  const topCats = (cats || []).filter(c => !c.parent && c.count > 0).sort((a, b) => b.count - a.count).slice(0, 4)
  const quotes = (testimonials || []).map(t => ({ id: t.id, name: stripHtml(t.title.rendered), city: t.meta?.city, quote: stripHtml(t.content.rendered) })).filter(t => t.quote)
  const benefits = [1, 2, 3, 4].map(n => ({ n, title: o[`benefit${n}_title`], text: o[`benefit${n}_text`] })).filter(b => b.title || b.text)
  const insta = [1, 2, 3, 4, 5, 6].map(n => o[`insta${n}_image`]).filter(Boolean)

  const hasHero = o.hero_eyebrow || o.hero_title || o.hero_text || o.hero_cta1_label || o.hero_cta2_label || o.hero_image
  const hasHeroText = o.hero_eyebrow || o.hero_title || o.hero_text || o.hero_cta1_label || o.hero_cta2_label
  const hasPromo = o.promo_overline || o.promo_title || o.promo_text || o.promo_cta_label || o.promo_image
  const hasPromoText = o.promo_overline || o.promo_title || o.promo_text || o.promo_cta_label
  const hasEditorial = o.editorial_overline || o.editorial_title || o.editorial_text || o.editorial_cta_label || o.editorial_image
  const hasEditorialText = o.editorial_overline || o.editorial_title || o.editorial_text || o.editorial_cta_label
  const hasNewsletter = o.newsletter_overline || o.newsletter_title || o.newsletter_text

  return (
    <Layout>
      {/* Hero: Aurelo Content > Home: hero */}
      {hasHero && (
        <section className={`grid min-h-[640px] grid-cols-1 bg-surface-warm ${hasHeroText && o.hero_image ? 'lg:grid-cols-2' : ''}`}>
          {hasHeroText && (
            <div className="hero-t !px-4 !py-12 md:!px-8 lg:!py-24 lg:!pl-[120px] lg:!pr-16">
              {o.hero_eyebrow && <span className={OVERLINE}>{o.hero_eyebrow}</span>}
              {o.hero_title && <h1 className="display text-[50px] leading-[57px] lg:text-[72px] lg:leading-[76px]">{o.hero_title}</h1>}
              {o.hero_text && <p className="max-w-[460px] text-[18px] leading-[30px] text-ink-muted">{o.hero_text}</p>}
              {(o.hero_cta1_label || o.hero_cta2_label) && (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {o.hero_cta1_label && <SmartLink className="btn btn-primary btn-lg" to={o.hero_cta1_link}>{o.hero_cta1_label}</SmartLink>}
                  {o.hero_cta2_label && <SmartLink className="btn btn-secondary btn-lg" to={o.hero_cta2_link}>{o.hero_cta2_label}</SmartLink>}
                </div>
              )}
            </div>
          )}
          {o.hero_image && <img src={o.hero_image} alt="" width="1200" height="1500" fetchPriority="high" decoding="async" className="h-full max-h-[720px] min-h-[320px] w-full object-cover lg:max-h-none" />}
        </section>
      )}

      {/* Categories: WooCommerce product categories (name, count and picture come from WooCommerce) */}
      {topCats.length > 0 && (
        <section className={SECTION}>
          <div className={WRAP}>
            <SectionHead overline={o.home_cat_overline} title={o.home_cat_title} linkLabel={o.home_cat_link} />
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {topCats.map(c => (
                <Link key={c.id} className="cc" to={`/category/${c.slug}`}>
                  {c.image?.src && <img src={c.image.src} alt="" width="800" height="1000" loading="lazy" decoding="async" className="h-auto aspect-[4/5] max-h-[420px] w-full rounded-md object-cover" />}
                  <div className="cc-b">
                    <div>
                      <b>{stripHtml(c.name)}</b>
                      <br />
                      <span>{c.count} {c.count === 1 ? 'piece' : 'pieces'}</span>
                    </div>
                    <Ico size={18}><path d="m9 6 6 6-6 6" /></Ico>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ProductSection warm overline={o.new_overline} title={o.new_title} linkLabel={o.home_view_all} params={{ orderby: 'date', order: 'desc' }} />
      <ProductSection overline={o.best_overline} title={o.best_title} linkLabel={o.home_view_all} params={{ orderby: 'popularity', order: 'desc' }} />

      {/* Promo: Aurelo Content > Home: promo banner */}
      {hasPromo && (
        <section className={`${SECTION} bg-surface-warm`}>
          <div className={WRAP}>
            <div className={`promo !grid-cols-1 ${hasPromoText && o.promo_image ? 'lg:!grid-cols-[1.1fr_1fr]' : ''}`}>
              {hasPromoText && (
                <div className="promo-t !p-6 md:!p-10 lg:!p-16">
                  {o.promo_overline && <span className={OVERLINE}>{o.promo_overline}</span>}
                  {o.promo_title && <h2 className="display text-[39px] leading-[47px] lg:text-[56px] lg:leading-[62px]">{o.promo_title}</h2>}
                  {o.promo_text && <p className="max-w-[420px] text-ink-muted">{o.promo_text}</p>}
                  {o.promo_cta_label && <SmartLink className="btn btn-primary btn-lg mt-3" to={o.promo_cta_link}>{o.promo_cta_label}</SmartLink>}
                </div>
              )}
              {o.promo_image && <img src={o.promo_image} alt="" width="1400" height="1000" loading="lazy" decoding="async" className="h-full min-h-[240px] w-full object-cover" />}
            </div>
          </div>
        </section>
      )}

      <ProductSection overline={o.trend_overline} title={o.trend_title} linkLabel={o.home_view_all} params={{ orderby: 'rating', order: 'desc' }} />

      {/* Editorial: Aurelo Content > Home: editorial */}
      {hasEditorial && (
        <section className={`${SECTION} bg-surface-warm`}>
          <div className={WRAP}>
            <div className={`grid grid-cols-1 items-center gap-8 ${hasEditorialText && o.editorial_image ? 'lg:grid-cols-[1.2fr_1fr] lg:gap-16' : ''}`}>
              {o.editorial_image && <img src={o.editorial_image} alt="" width="1200" height="900" loading="lazy" decoding="async" className="h-auto aspect-[4/3] w-full rounded-sm object-cover" />}
              {hasEditorialText && (
                <div className="flex flex-col items-start gap-4">
                  {o.editorial_overline && <span className={OVERLINE}>{o.editorial_overline}</span>}
                  {o.editorial_title && <h2 className="display text-[28px] leading-[46px] lg:text-[40px]">{o.editorial_title}</h2>}
                  {o.editorial_text && <p className="text-ink-muted">{o.editorial_text}</p>}
                  {o.editorial_cta_label && <SmartLink className="btn btn-secondary" to={o.editorial_cta_link}>{o.editorial_cta_label}</SmartLink>}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Benefits: Aurelo Content > Home: benefits */}
      {benefits.length > 0 && (
        <section className={SECTION}>
          <div className={WRAP}>
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {benefits.map(b => (
                <div className="benefit" key={b.n}>
                  <div className="ring"><Ico>{BENEFIT_ICONS[b.n - 1]}</Ico></div>
                  <div>
                    {b.title && <b className="h5">{b.title}</b>}
                    {b.text && <p className="mt-2 text-sm leading-[22px] text-ink-muted">{b.text}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials: Testimonials menu in WordPress */}
      {quotes.length > 0 && (
        <section className={`${SECTION} bg-surface-warm`}>
          <div className={WRAP}>
            <SectionHead overline={o.testi_overline} title={o.testi_title} />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {quotes.map(t => (
                <div className="quote" key={t.id}>
                  <p className="text-[17px] leading-[28px]">“{t.quote}”</p>
                  {t.name && (
                    <div className="flex items-center gap-3">
                      <div className="avatar h-10 w-10 text-[14px]">{t.name.charAt(0)}</div>
                      <div>
                        <b className="text-sm leading-[22px]">{t.name}</b>
                        {t.city && <><br /><span className="text-xs leading-[18px] text-ink-muted">{t.city}</span></>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter: Aurelo Content > Home: newsletter */}
      {hasNewsletter && (
        <div className="bg-surface-beige py-12 md:py-16 lg:py-20">
          <div className={`${WRAP} flex flex-col items-center gap-4 text-center`}>
            {o.newsletter_overline && <span className={OVERLINE}>{o.newsletter_overline}</span>}
            {o.newsletter_title && <h2 className="display text-[28px] leading-[46px] lg:text-[40px]">{o.newsletter_title}</h2>}
            {o.newsletter_text && <p className="text-ink-muted">{o.newsletter_text}</p>}
            <NewsletterForm className="mt-3 w-full max-w-[480px]" />
          </div>
        </div>
      )}

      {/* Instagram: Aurelo Content > Home: section headings */}
      {insta.length > 0 && (
        <section className={SECTION}>
          <div className={WRAP}>
            <SectionHead overline={o.insta_overline} title={o.instagram_handle} />
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
              {insta.map(src => <img key={src} src={src} alt="" width="600" height="600" loading="lazy" decoding="async" className="h-auto aspect-[1/1] w-full rounded-sm object-cover" />)}
            </div>
          </div>
        </section>
      )}
    </Layout>
  )
}
