import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLang } from '../lib/i18n';
import { Icon } from '../lib/ui';
import { SITE } from '../data/site';

const LEAF = '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>';

export function Logo({ small }) {
  const { t } = useLang();
  return (
    <Link className="logo" to="/">
      <div className="logo-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: LEAF }} /></div>
      <div>{t('brand')}{!small && <small>HOMEOPATHY CARE</small>}</div>
    </Link>
  );
}

const NAV = [
  { to: '/conditions', k: 'nav_cond' },
  { to: '/#doctors', k: 'nav_doc' },
  { to: '/#process', k: 'nav_proc' },
  { to: '/#plans', k: 'nav_plans' },
  { to: '/#tips', k: 'nav_tips' },
  { to: '/#faq', k: 'nav_faq' },
];

export function Navbar() {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header className={'nav' + (scrolled ? ' scrolled' : '') + (pathname !== '/' ? ' solid' : '')}>
        <div className="container">
          <Logo />
          <ul className="nav-links">
            {NAV.map((n) => <li key={n.k}><Link to={n.to}>{t(n.k)}</Link></li>)}
          </ul>
          <div className="nav-cta">
            <div className="lang" data-l={lang}>
              <span className="pill" />
              <button className={lang === 'hi' ? 'on' : ''} onClick={() => setLang('hi')}>हिं</button>
              <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
            </div>
            <Link className="btn btn-primary" to="/#contact">{t('cta_free')}</Link>
            <button className={'burger' + (open ? ' open' : '')} aria-label="Menu" onClick={() => setOpen(!open)}><span /></button>
          </div>
        </div>
      </header>
      <nav className={'mobile-menu' + (open ? ' open' : '')}>
        {NAV.map((n) => <Link key={n.k} to={n.to} onClick={() => setOpen(false)}>{t(n.k)}</Link>)}
        <Link className="btn btn-primary" to="/#contact" onClick={() => setOpen(false)}>{t('cta_book')}</Link>
      </nav>
    </>
  );
}

export function Footer() {
  const { t } = useLang();
  return (
    <footer>
      <div className="container">
        <div className="foot-grid">
          <div><Logo small /><p className="disclaimer">{t('disclaimer')}</p></div>
          <div><h4>{t('f_links')}</h4><ul>
            <li><Link to="/conditions">{t('nav_cond')}</Link></li>
            <li><Link to="/#doctors">{t('nav_doc')}</Link></li>
            <li><Link to="/#plans">{t('nav_plans')}</Link></li>
            <li><Link to="/#faq">{t('nav_faq')}</Link></li>
          </ul></div>
          <div><h4>{t('f_services')}</h4><ul>{['s1', 's2', 's3', 's4'].map((k) => <li key={k}>{t(k)}</li>)}</ul></div>
          <div><h4>{t('f_time')}</h4><ul>{['t1', 't2', 't3'].map((k) => <li key={k}>{t(k)}</li>)}</ul></div>
        </div>
        <div className="foot-bottom"><span>© {new Date().getFullYear()} {t('brand')}. {t('rights')}</span><span>Made with React + Google Sheets</span></div>
      </div>
    </footer>
  );
}

const PHONE_FILL = 'M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z';
const WA = 'M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.03c0-5.2 4.23-9.43 9.44-9.43a9.4 9.4 0 0 1 9.43 9.44c0 5.2-4.24 9.44-9.44 9.44m8.03-17.47A11.3 11.3 0 0 0 12.05.7C5.79.7.7 5.79.7 12.05c0 2 .52 3.95 1.52 5.67L.6 23.6l6.02-1.58a11.3 11.3 0 0 0 5.42 1.38h.01c6.26 0 11.35-5.09 11.35-11.35 0-3.03-1.18-5.88-3.32-8.02';

export function CallButton({ label }) {
  const { t } = useLang();
  return (
    <a className="btn btn-call" href={'tel:' + SITE.phone}>
      <span className="ring-ic"><svg viewBox="0 0 24 24" fill="currentColor"><path d={PHONE_FILL} /></svg></span>
      <span>{label || t('call_now')}</span>
    </a>
  );
}

export function CallBar() {
  const { t } = useLang();
  const wa = 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent('Namaste, mujhe consultation chahiye.');
  return (
    <div className="callbar">
      <span className="txt"><i />{t('bar_text')}</span>
      <CallButton />
      <a className="wa" href={wa} target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="currentColor"><path d={WA} /></svg>WhatsApp</a>
    </div>
  );
}

/** Scroll progress bar + "upar jaayein" button */
export function ScrollExtras() {
  const [y, setY] = useState(0); const [h, setH] = useState(1);
  useEffect(() => {
    const on = () => { setY(window.scrollY); setH(document.documentElement.scrollHeight - window.innerHeight); };
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <>
      <div className="progress" style={{ width: (h > 0 ? (y / h) * 100 : 0) + '%' }} />
      <button className={'to-top' + (y > 600 ? ' show' : '')} aria-label="Top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><Icon n="up" /></button>
    </>
  );
}

/** Route badalne par upar scroll, ya #hash wale section tak */
export function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    let tries = 0;
    const go = () => {
      const el = document.querySelector(hash);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
      else if (tries++ < 20) setTimeout(go, 50);
    };
    go();
  }, [pathname, hash, key]);
  return null;
}

/** Breadcrumb + wapas button */
export function Crumbs({ items }) {
  const { t } = useLang();
  const navigate = useNavigate();
  return (
    <div className="crumbs"><div className="container">
      {items.map((it, i) => (
        <span key={i} style={{ display: 'contents' }}>
          {i > 0 && <span className="sep">/</span>}
          {i === items.length - 1 ? <span className="cur">{it.l}</span> : <Link to={it.to}>{it.l}</Link>}
        </span>
      ))}
      <button className="back-btn" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}><Icon n="back" /> {t('back')}</button>
    </div></div>
  );
}
