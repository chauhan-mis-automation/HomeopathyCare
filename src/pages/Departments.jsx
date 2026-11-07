import { Link, useSearchParams } from 'react-router-dom';
import { useLang } from '../lib/i18n';
import { Icon } from '../lib/ui';
import { conditions, departments } from '../data/content';
import { CallButton, Crumbs } from '../components/Layout';
import { CondRow } from '../components/Cards';

function matches(c, q) {
  if (!q) return true;
  const hay = [c.t.hi, c.t.en, c.d.hi, c.d.en, c.facts?.aka?.hi, c.facts?.aka?.en].join(' ').toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w));
}

export default function Departments() {
  const { t, L, lang, setLang } = useLang();
  const [params, setParams] = useSearchParams();
  const dept = params.get('dept') || 'all';
  const q = params.get('q') || '';

  const update = (patch) => {
    const next = { dept, q, ...patch };
    const p = {};
    if (next.dept && next.dept !== 'all') p.dept = next.dept;
    if (next.q) p.q = next.q;
    setParams(p, { replace: true });
  };

  const sections = departments
    .filter((d) => dept === 'all' || dept === d.id)
    .map((d) => ({ d, cs: conditions.filter((c) => c.dept === d.id && matches(c, q.trim())) }))
    .filter((x) => x.cs.length);

  return (
    <main>
      <Crumbs items={[{ l: t('home'), to: '/' }, { l: t('all_conds') }]} />
      <section className="dp"><div className="container">
        <div className="dp-top reveal">
          <span className="count-pill">{t('dp_count', { n: conditions.length })}</span>
          <div className="search">
            <Icon n="search" />
            <input type="search" autoComplete="off" placeholder={t('search_ph')} value={q} onChange={(e) => update({ q: e.target.value })} />
          </div>
        </div>
        <div className="chips-row reveal">
          <button className={'dchip' + (dept === 'all' ? ' on' : '')} onClick={() => update({ dept: 'all' })}>
            <span className="ci" style={{ background: '#f1f5f9', color: '#475569' }}><Icon n="search" /></span>{t('all')} <span className="n">{conditions.length}</span>
          </button>
          {departments.map((d) => (
            <button key={d.id} className={'dchip' + (dept === d.id ? ' on' : '')} onClick={() => update({ dept: d.id })}>
              <span className="ci" style={{ background: d.c + '1f', color: d.c }}><Icon n={d.i} /></span>{L(d.t)} <span className="n">{conditions.filter((c) => c.dept === d.id).length}</span>
            </button>
          ))}
        </div>

        {sections.length === 0 && <div className="empty">🔍 {t('no_match')}</div>}
        {sections.map(({ d, cs }) => (
          <div className="dsec" key={d.id}>
            <div className="dsec-head">
              <div className="bi" style={{ background: `linear-gradient(135deg,${d.c},${d.c}bb)` }}><Icon n={d.i} /></div>
              <div><h2>{L(d.t)} {t('homeo')} <span className="badge-sm">{t('conds_n', { n: cs.length })}</span></h2><p>{L(d.d)}</p></div>
            </div>
            <div className="grid g3">{cs.map((c) => <CondRow key={c.id} c={c} />)}</div>
          </div>
        ))}

        {/* Departments ki short jaankari */}
        <div className="explain reveal">
          <h2>{t('dx_title')}</h2>
          {departments.map((d) => (
            <p key={d.id}>
              <Link to={'/conditions?dept=' + d.id} className="dx-name" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <span className="dx-dot" style={{ background: d.c }} />{L(d.t)}:
              </Link>{' '}
              {L(d.long)}
            </p>
          ))}
          <p className="dx-more">
            {t('dx_more')}{' '}
            <button className="dx-switch" onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}>{t('dx_switch')} →</button>
          </p>
        </div>

        {/* Orange call banner */}
        <div className="cta-mid reveal zoom" style={{ marginTop: 40 }}>
          <h3>{t('cta_india')}</h3>
          <CallButton />
          <p className="cta-sub"><i />{t('bar_text')}</p>
        </div>
      </div></section>
    </main>
  );
}