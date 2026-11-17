import Layout from '../components/layout/Layout.jsx'
import { Link } from 'react-router'
import { useSite } from '../api/hooks.js'

// Text comes from WordPress: Aurelo Content > Empty and error pages.
export default function NotFoundPage() {
  const { data } = useSite()
  const o = data?.options || {}
  return (
    <Layout>
      <section className="text-center py-12 md:py-16 lg:py-[128px]">
        <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6 lg:px-8 flex flex-col items-center gap-4">
          {o.notfound_code && <div className="display text-[50px] lg:text-[72px] leading-[57px] lg:leading-[76px]">{o.notfound_code}</div>}
          {o.notfound_title && <h1 className="display text-[28px] lg:text-[40px] leading-[46px]">{o.notfound_title}</h1>}
          {o.notfound_text && <p className="text-ink-muted">{o.notfound_text}</p>}
          {(o.notfound_btn1 || o.notfound_btn2) && (
            <div className="flex items-center gap-3 mt-3">
              {o.notfound_btn1 && <Link className="btn btn-secondary" to="/">{o.notfound_btn1}</Link>}
              {o.notfound_btn2 && <Link className="btn btn-ghost" to="/shop">{o.notfound_btn2}</Link>}
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
