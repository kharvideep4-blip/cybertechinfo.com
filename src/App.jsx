import { Component, useEffect, useRef, useState } from 'react'
import { Routes, Route, Link, useLocation, useParams, Navigate } from 'react-router-dom'
import { Phone, Mail, ImagePlus, MapPin, ChevronDown, Menu as MenuIcon, X, ArrowUpRight, Check, Quote, ShieldCheck, Calculator, Factory, Gem, Wrench, Stethoscope, Store, GraduationCap, Warehouse, Hotel, Landmark, HardHat, ShoppingBag } from 'lucide-react'
import data from './content.json'
import IMG from './images.js'
class Boundary extends Component {
  state = { err: null }
  static getDerivedStateFromError(err) { return { err } }
  componentDidUpdate(prev) { if (prev.path !== this.props.path && this.state.err) this.setState({ err: null }) }
  render() {
    if (!this.state.err) return this.props.children
    return <div className="mx-auto max-w-xl px-5 py-32 text-center"><h2 className="font-display text-3xl font-bold">Something went wrong on this page</h2><p className="mt-3 text-ink/70">{String(this.state.err.message || this.state.err)}</p><a href="/" className="btn mt-6 bg-sun text-white">Go to Home</a></div>
  }
}
function Img({ k, alt = '', className = '' }) {
  if (IMG[k]) return <img src={IMG[k]} alt={alt} loading="lazy" className={className} />
  return <div role="img" aria-label={alt} className={`ph grid place-items-center ${className}`}><div className="text-center"><ImagePlus className="mx-auto" size={22} /><p className="mt-1 text-[11px] font-medium">Add image: {k}</p></div></div>
}

const PHONE = '+91-22-61473555'
const IND = data.industries
const ICON = { finance: Calculator, manufacturing: Factory, diamond: Gem, service: Wrench, healthcare: Stethoscope, retail: Store, schools: GraduationCap, wholesale: Warehouse, hotels: Hotel, egov: Landmark, construction: HardHat, ecommerce: ShoppingBag }
const OFFICES = [
  { city: 'Mumbai (Head Office)', addr: '30/235-B, Old Anand Nagar, Lane - 2, Nr. Vakola Police Station, Vakola, Santacruz (E), Mumbai - 400055.', tel: '+91-22-61473555 (5 Lines)', mail: 'info@cybertechinfo.com' },
  { city: 'Pune', addr: 'Shop No. 84, 1st Floor, Light House, Bibwewadi Kondhava Road, Market Yard, Pune - 411037.', tel: '+91-99222 88218', mail: 'pune@cybertechinfo.com' },
  { city: 'Ahmedabad', addr: '209, University Plaza, Nr. Rasranjan Sweets, Above Chocolate Room, Vijay Cross Road, Navrangpura, Ahmedabad - 380009.', tel: '+91-96876 61767', mail: 'ahmedabad@cybertechinfo.com' },
  { city: 'Surat', addr: 'B-305, 2nd Floor, Padam Arcade, Nr. Handloom House, Nanpura, Surat - 395001.', tel: '+91-9033009140', mail: 'surat@cybertechinfo.com' },
]
const ABOUT_MENU = [['About Us', '/about'], ['Technology Partners', '/technology-partners'], ['Industry Association', '/industry-association'], ['Offices and Contact Info', '/contact']]

