import { useParams } from 'react-router-dom';
import { useLang } from '../lib/i18n';
import { Icon } from '../lib/ui';
import { conditions, departments, doctors } from '../data/content';
import { SITE } from '../data/site';
import { Crumbs } from '../components/Layout';
import { CondRow, DoctorCard, Faq } from '../components/Cards';
import { ConditionForm } from '../components/Forms';
import NotFound from './NotFound';

const Check = () => <Icon n="check" />;

function SecTitle({ children }) {
  return <div className="reveal" style={{ marginTop: 64 }}><h2 className="sec-t">{children}</h2><div className="uline" /></div>;
}

export default function ConditionPage() {
  const { id } = useParams();
  const { t, L } = useLang();
  const c = conditions.find((x) => x.id === id);
  if (!c) return <NotFound />;

  const nm = L(c.t);
  const dept = departments.find((d) => d.id === c.dept);
  const dn = dept ? L(dept.t) : '';
  const syms = c.symptoms ? c.symptoms.map((x) => ({ t: L(x.t), d: L(x.d) })) : (L(c.sym) || []).map((x) => ({ t: x, d: '' }));
  const fsym = c.fsym ? L(c.fsym) : syms.slice(0, 4).map((x) => x.t);

  let docs = doctors.filter((d) => d.conds.includes(c.id));
  if (!docs.length) docs = doctors.filter((d) => d.conds.some((x) => conditions.find((cc) => cc.id === x)?.dept === c.dept));
  const related = conditions.filter((x) => x.dept === c.dept && x.id !== c.id);

  const F = c.facts || {};
  const facts = [
    ['fa_aka', F.aka && L(F.aka)],
    ['fa_affects', F.affects && L(F.affects)],
    ['fa_sym', F.sym ? L(F.sym) : syms.map((x) => x.t).join(', ')],
    ['fa_causes', F.causes ? L(F.causes) : (c.cause ? L(c.cause).join(', ') : '')],
    ['fa_diag', F.diag && L(F.diag)],
    ['fa_app', t('app_v')],
    ['fa_fu', t('fu_v')],
    ['fa_urg', F.urgent && L(F.urgent)],
  ].filter((r) => r[1]);

  const scrollToForm = () => {
    const el = document.getElementById('cFormCard');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
  };

  return (
    <main>
      <Crumbs items={[{ l: t('home'), to: '/' }, { l: t('all_conds'), to: '/conditions' }, { l: dn, to: '/conditions?dept=' + c.dept }, { l: nm }]} />

      {/* HERO + FORM */}
      <div className="c-hero"><div className="container">
        <div className="reveal left">
          <span className="pill-w">{t('c_eyebrow', { d: dn })}</span>
          <h1>{t('c_h1', { n: nm })} <span className="gradw">{c.tag ? L(c.tag) : t('c_tag_def')}</span></h1>
          <p className="lead">{L(c.intro)}</p>
          <div className="c-stats">
            <div><b>{SITE.plans[0].p}</b><span>{t('cs1')}</span></div>
            <div><b>{t('cs2b')}</b><span>{t('cs2')}</span></div>
            <div><b>{t('cs3b')}</b><span>{t('cs3')}</span></div>
          </div>
          <ul className="checks">{['cb1', 'cb2', 'cb3', 'cb4'].map((k) => <li key={k}><Check /><span>{t(k)}</span></li>)}</ul>
        </div>
        <div className="form-card c-form reveal right" id="cFormCard">
          <ConditionForm key={c.id} c={c} symptoms={fsym} />
        </div>
      </div></div>

      {/* TYPES */}
      {c.types && (
        <section className="c-sec"><div className="container">
          <div className="section-head reveal" style={{ marginBottom: 40 }}><h2>{t('types_t', { n: nm })}</h2><p>{t('types_s')}</p></div>
          <div className="grid g4">
            {c.types.map((x, i) => (
              <div key={i} className="card type-card reveal" style={{ transitionDelay: (i % 4) * 80 + 'ms' }}>
                <div className="ti"><Icon n={c.i} /></div><h3>{L(x.t)}</h3><p>{L(x.d)}</p>
              </div>
            ))}
          </div>
        </div></section>
      )}

      <section className="c-sec"><div className="container narrow">
        {/* KEY TAKEAWAYS */}
        {c.keys && (
          <div className="takeaways reveal">
            <h3>{t('kt')}</h3>
            <ul>{L(c.keys).map((k, i) => <li key={i}><Check /><span><b>{k[0]}:</b> {k[1]}</span></li>)}</ul>
          </div>
        )}

        {/* WHAT IS */}
        <SecTitle>{t('what_t', { n: nm })}</SecTitle>
        <p className="prose reveal">{c.what ? L(c.what) : L(c.intro)}</p>
        {c.forms && <div className="grid g2">{c.forms.map((x, i) => <div key={i} className="ccheck reveal"><Check /><span><b>{L(x.t)}</b> – {L(x.d)}</span></div>)}</div>}

        {/* FACTS */}
        <SecTitle>{t('facts_t', { n: nm })}</SecTitle>
        <table className="facts reveal"><tbody>
          {facts.map(([k, v]) => <tr key={k} className={k === 'fa_urg' ? 'urg' : ''}><th>{t(k)}</th><td>{v}</td></tr>)}
        </tbody></table>

        {/* SYMPTOMS */}
        <SecTitle>{t('sym_t', { n: nm })}</SecTitle>
        <p className="prose reveal">{t('sym_s')}</p>
        <div className="grid g2">{syms.map((x, i) => <div key={i} className="ccheck reveal"><Check /><span><b>{x.t}</b>{x.d && ' – ' + x.d}</span></div>)}</div>

        <div className="cta-mid reveal zoom" style={{ marginTop: 50 }}>
          <h3>{t('struggle', { n: nm })}</h3>
          <a className="btn btn-white" href={'tel:' + SITE.phone}><Icon n="phone" />{t('call_free')}</a>
        </div>

        {/* CARE */}
        {c.care && <>
          <SecTitle>{t('care_t')}</SecTitle>
          <div className="grid g2">{L(c.care).map((x, i) => <div key={i} className="ccheck reveal"><Icon n="heart" /><span>{x}</span></div>)}</div>
        </>}
        <div className="alert reveal"><Icon n="alert" /><span>{t('med_note')}</span></div>

        {/* FAQ */}
        {c.faq && <>
          <SecTitle>{t('c_faq')}</SecTitle>
          <Faq key={c.id} items={c.faq} firstOpen={false} style={{ maxWidth: 'none' }} />
        </>}
      </div></section>

      {/* DOCTORS + RELATED + CTA */}
      <section className="c-sec" style={{ paddingBottom: 90 }}><div className="container">
        {docs.length > 0 && <>
          <div className="left-head reveal"><div className="kick">{t('doctors')}</div><h2>{t('doc_for')}</h2><span className="underline" /></div>
          <div className="grid g3 doc-grid">{docs.slice(0, 3).map((d, i) => <DoctorCard key={d.id} d={d} i={i} />)}</div>
        </>}
        {related.length > 0 && <>
          <div className="left-head reveal" style={{ marginTop: 70 }}><div className="kick">{dn}</div><h2>{t('related', { d: dn })}</h2><span className="underline" /></div>
          <div className="grid g3">{related.map((x) => <CondRow key={x.id} c={x} reveal />)}</div>
        </>}
        <div className="cta-banner reveal zoom" style={{ marginTop: 70 }}>
          <h2>{t('cond_cta', { n: nm })}</h2><p>{t('consult_s')}</p>
          <div className="acts">
            <button className="btn btn-white" onClick={scrollToForm}><Icon n="cal" />{t('book')}</button>
            <a className="btn btn-outline-w" href={'tel:' + SITE.phone}><Icon n="phone" />{SITE.phoneDisplay}</a>
          </div>
        </div>
      </div></section>
    </main>
  );
}

