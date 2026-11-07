import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../lib/i18n';
import { Icon } from '../lib/ui';

export function Avatar({ d }) {
  const { L } = useLang();
  if (d.photo) return <img src={d.photo} alt={L(d.name)} loading="lazy" />;
  const p = d.name.en.replace(/^Dr\.\s*/, '').split(/\s+/);
  const ini = (p[0] || '').charAt(0) + (p[1] || '').charAt(0);
  const c = d.color || ['#0f766e', '#14b8a6'];
  return (
    <div className="avatar">
      <div className="ini" style={{ background: `linear-gradient(135deg,${c[0]},${c[1]})` }}>{ini}</div>
      <Icon n="steth" className="steth" />
    </div>
  );
}

export function DoctorCard({ d, i = 0 }) {
  const { t, L } = useLang();
  return (
    <Link to={'/doctors/' + d.id} className="card doc-card reveal" style={{ transitionDelay: (i % 3) * 90 + 'ms' }}>
      <div className="doc-photo">
        <Avatar d={d} />
        <span className="exp">{d.exp}+ {t('yrs')}</span>
        <div className="view">{t('view_profile')} <Icon n="arrow" /></div>
      </div>
      <div className="doc-body">
        <h3>{L(d.name)}</h3>
        <p>{L(d.role).split('|').pop().trim()}</p>
        <small>{d.degree} • {L(d.city)}</small>
      </div>
    </Link>
  );
}

export function CondRow({ c, reveal }) {
  const { t, L } = useLang();
  return (
    <Link to={'/conditions/' + c.id} className={'crow' + (reveal ? ' reveal' : '')}>
      <div className="ci"><Icon n={c.i} /></div>
      <div><b>{L(c.t)}</b><small>{t('view_tr')}</small></div>
      <Icon n="chev" className="chev" />
    </Link>
  );
}

export function CondCard({ c, i = 0, warm }) {
  const { t, L } = useLang();
  return (
    <Link to={'/conditions/' + c.id} className="card click reveal" style={{ transitionDelay: (i % 4) * 80 + 'ms' }}>
      <div className={'icon' + (warm ? ' warm' : '')}><Icon n={c.i} /></div>
      <h3>{L(c.t)}</h3>
      <p>{L(c.d)}</p>
      <span className="more">{t('know_more')} <Icon n="arrow" /></span>
    </Link>
  );
}

export function Faq({ items, firstOpen = true, style }) {
  const { L } = useLang();
  const [open, setOpen] = useState(firstOpen ? 0 : -1);
  return (
    <div className="faq" style={style}>
      {items.map((f, i) => (
        <div key={i} className={'faq-item reveal' + (open === i ? ' open' : '')}>
          <button className="faq-q" type="button" onClick={() => setOpen(open === i ? -1 : i)}>
            <span>{L(f.q)}</span>
            <span className="plus"><Icon n="plus" width="18" strokeWidth="2.5" /></span>
          </button>
          <div className="faq-a"><div><p>{L(f.a)}</p></div></div>
        </div>
      ))}
    </div>
  );
}

export function SuccessBox({ id, onAgain, compact }) {
  const { t } = useLang();
  return (
    <div className={compact ? 'c-success' : 'success show'}>
      <div className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg></div>
      <h3>{t('ok_t')}</h3>
      <p style={compact ? { color: 'var(--muted)', margin: '8px 0 18px' } : undefined}>{t('ok_s')}</p>
      <div className="lead-id">{t('ref')}{id || '—'}</div>
      {onAgain && <div style={{ marginTop: 22 }}><button className="btn btn-ghost" onClick={onAgain}>{t('again')}</button></div>}
    </div>
  );
}