/* ---------- hooks & small helpers ---------- */
function useInView(once = true) {
  const ref = useRef(null); const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < innerHeight && r.bottom > 0) setV(true) // already on screen: never start hidden
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); if (once) io.disconnect() } }, { threshold: 0.05 })
    io.observe(el)
    const safety = setTimeout(() => setV(true), 2500) // never leave content invisible
    return () => { io.disconnect(); clearTimeout(safety) }
  }, [once]); return [ref, v]
}
const Reveal = ({ children, delay = 0, className = '' }) => {
  const [ref, v] = useInView()
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`rv ${v ? 'in' : ''} ${className}`}>{children}</div>
}
function Count({ to, suffix = '+' }) {
  const [ref, v] = useInView(); const [n, setN] = useState(0)
  useEffect(() => {
    if (!v) return; let s; const step = (t) => { s ??= t; const p = Math.min((t - s) / 1600, 1); setN(Math.round(to * (1 - Math.pow(1 - p, 3)))); p < 1 && requestAnimationFrame(step) }
    requestAnimationFrame(step)
  }, [v, to]); return <span ref={ref}>{n.toLocaleString('en-IN')}{suffix}</span>
}
const spot = (e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`) }
const useTitle = (t) => useEffect(() => { document.title = `${t} – The CyberTech` }, [t])
const Btn = ({ to, href, dark, children }) => {
  const c = `btn ${dark ? 'bg-ink text-white hover:bg-brand' : 'bg-sun text-white hover:bg-ink'}`
  return to ? <Link to={to} className={c}>{children}</Link> : <a href={href} className={c}>{children}</a>
}

/* ---------- layout ---------- */
function Dropdown({ label, items, pathname }) {
  const [o, setO] = useState(false); const box = useRef(null); const t = useRef(0)
  useEffect(() => { setO(false) }, [pathname])
  useEffect(() => {
    if (!o) return
    const away = (e) => { if (!box.current?.contains(e.target)) setO(false) }
    const esc = (e) => { if (e.key === 'Escape') setO(false) }
    document.addEventListener('pointerdown', away); document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc) }
  }, [o])
  useEffect(() => () => clearTimeout(t.current), [])
  // hover only for real mouse; touch/keyboard use click
  const hover = (v) => (e) => { if (e.pointerType !== 'mouse') return; clearTimeout(t.current); t.current = setTimeout(() => setO(v), v ? 0 : 120) }
  const click = (e) => { if (e.detail > 0 && e.nativeEvent.pointerType === 'mouse') return; setO((x) => !x) }
  return (
    <div ref={box} className="relative" onPointerEnter={hover(true)} onPointerLeave={hover(false)}>
      <button aria-expanded={o} aria-haspopup="true" onClick={click} className="group flex items-center gap-1 rounded-full px-4 py-2 font-medium transition hover:bg-ink/5">
        {label}<ChevronDown size={16} className={`transition ${o ? 'rotate-180' : ''}`} />
      </button>
      {o && (
        <div className="absolute left-0 top-full z-50 pt-2"><div className="animate-pageIn grid w-max max-w-[92vw] gap-1 rounded-3xl border border-line bg-white p-3 shadow-2xl shadow-ink/10 sm:grid-cols-2">
          {items.map(([t, to, Ic]) => (
            <Link key={to} to={to} onClick={() => setO(false)} className="group/i flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-paper">
              {Ic && <span className="grid size-9 place-items-center rounded-lg bg-paper text-brand transition group-hover/i:bg-brand group-hover/i:text-white"><Ic size={18} /></span>}
              <span className="font-medium transition group-hover/i:translate-x-0.5">{t}</span>
            </Link>))}
        </div></div>)}
    </div>)
}
function Navbar() {
  const { pathname } = useLocation(); const [m, setM] = useState(false); useEffect(() => setM(false), [pathname])
  const bar = useRef(null)
  useEffect(() => {
    let raf = 0
    const f = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; const h = document.documentElement.scrollHeight - innerHeight; if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})` }) }
    addEventListener('scroll', f, { passive: true }); return () => { removeEventListener('scroll', f); cancelAnimationFrame(raf) }
  }, [])
  const ind = IND.map((d) => [d.name, `/industries/${d.slug}`, ICON[d.slug]]); const prod = IND.map((d) => [d.product, `/products/${d.slug}`, ICON[d.slug]])
  return (
    <header className="sticky top-3 z-50 mx-auto mt-3 w-[min(94%,80rem)] rounded-[2rem] border border-white/70 bg-white/95 shadow-xl shadow-ink/10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]"><div ref={bar} className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand to-sun will-change-transform" /></div>
      <div className="mx-auto flex h-16 items-center justify-between px-5">
        <Link to="/" aria-label="The CyberTech home"><img src="/img/logo.png" alt="The CyberTech" className="h-12 transition hover:scale-105" /></Link>
        <nav className="hidden items-center gap-1 lg:flex">
          <Link to="/" className="rounded-full px-4 py-2 font-medium transition hover:bg-ink/5">Home</Link>
          <Dropdown label="Industries" items={ind} pathname={pathname} />
          <Dropdown label="Products" items={prod} pathname={pathname} />
          <Link to="/resources" className="rounded-full px-4 py-2 font-medium transition hover:bg-ink/5">Resources</Link>
          <Dropdown label="About" items={ABOUT_MENU} pathname={pathname} />
        </nav>
        <div className="flex items-center gap-3">
          <a href={`tel:${PHONE}`} className="hidden items-center gap-2 text-sm font-semibold xl:flex"><Phone size={16} className="text-sun" />{PHONE}</a>
          <Link to="/contact" className="btn hidden bg-ink text-white hover:bg-brand sm:inline-flex">Contact Us</Link>
          <button className="grid size-11 place-items-center rounded-full border border-line lg:hidden" onClick={() => setM(!m)} aria-label="Menu">{m ? <X /> : <MenuIcon />}</button>
        </div>
      </div>
      {m && (
        <div className="animate-pageIn max-h-[80vh] overflow-auto rounded-b-[2rem] border-t border-line bg-white px-5 py-4 lg:hidden">
          <Link to="/" className="block py-3 font-semibold">Home</Link>
          {[['Industries', ind], ['Products', prod], ['About', ABOUT_MENU]].map(([l, it]) => (
            <details key={l} className="border-t border-line py-1"><summary className="cursor-pointer py-3 font-semibold">{l}</summary>
              {it.map(([t, to]) => <Link key={to} to={to} className="block py-2 pl-3 text-ink/80">{t}</Link>)}</details>))}
          <Link to="/resources" className="block border-t border-line py-3 font-semibold">Resources</Link>
          <Link to="/contact" className="btn mt-2 w-full justify-center bg-sun text-white">Contact Us</Link>
        </div>)}
    </header>)
}
function Footer() {
  const col = (t, items) => <div><h4 className="mb-4 font-display text-lg font-semibold text-white">{t}</h4><ul className="space-y-2.5">{items.map(([l, to]) => <li key={to}><Link to={to} className="text-white/65 transition hover:pl-1 hover:text-sun">{l}</Link></li>)}</ul></div>
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.3fr_1fr]">
       <div><img src="/img/logo.png" alt="The CyberTech" className="h-24 w-auto rounded-2xl bg-white p-2 object-contain sm:h-28" />
          <p className="mt-5 max-w-xs text-white/65">Leaders in ERP and CRM software, since 1992.</p>
          <a href={`tel:${PHONE}`} className="mt-5 inline-flex items-center gap-2 font-semibold transition hover:text-sun"><Phone size={18} />{PHONE}</a></div>
        {col('Industries', IND.map((d) => [d.name, `/industries/${d.slug}`]))}
        {col('Products', IND.map((d) => [d.product, `/products/${d.slug}`]))}
        {col('The CyberTech', [...ABOUT_MENU, ['Resources', '/resources']])}
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-white/55">Copyright © 2026 The CyberTech. All rights reserved.</div>
    </footer>)
}
function PageHero({ img, title, crumbs }) {
  return (
    <section className="aurora relative isolate -mt-[88px] overflow-hidden pt-[88px]">
      {IMG[img] && <img src={IMG[img]} alt="" className="absolute inset-0 -z-10 size-full object-cover opacity-45" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
        <p className="animate-pageIn text-sm text-white/70">{crumbs.map(([l, to], i) => <span key={l}>{i > 0 && ' / '}{to ? <Link to={to} className="transition hover:text-sun">{l}</Link> : l}</span>)}</p>
        <h1 className="animate-pageIn mt-3 max-w-3xl font-display text-4xl font-bold text-white [animation-delay:.1s] sm:text-6xl">{title}</h1>
      </div>
    </section>)
}
const Cta = () => (
  <section className="mx-auto mt-20 max-w-7xl px-5"><div className="aurora relative overflow-hidden rounded-[2.5rem] px-8 py-14 text-white sm:px-14">
    <div className="cells-old absolute inset-0 opacity-0" />
    <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
      <h2 className="max-w-xl font-display text-3xl font-bold sm:text-4xl">Grow Your Business. Get More Clients.</h2>
      <div className="flex flex-wrap gap-3"><Btn to="/contact">Contact Us</Btn><a href={`tel:${PHONE}`} className="btn bg-white text-ink hover:bg-ink hover:text-white"><Phone size={18} />{PHONE}</a></div>
    </div></div></section>)

/* ---------- home ---------- */
function ErpWindow() {
  const [i, setI] = useState(0)
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % IND.length), 3200); return () => clearInterval(t) }, [])
  const d = IND[i]
  return (
    <div className="relative">
      <div className="animate-float overflow-hidden rounded-3xl border border-line bg-white shadow-2xl shadow-brand/20">
        <div className="flex items-center gap-2 border-b border-line bg-paper px-4 py-3">
          <i className="size-3 rounded-full bg-red-400" /><i className="size-3 rounded-full bg-amber-400" /><i className="size-3 rounded-full bg-emerald-400" />
          <span className="ml-3 rounded-md bg-white px-3 py-1 text-xs font-semibold text-ink/70">The CyberTech ERP / {d.name}</span>
        </div>
        <div className="grid grid-cols-[52px_1fr]">
          <div className="flex flex-col items-center gap-1.5 border-r border-line bg-paper py-3">
            {IND.slice(0, 7).map((x, k) => { const Ic = ICON[x.slug]; return <button key={x.slug} onClick={() => setI(k)} aria-label={x.name} className={`grid size-9 place-items-center rounded-lg transition ${k === i ? 'bg-brand text-white' : 'text-ink/50 hover:bg-white hover:text-brand'}`}><Ic size={17} /></button> })}
          </div>
          <div className="p-4">
            <div className="relative h-52 overflow-hidden rounded-xl sm:h-60">
              {IND.map((x, k) => <Img key={x.slug} k={`s-${x.slug}`} alt={x.name} className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${k === i ? 'opacity-100' : 'opacity-0'}`} />)}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4 pt-12 text-white"><p className="font-display text-lg font-semibold">{d.name}</p><p className="line-clamp-2 text-sm text-white/80">{d.tag}</p></div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {['Accounts', 'Inventory', 'CRM'].map((l, k) => (
                <div key={l} className="rounded-lg border border-line p-3"><p className="text-xs font-semibold text-ink/60">{l}</p>
                  <div className="mt-2 flex h-10 items-end gap-1">{[40, 70, 55, 90, 65, 100].map((h, j) => <span key={j} style={{ height: `${h - k * 12}%`, animationDelay: `${j * 90 + k * 200}ms` }} className="animate-grow w-full origin-bottom rounded-sm bg-gradient-to-t from-brand to-sun/80" />)}</div></div>))}
            </div>
          </div>
        </div>
      </div>
    </div>)
}
function Home() {
  useTitle('Leaders in ERP and CRM Software'); const t = data.testimonials; const h = data.home
  return (<>
    <section className="aurora relative -mt-[88px] overflow-hidden pt-[88px] text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-14 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
        <div className="animate-pageIn">
          <p className="inline-block rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white">Leaders in ERP and CRM software</p>
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.98] tracking-tight sm:text-7xl xl:text-8xl">Smart Software <span className="bg-gradient-to-r from-sky-300 via-violet-300 to-orange-300 bg-clip-text text-transparent">Solutions</span></h1>
          <p className="mt-6 font-display text-2xl font-semibold text-sun sm:text-3xl">Grow Your Business.<br />Get More Clients.</p>
          <p className="mt-6 max-w-lg text-lg text-white/70">{h.since}</p>
          <div className="mt-8 flex flex-wrap gap-3"><Btn href="#industries">Explore Industries</Btn><Link to="/contact" className="btn border border-white/25 bg-white/10 text-white hover:bg-white hover:text-ink">Contact Us</Link></div>
        </div>
        <ErpWindow />
      </div>
    </section>
    <div className="group overflow-hidden border-t border-white/10 bg-ink py-5">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-lg font-semibold text-white/60 group-hover:[animation-play-state:paused]">
        {[...IND, ...IND].map((d, k) => <span key={k} className="flex items-center gap-10">{d.name}<i className="size-1.5 rounded-full bg-sun" /></span>)}
      </div>
    </div>
    <section id="industries" className="mx-auto max-w-7xl scroll-mt-24 px-5 pt-24">
      <h2 className="max-w-2xl font-display text-4xl font-bold sm:text-5xl">ERP Solutions for various industries</h2>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {IND.map((d, k) => { const Ic = ICON[d.slug]; return (
          <Reveal key={d.slug} delay={(k % 4) * 80} className={`h-full ${[0, 5, 10, 11].includes(k) ? "lg:col-span-2" : ""}`}>
            <Link to={`/industries/${d.slug}`} onMouseMove={spot} className="spot group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition duration-300 hover:-translate-y-1.5 hover:border-sun/60 hover:shadow-xl hover:shadow-ink/10">
              <div className="aspect-[16/10] overflow-hidden"><Img k={`s-${d.slug}`} alt={d.name} className="size-full object-cover transition duration-700 group-hover:scale-110" /></div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-brand"><Ic size={18} /><h3 className="font-display text-lg font-semibold text-ink">{d.name}</h3></div>
                <p className="mt-2 flex-1 text-sm leading-6 text-ink/70">{d.tag}</p>
                <span className="mt-4 inline-flex items-center gap-1 font-semibold text-brand">Read more <ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-1" /></span>
              </div></Link></Reveal>) })}
      </div>
    </section>
    <section className="mx-auto mt-28 grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2">
      <Reveal>
        <h2 className="font-display text-4xl font-bold sm:text-5xl">The CyberTech: Industry leader since 1992.</h2>
        <p className="mt-6 text-lg text-ink/75">{h.since}</p>
        <div className="mt-8"><Btn to="/about" dark>About Us</Btn></div>
      </Reveal>
      <Reveal delay={150}><div className="grid grid-cols-2 gap-4">
        {[[30, 'Years Experience'], [1500, 'Happy Users'], [100, 'Team members'], [12, 'Offices in India']].map(([n, l], k) => (
          <div key={l} className={`rounded-3xl p-6 transition hover:-translate-y-1 ${k % 3 === 0 ? 'bg-ink text-white' : 'border border-line bg-white'}`}>
            <p className="font-display text-5xl font-bold"><Count to={n} /></p><p className={`mt-1 ${k % 3 === 0 ? 'text-white/70' : 'text-ink/65'}`}>{l}</p></div>))}
      </div></Reveal>
    </section>
    <section className="mx-auto mt-24 grid max-w-7xl gap-5 px-5 lg:grid-cols-2">
      <Reveal className="h-full"><div onMouseMove={spot} className="spot h-full rounded-3xl border border-line bg-white p-8 transition hover:border-sun/60 sm:p-10">
        <h3 className="font-display text-2xl font-bold">Vast product range:</h3>
        {h.vast.map((p) => <p key={p} className="mt-4 text-ink/75">{p}</p>)}</div></Reveal>
      <Reveal delay={120} className="h-full"><div onMouseMove={spot} className="spot relative h-full overflow-hidden rounded-3xl bg-ink p-8 text-white sm:p-10">
        <ShieldCheck className="text-sun" size={32} /><h3 className="mt-3 max-w-xs font-display text-2xl font-bold">Reliable security solutions provider:</h3>
        {h.security.map((p) => <p key={p} className="mt-4 text-white/75">{p}</p>)}</div></Reveal>
    </section>
    <section className="mx-auto mt-24 grid max-w-7xl gap-5 px-5 md:grid-cols-2">
      {t.map((x, k) => (
        <Reveal key={x.name} delay={k * 120} className="h-full"><figure onMouseMove={spot} className="spot h-full rounded-3xl border border-line bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10">
          <Quote className="text-sun" size={36} /><blockquote className="mt-4 text-lg leading-8">{x.q.replace('mange', 'manage')}</blockquote>
          <figcaption className="mt-6"><p className="font-display text-lg font-semibold">{x.name}</p><p className="text-sm text-ink/65">{x.role}, {x.co}, {x.city}</p></figcaption></figure></Reveal>))}
    </section>
    <Cta />
  </>)
}

/* ---------- inner pages ---------- */
function Industry({ kind }) {
  const { slug } = useParams(); const i = IND.findIndex((d) => d.slug === slug); const d = IND[i]
  useTitle(d ? (kind === 'products' ? d.product : d.name) : '')
  if (!d) return <Navigate to="/" replace />
  const label = kind === 'products' ? d.product : d.name; const next = IND[(i + 1) % IND.length]; const prev = IND[(i + IND.length - 1) % IND.length]
  return (<>
    <PageHero img={`b-${d.slug}`} title={label} crumbs={[['Home', '/'], [kind === 'products' ? 'Products' : 'Industries', null], [label, null]]} />
    <div className="mx-auto mt-14 grid max-w-7xl gap-12 px-5 lg:grid-cols-[1fr_320px]">
      <article key={slug} className="animate-pageIn max-w-3xl">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">{d.h1}</h2>
        {d.lead && <p className="mt-3 font-display text-xl font-semibold text-brand">{d.lead}</p>}
        {d.blocks.map((b, k) => b.t === 'p' ? <p key={k} className="mt-6 text-lg leading-8 text-ink/80">{b.x}</p>
          : b.t === 'h' ? <h3 key={k} className="mt-12 font-display text-2xl font-bold">{b.x}</h3>
          : <ul key={k} className="mt-6 grid gap-3 sm:grid-cols-2">{b.x.map((li) => <li key={li} className="flex items-start gap-3 rounded-xl border border-line bg-white p-3.5 transition hover:border-brand hover:shadow-md"><Check size={18} className="mt-0.5 shrink-0 text-sun" />{li}</li>)}</ul>)}
        <div className="mt-14 flex justify-between gap-4 border-t border-line pt-6 text-sm font-semibold">
          <Link to={`/${kind}/${prev.slug}`} className="transition hover:text-brand">← {kind === 'products' ? prev.product : prev.name}</Link>
          <Link to={`/${kind}/${next.slug}`} className="text-right transition hover:text-brand">{kind === 'products' ? next.product : next.name} →</Link></div>
      </article>
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border border-line bg-white p-3">{IND.map((x) => { const Ic = ICON[x.slug]; return (
          <Link key={x.slug} to={`/${kind}/${x.slug}`} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:translate-x-1 ${x.slug === slug ? 'bg-ink text-white' : 'hover:bg-paper'}`}><Ic size={16} className={x.slug === slug ? 'text-sun' : 'text-brand'} />{kind === 'products' ? x.product : x.name}</Link>) })}</div>
        <div className="mt-4 rounded-3xl bg-brand p-6 text-white"><p className="font-display text-xl font-bold">Get More Clients</p>
          <a href={`tel:${PHONE}`} className="mt-3 flex items-center gap-2 font-semibold hover:text-sun"><Phone size={16} />{PHONE}</a>
          <a href="mailto:info@cybertechinfo.com" className="mt-2 flex items-center gap-2 text-sm hover:text-sun"><Mail size={16} />info@cybertechinfo.com</a></div>
      </aside>
    </div>
    <Cta />
  </>)
}
function About() {
  useTitle('About Us')
  return (<>
    <PageHero img="p-about" title="About Us" crumbs={[['Home', '/'], ['About Us', null]]} />
    <div className="mx-auto mt-14 grid max-w-7xl gap-12 px-5 lg:grid-cols-[1fr_340px]">
      <div className="max-w-3xl"><h2 className="font-display text-3xl font-bold sm:text-4xl">About The CyberTech</h2>
        {data.about.map((p) => <p key={p} className="mt-6 text-lg leading-8 text-ink/80">{p}</p>)}</div>
      <div className="space-y-4">
        {[[30, 'Years Experience'], [1500, 'Happy Users'], [100, 'Team members'], [12, 'Offices in India']].map(([n, l]) => <div key={l} className="flex items-baseline gap-3 rounded-3xl bg-ink p-5 text-white transition hover:bg-brand"><p className="font-display text-4xl font-bold"><Count to={n} /></p><p className="text-white/75">{l}</p></div>)}
      </div>
    </div><Cta />
  </>)
}
function Contact() {
  useTitle('Offices and Contact Info')
  return (<>
    <PageHero img="p-contact" title="Offices and Contact Info" crumbs={[['Home', '/'], ['Offices and Contact Info', null]]} />
    <section className="mx-auto mt-14 max-w-7xl px-5"><h2 className="font-display text-3xl font-bold sm:text-4xl">The CyberTech Offices &amp; Contact information</h2>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {OFFICES.map((o, k) => (
          <div key={o.city} onMouseMove={spot} className={`spot rounded-3xl border p-8 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10 ${k === 0 ? 'border-ink bg-ink text-white md:col-span-2' : 'border-line bg-white'}`}>
            <h3 className="flex items-center gap-2 font-display text-2xl font-bold"><MapPin className="text-sun" />{o.city}</h3>
            <p className={`mt-4 max-w-xl ${k === 0 ? 'text-white/80' : 'text-ink/75'}`}>{o.addr}</p>
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-semibold">
              <a href={`tel:${o.tel.replace(/[^\d+]/g, '')}`} className="flex items-center gap-2 hover:text-sun"><Phone size={16} />{o.tel}</a>
              <a href={`mailto:${o.mail}`} className="flex items-center gap-2 hover:text-sun"><Mail size={16} />{o.mail}</a></div>
          </div>))}
      </div></section>
  </>)
}
function Simple({ title, img, line, showProducts }) {
  useTitle(title)
  return (<>
    <PageHero img={img} title={title} crumbs={[['Home', '/'], [title, null]]} />
    <section className="mx-auto mt-14 max-w-7xl px-5">
      {line && <p className="max-w-2xl font-display text-2xl font-semibold">{line}</p>}
      {showProducts && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{IND.map((d) => { const Ic = ICON[d.slug]; return <Link key={d.slug} to={`/products/${d.slug}`} className="group flex items-center gap-3 rounded-3xl border border-line bg-white p-4 font-semibold transition hover:-translate-y-1 hover:border-brand hover:shadow-lg"><span className="grid size-10 place-items-center rounded-xl bg-paper text-brand transition group-hover:bg-brand group-hover:text-white"><Ic size={18} /></span>{d.product}</Link> })}</div>}
    </section><Cta />
  </>)
}
export default function App() {
  const { pathname } = useLocation(); useEffect(() => { scrollTo({ top: 0, left: 0, behavior: 'instant' }) }, [pathname])
  return (<>
    <Navbar />
    <main key={pathname.split('/').slice(0, 3).join('/')} className="animate-pageIn">
      <Boundary path={pathname}><Routes>
        <Route path="/" element={<Home />} />
        <Route path="/industries/:slug" element={<Industry kind="industries" />} />
        <Route path="/products/:slug" element={<Industry kind="products" />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/technology-partners" element={<Simple title="Technology Partners" img="p-partners" line="Details about our technology partners." />} />
        <Route path="/industry-association" element={<Simple title="Industry Association" img="p-assoc" line="Details about our association with different industry associations." />} />
        <Route path="/resources" element={<Simple title="Resources" img="p-resources" showProducts />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes></Boundary>
    </main>
    <Footer />
  </>)
}
