import { useEffect, useState } from 'react';
import { useLang } from '../lib/i18n';
import { cleanPhone, isEmail, isPhone, useUI } from '../lib/ui';
import { submitLead } from '../lib/api';
import { conditions, departments, doctors } from '../data/content';
import { SITE } from '../data/site';
import { SuccessBox } from './Cards';

const byId = (list, id) => list.find((x) => x.id === id);

function Field({ label, req, error, full, children }) {
  return (
    <div className={'field' + (full ? ' full' : '') + (error ? ' error' : '')}>
      <label>{label}{req && <> <span className="req">*</span></>}</label>
      {children}
      {error !== undefined && <small className="err">{error}</small>}
    </div>
  );
}

function SubmitButton({ loading, label, className = 'btn btn-primary' }) {
  const { t } = useLang();
  return (
    <button className={className + (loading ? ' loading' : '')} type="submit" disabled={loading}>
      <span className="spinner" /><span className="btn-label">{loading ? t('sending') : label}</span>
    </button>
  );
}

const EMPTY = { name: '', phone: '', email: '', city: '', age: '', concern: '', doctor: '', plan: '', mode: 'Online', message: '', website: '' };

/* =================== Home page ka bada contact form =================== */
export function LeadForm() {
  const { t, L, lang } = useLang();
  const { toast, prefill } = useUI();
  const [f, setF] = useState(EMPTY);
  const [err, setErr] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);

  // Plan / doctor / bimari card se aaye pre-fill values
  useEffect(() => {
    if (!prefill.nonce) return;
    const { nonce, ...rest } = prefill;
    setF((old) => ({ ...old, ...rest }));
    setDone(null);
  }, [prefill]);

  const set = (k) => (e) => {
    const v = k === 'phone' ? cleanPhone(e.target.value) : e.target.value;
    setF({ ...f, [k]: v });
    if (err[k]) setErr({ ...err, [k]: '' });
  };

  async function onSubmit(e) {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = t('e_name');
    if (!isPhone(f.phone)) er.phone = t('e_phone');
    if (f.email && !isEmail(f.email)) er.email = t('e_email');
    if (!f.concern) er.concern = t('e_concern');
    setErr(er);
    if (Object.keys(er).length) { toast(t('e_fix'), true); return; }

    // Sheet mein English naam jaayein, bhasha chahe jo ho
    const c = byId(conditions, f.concern), d = byId(doctors, f.doctor), p = byId(SITE.plans, f.plan);
    const payload = {
      ...f, name: f.name.trim(), email: f.email.trim(),
      concern: c ? c.t.en : (f.concern === 'other' ? 'Other' : ''),
      doctor: d ? d.name.en : 'Any',
      plan: p ? p.n.en + ' ' + p.p : '',
      lang: lang.toUpperCase(), source: 'Home form',
    };
    setLoading(true);
    try {
      const res = await submitLead(payload);
      setDone(res.id); setF(EMPTY);
    } catch (ex) {
      toast(ex.message || t('e_gen'), true);
    } finally { setLoading(false); }
  }

  if (done) return <SuccessBox id={done} onAgain={() => setDone(null)} />;

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <Field label={t('f_name')} req error={err.name ?? ''}>
          <input value={f.name} onChange={set('name')} placeholder={t('ph_name')} autoComplete="name" />
        </Field>
        <Field label={t('f_phone')} req error={err.phone ?? ''}>
          <div className="phone-wrap"><span>+91</span><input value={f.phone} onChange={set('phone')} type="tel" inputMode="numeric" placeholder={t('ph_phone')} autoComplete="tel-national" /></div>
        </Field>
        <Field label={t('f_email')} error={err.email ?? ''}>
          <input value={f.email} onChange={set('email')} type="email" placeholder="you@example.com" autoComplete="email" />
        </Field>
        <Field label={t('f_city')}><input value={f.city} onChange={set('city')} placeholder={t('ph_city')} /></Field>
        <Field label={t('f_age')}><input value={f.age} onChange={set('age')} type="number" min="1" max="110" placeholder={t('ph_age')} /></Field>
        <Field label={t('f_concern')} req error={err.concern ?? ''}>
          <select value={f.concern} onChange={set('concern')}>
            <option value="">{t('choose')}</option>
            {departments.map((dp) => (
              <optgroup key={dp.id} label={L(dp.t)}>
                {conditions.filter((c) => c.dept === dp.id).map((c) => <option key={c.id} value={c.id}>{L(c.t)}</option>)}
              </optgroup>
            ))}
            <option value="other">{t('other')}</option>
          </select>
        </Field>
        <Field label={t('f_doctor')}>
          <select value={f.doctor} onChange={set('doctor')}>
            <option value="">{t('any_doc')}</option>
            {doctors.map((d) => <option key={d.id} value={d.id}>{L(d.name)}</option>)}
          </select>
        </Field>
        <Field label={t('f_plan')}>
          <select value={f.plan} onChange={set('plan')}>
            <option value="">{t('undecided')}</option>
            {SITE.plans.map((p) => <option key={p.id} value={p.id}>{L(p.n)} ({p.p})</option>)}
          </select>
        </Field>
        <Field label={t('f_mode')} full>
          <div className="chips">
            {[['Online', 'm_online'], ['Clinic', 'm_clinic'], ['Call', 'm_call']].map(([v, k]) => (
              <label className="chip" key={v}>
                <input type="radio" name="mode" value={v} checked={f.mode === v} onChange={set('mode')} /><span>{t(k)}</span>
              </label>
            ))}
          </div>
        </Field>
        <Field label={t('f_msg')} full><textarea value={f.message} onChange={set('message')} placeholder={t('ph_msg')} /></Field>
        <div className="hp"><input tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} /></div>
      </div>
      <div className="submit-row">
        <SubmitButton loading={loading} label={t('submit')} />
        <p className="note">{t('privacy')}</p>
      </div>
    </form>
  );
}

