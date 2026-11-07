import { useNavigate, useParams } from 'react-router-dom';
import { useLang } from '../lib/i18n';
import { Icon, useUI } from '../lib/ui';
import { conditions, doctors } from '../data/content';
import { SITE } from '../data/site';
import { Crumbs } from '../components/Layout';
import { Avatar, CondCard, DoctorCard } from '../components/Cards';
import NotFound from './NotFound';

export default function DoctorPage() {
  const { id } = useParams();
  const { t, L } = useLang();
  const { prefillForm, toast } = useUI();
  const navigate = useNavigate();
  const d = doctors.find((x) => x.id === id);
  if (!d) return <NotFound />;

  const nm = L(d.name);
  const conds = d.conds.map((cid) => conditions.find((c) => c.id === cid)).filter(Boolean);
  const others = doctors.filter((x) => x.id !== d.id);

  const book = () => {
    prefillForm({ doctor: d.id, concern: conds[0]?.id || '' });
    toast(nm + ' — ' + t('toast_doc'));
    navigate('/#contact');
  };

  return (
    <main>
      <Crumbs items={[{ l: t('home'), to: '/' }, { l: t('doctors'), to: '/#doctors' }, { l: nm }]} />

      <section className="profile"><div className="container">
        <div className="p-photo reveal left">
          <div className="frame"><Avatar d={d} /></div>
          <span className="verified"><Icon n="badge" />{t('verified')}</span>
        </div>
        <div className="p-info reveal right">
          <div className="kicker">{t('brand')} • {L(d.city)}</div>
          <h1>{nm}</h1>
          <div className="role">{L(d.role)}</div>
          <div className="p-quals">
            <span className="deg"><Icon n="cap" />{d.degree}</span>
            <span className="col"><Icon n="bank" />{L(d.college)}</span>
          </div>
          <p className="about">{L(d.about)}</p>
          <div className="tags">{conds.map((c) => <span key={c.id}>{L(c.t)}</span>)}</div>
          <div className="p-stats">
            <div><b>{d.exp}+</b><span>{t('exp_l')}</span></div>
            <div><b>{t('mode_v')}</b><span>{t('mode_l')}</span></div>
            <div><b>{L(d.city)}</b><span>{t('loc_l')}</span></div>
          </div>
        </div>
      </div></section>

      <section className="soft-bg" style={{ paddingTop: 70 }}><div className="container">
        <div className="left-head reveal"><div className="kick">{t('areas')}</div><h2>{t('treats', { n: nm })}</h2><span className="underline" /></div>
        <div className="grid g4">{conds.map((c, i) => <CondCard key={c.id} c={c} i={i} warm />)}</div>
        <div className="avail">
          <div className="card reveal">
            <h3 style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Icon n="clock" />{t('avail')}</h3>
            <ul>{d.slots.map((s, i) => <li key={i}><span>{L(s.d)}</span><span>{s.t}</span></li>)}</ul>
          </div>
          <div className="card reveal">
            <h3 style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Icon n="globe" />{t('langs')}</h3>
            <ul>
              <li><span>{t('langs')}</span><span>{L(d.langs)}</span></li>
              <li><span>{t('fee')}</span><span style={{ color: '#16a34a' }}>{t('fee_v')}</span></li>
            </ul>
          </div>
        </div>
      </div></section>

      <section style={{ paddingTop: 20 }}><div className="container">
        <div className="cta-banner reveal zoom">
          <h2>{t('consult', { n: nm })}</h2><p>{t('consult_s')}</p>
          <div className="acts">
            <button className="btn btn-white" onClick={book}><Icon n="cal" />{t('book')}</button>
            <a className="btn btn-outline-w" href={'tel:' + SITE.phone}><Icon n="phone" />{SITE.phoneDisplay}</a>
          </div>
        </div>
        <div className="left-head reveal" style={{ marginTop: 80 }}><div className="kick">{t('doctors')}</div><h2>{t('other_docs')}</h2><span className="underline" /></div>
        <div className="grid g3 doc-grid">{others.map((x, i) => <DoctorCard key={x.id} d={x} i={i} />)}</div>
      </div></section>
    </main>
  );
}
