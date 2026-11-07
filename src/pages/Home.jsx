import { Link, useNavigate } from 'react-router-dom';
import { Html, useLang } from '../lib/i18n';
import { Counter, Icon, useUI } from '../lib/ui';
import { conditions, departments, doctors } from '../data/content';
import { SITE } from '../data/site';
import { DoctorCard, Faq } from '../components/Cards';
import { LeadForm } from '../components/Forms';
import { CallButton } from '../components/Layout';

const HEART_PULSE = '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>';

function Head({ eyebrow, title, sub, warm }) {
  const { t } = useLang();
  return (
    <div className="section-head reveal">
      <span className={'eyebrow' + (warm ? ' warm' : '')}>{t(eyebrow)}</span>
      <Html as="h2" html={t(title)} />
      {sub && <p>{t(sub)}</p>}
    </div>
  );
}

function Hero() {
  const { t } = useLang();
  return (
    <section className="hero" id="home">
      <div className="blob b1" /><div className="blob b2" />
      <div className="container">
        <div>
          <span className="eyebrow reveal">{t('hero_eyebrow')}</span>
          <Html as="h1" className="reveal" html={t('hero_title')} />
          <p className="lead reveal">{t('hero_lead')}</p>
          <div className="hero-actions reveal">
            <Link className="btn btn-primary" to="/#contact"><Icon n="cal" /><span>{t('cta_book')}</span></Link>
            <Link className="btn btn-ghost" to="/#doctors">{t('hero_btn2')}</Link>
          </div>
          <div className="hero-stats reveal">
            <div className="stat"><Counter to={12000} suffix="+" /><span>{t('st1')}</span></div>
            <div className="stat"><Counter to={15} suffix="+" /><span>{t('st2')}</span></div>
            <div className="stat"><Counter to={28} /><span>{t('st3')}</span></div>
          </div>
        </div>
        <div className="hero-visual reveal zoom">
          <div className="ring" /><div className="ring r2" />
          <div className="orb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: HEART_PULSE }} /></div>
          <div className="float-card fc1"><div className="ic" style={{ background: '#ccfbf1', color: '#0f766e' }}><Icon n="badge" /></div><div><b>{t('fc1b')}</b><span>{t('fc1s')}</span></div></div>
          <div className="float-card fc2"><div className="ic" style={{ background: '#fef3c7', color: '#b45309' }}><Icon n="truck" /></div><div><b>{t('fc2b')}</b><span>{t('fc2s')}</span></div></div>
          <div className="float-card fc3"><div className="ic" style={{ background: '#e0e7ff', color: '#4338ca' }}><Icon n="shield" /></div><div><b>{t('fc3b')}</b><span>{t('fc3s')}</span></div></div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const { L } = useLang();
  const items = conditions.map((c) => L(c.t));
  return (
    <div className="marquee"><div className="marquee-track">
      {items.concat(items).map((x, i) => <span key={i}>{x}</span>)}
    </div></div>
  );
}

function Departments() {
  const { t, L } = useLang();
  return (
    <section id="conditions">
      <div className="container">
        <Head eyebrow="cond_eyebrow" title="cond_title" sub="cond_sub" />
        <div className="grid g3">
          {departments.map((d, i) => {
            const cs = conditions.filter((c) => c.dept === d.id);
            return (
              <Link key={d.id} to={'/conditions?dept=' + d.id} className="card click dept-card reveal" style={{ transitionDelay: (i % 3) * 90 + 'ms' }}>
                <span className="cnt">{t('conds_n', { n: cs.length })}</span>
                <div className="icon" style={{ background: `linear-gradient(135deg,${d.c},${d.c}cc)` }}><Icon n={d.i} /></div>
                <h3>{L(d.t)}</h3>
                <p>{L(d.d)}</p>
                <div className="mini">{cs.slice(0, 4).map((c) => <span key={c.id}>{L(c.t)}</span>)}</div>
                <span className="more">{t('dept_cta')} <Icon n="arrow" /></span>
              </Link>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }} className="reveal">
          <Link className="btn btn-primary" to="/conditions">{t('see_all', { n: conditions.length })}</Link>
        </div>
      </div>
    </section>
  );
}

function KitArt() {
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true">
      <defs>
        <linearGradient id="gBox" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#ecfeff" /></linearGradient>
        <linearGradient id="gGlass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#e2e8f0" /><stop offset=".5" stopColor="#fff" /><stop offset="1" stopColor="#cbd5e1" /></linearGradient>
      </defs>
      <ellipse cx="200" cy="280" rx="170" ry="14" fill="rgba(0,0,0,.12)" />
      <rect x="70" y="150" width="260" height="125" rx="14" fill="url(#gBox)" />
      <rect x="70" y="150" width="260" height="34" rx="14" fill="#0f766e" />
      <rect x="70" y="172" width="260" height="12" fill="#0f766e" />
      <text x="200" y="173" textAnchor="middle" fontFamily="Baloo 2, sans-serif" fontWeight="700" fontSize="17" fill="#fff">CARE KIT</text>
      <path d="M95 215c30-24 60 20 90 0s60-24 90 0 30 20 40 10" fill="none" stroke="#14b8a6" strokeWidth="5" strokeLinecap="round" opacity=".6" />
      <circle cx="300" cy="245" r="14" fill="#f59e0b" opacity=".9" />
      {[[105, 62, 86, 'A-01', ''], [175, 48, 100, 'A-02', ' b2'], [245, 62, 86, 'A-03', ' b3']].map(([x, y, h, lbl, cls]) => (
        <g key={lbl} className={'bottle' + cls}>
          <rect x={x} y={y} width="50" height={h} rx="10" fill="url(#gGlass)" stroke="#cbd5e1" />
          <rect x={x + 12} y={y - 30} width="26" height="32" rx="6" fill="#fff" stroke="#cbd5e1" />
          <rect x={x + 6} y={y + 30 + (h - 86) * 0.4} width="38" height="30" rx="4" fill="#0f766e" />
          <text x={x + 25} y={y + 50 + (h - 86) * 0.4} textAnchor="middle" fontSize="11" fill="#fff" fontFamily="sans-serif">{lbl}</text>
        </g>
      ))}
      <g fill="#fff" stroke="#e2e8f0"><circle cx="60" cy="270" r="7" /><circle cx="76" cy="276" r="6" /><circle cx="48" cy="280" r="5" /><circle cx="346" cy="272" r="6" /><circle cx="360" cy="279" r="5" /></g>
    </svg>
  );
}

function Process() {
  const { t, L } = useLang();
  return (
    <section id="process" className="soft-bg">
      <div className="container process">
        <div className="kit reveal left">
          <KitArt />
          <div className="kit-tag"><div><b>{t('kit_t')}</b><span>{t('kit_s')}</span></div><span className="badge">{t('kit_badge')}</span></div>
        </div>
        <div className="reveal right">
          <span className="eyebrow warm">{t('proc_eyebrow')}</span>
          <Html as="h2" style={{ fontSize: 'clamp(1.9rem,4vw,2.7rem)', margin: '14px 0 0' }} html={t('proc_title')} />
          <ol className="plan-steps">
            {SITE.steps.map((s, i) => (
              <li key={i}><span className="num">{i + 1}</span><p><b>{t('step')} {i + 1}:</b> {L(s)}</p></li>
            ))}
          </ol>
          <div className="online"><i /><span>{t('online_now')}</span></div>
          <CallButton />
        </div>
      </div>
    </section>
  );
}

function Doctors() {
  const { t } = useLang();
  return (
    <section id="doctors">
      <div className="container">
        <Head eyebrow="doc_eyebrow" title="doc_title" warm />
        <div className="note-box reveal"><Icon n="pin" /><span>{t('doc_note')}</span></div>
        <div className="grid g3 doc-grid">{doctors.map((d, i) => <DoctorCard key={d.id} d={d} i={i} />)}</div>
      </div>
    </section>
  );
}

function Plans() {
  const { t, L } = useLang();
  const { prefillForm, toast } = useUI();
  const navigate = useNavigate();
  return (
    <section id="plans" className="soft-bg">
      <div className="container">
        <Head eyebrow="plan_eyebrow" title="plan_title" sub="plan_sub" />
        <div className="grid g3 plans3" style={{ alignItems: 'center' }}>
          {SITE.plans.map((p, i) => (
            <div key={p.id} className={'card plan reveal zoom' + (p.featured ? ' featured' : '')} style={{ transitionDelay: i * 120 + 'ms' }}>
              <span className="tag">{L(p.tag)}</span>
              <h3>{L(p.n)}</h3>
              <div className="price">{p.p} <small>{L(p.per)}</small></div>
              <ul>{L(p.f).map((x) => <li key={x}><Icon n="check" /><span>{x}</span></li>)}</ul>
              <button className="btn btn-primary" onClick={() => { prefillForm({ plan: p.id }); toast('"' + L(p.n) + '" ' + t('toast_plan')); navigate('/#contact'); }}>{t('choose_plan')}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Why() {
  const { t, L } = useLang();
  return (
    <section id="why">
      <div className="container why">
        <div className="reveal left">
          <span className="eyebrow">{t('why_eyebrow')}</span>
          <Html as="h2" style={{ fontSize: 'clamp(1.9rem,4vw,2.6rem)', margin: '14px 0 8px' }} html={t('why_title')} />
          <p style={{ color: 'var(--muted)' }}>{t('why_sub')}</p>
          <div className="why-list">
            {SITE.why.map((w) => (
              <div className="why-item" key={w.i}><div className="icon"><Icon n={w.i} /></div><div><h4>{L(w.t)}</h4><p>{L(w.d)}</p></div></div>
            ))}
          </div>
        </div>
        <div className="why-panel reveal right">
          <h3 style={{ fontSize: '1.7rem', marginBottom: 6, position: 'relative', zIndex: 1 }}>{t('panel_t')}</h3>
          <p style={{ color: '#94a3b8', marginBottom: 30, position: 'relative', zIndex: 1 }}>{t('panel_s')}</p>
          <div className="counter-grid">
            <div className="counter"><Counter to={12000} suffix="+" /><span>{t('c1')}</span></div>
            <div className="counter"><Counter to={25} suffix="+" /><span>{t('c2')}</span></div>
            <div className="counter"><Counter to={4} /><span>{t('c3')}</span></div>
            <div className="counter"><Counter to={98} suffix="%" /><span>{t('c4')}</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tips() {
  const { L } = useLang();
  return (
    <section id="tips" className="soft-bg">
      <div className="container">
        <Head eyebrow="tips_eyebrow" title="tips_title" sub="tips_sub" warm />
        <div className="grid g3">
          {SITE.tips.map((tp, i) => (
            <div key={i} className="card reveal" style={{ transitionDelay: (i % 3) * 90 + 'ms' }}>
              <span className="tnum">0{i + 1}</span><div className="icon"><Icon n={tp.i} /></div>
              <h3>{L(tp.t)}</h3><p>{L(tp.d)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const { t } = useLang();
  return (
    <section id="contact" className="contact">
      <div className="container contact-wrap">
        <div className="contact-info reveal left">
          <span className="eyebrow">{t('ct_eyebrow')}</span>
          <Html as="h2" html={t('ct_title')} />
          <p>{t('ct_sub')}</p>
          <div className="info-list">
            <div><div className="icon"><Icon n="phone" /></div><div><b>{SITE.phoneDisplay}</b><br /><small style={{ color: 'var(--muted)' }}>{t('ct_hours')}</small></div></div>
            <div><div className="icon"><Icon n="mail" /></div><div><b>{SITE.email}</b><br /><small style={{ color: 'var(--muted)' }}>{t('ct_mail')}</small></div></div>
            <div><div className="icon"><Icon n="pin" /></div><div><b>{t('ct_addr_t')}</b><br /><small style={{ color: 'var(--muted)' }}>{t('ct_addr_s')}</small></div></div>
          </div>
        </div>
        <div className="form-card reveal right"><LeadForm /></div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Departments />
      <Process />
      <Doctors />
      <Plans />
      <Why />
      <Tips />
      <section id="faq">
        <div className="container">
          <Head eyebrow="faq_eyebrow" title="faq_title" />
          <Faq items={SITE.faq} />
        </div>
      </section>
      <Contact />
    </main>
  );
}