/* =================== Bimari page ka side form =================== */
export function ConditionForm({ c, symptoms }) {
  const { t, lang } = useLang();
  const { toast } = useUI();
  const [f, setF] = useState({ name: '', phone: '', duration: '', website: '' });
  const [sym, setSym] = useState([]);
  const [err, setErr] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => { setDone(null); setSym([]); }, [c.id]);

  const set = (k) => (e) => {
    setF({ ...f, [k]: k === 'phone' ? cleanPhone(e.target.value) : e.target.value });
    if (err[k]) setErr({ ...err, [k]: '' });
  };
  const toggle = (s) => setSym(sym.includes(s) ? sym.filter((x) => x !== s) : [...sym, s]);

  async function onSubmit(e) {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = t('e_name');
    if (!isPhone(f.phone)) er.phone = t('e_phone');
    setErr(er);
    if (Object.keys(er).length) { toast(t('e_fix'), true); return; }
    setLoading(true);
    try {
      const res = await submitLead({
        name: f.name.trim(), phone: f.phone, email: '', city: '', age: '', website: f.website,
        concern: c.t.en, doctor: 'Any', plan: '', mode: 'Online', lang: lang.toUpperCase(),
        message: 'Duration: ' + (f.duration.trim() || '-') + ' | Symptoms: ' + (sym.join(', ') || '-'),
        source: 'Condition page: ' + c.id,
      });
      setDone(res.id);
    } catch (ex) {
      toast(ex.message || t('e_gen'), true);
    } finally { setLoading(false); }
  }

  if (done) return <SuccessBox id={done} compact />;

  return (
    <form onSubmit={onSubmit} noValidate>
      <h3>{t('cf_t')}</h3><p className="sub">{t('cf_s')}</p>
      <Field label={t('f_name')} req error={err.name ?? ''}>
        <input value={f.name} onChange={set('name')} placeholder={t('ph_name')} autoComplete="name" />
      </Field>
      <Field label={t('f_phone')} req error={err.phone ?? ''}>
        <div className="phone-wrap"><span>+91</span><input value={f.phone} onChange={set('phone')} type="tel" inputMode="numeric" placeholder={t('ph_phone')} autoComplete="tel-national" /></div>
      </Field>
      <Field label={t('f_dur')}><input value={f.duration} onChange={set('duration')} placeholder={t('ph_dur')} /></Field>
      <Field label={t('f_sym')}>
        <div className="sym-grid">
          {symptoms.concat([t('sym_other')]).map((s) => (
            <label key={s} className={sym.includes(s) ? 'on' : ''}>
              <input type="checkbox" checked={sym.includes(s)} onChange={() => toggle(s)} /><span>{s}</span>
            </label>
          ))}
        </div>
      </Field>
      <div className="hp"><input tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} /></div>
      <SubmitButton loading={loading} label={t('cf_btn')} className="btn btn-orange" />
      <p className="note" style={{ marginTop: 10 }}>{t('privacy')}</p>
    </form>
  );
}
