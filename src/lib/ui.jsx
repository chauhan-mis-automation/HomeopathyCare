import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ICONS } from './icons';

/* ---------- Icon ---------- */
export function Icon({ n, className, ...rest }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: ICONS[n] || '' }} {...rest} />
  );
}

/* ---------- Toast + form prefill (app-wide) ---------- */
const UICtx = createContext(null);
export function UIProvider({ children }) {
  const [toastState, setToast] = useState({ msg: '', err: false, show: false });
  const [prefill, setPrefill] = useState({ nonce: 0 });
  const timer = useRef();
  const toast = useCallback((msg, err = false) => {
    setToast({ msg, err, show: true });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast((s) => ({ ...s, show: false })), 3200);
  }, []);
  const prefillForm = useCallback((p) => setPrefill((old) => ({ ...p, nonce: old.nonce + 1 })), []);
  return (
    <UICtx.Provider value={{ toast, prefill, prefillForm }}>
      {children}
      <div className={'toast' + (toastState.show ? ' show' : '') + (toastState.err ? ' err' : '')}>{toastState.msg}</div>
    </UICtx.Provider>
  );
}
export const useUI = () => useContext(UICtx);

/* ---------- Scroll reveal: .reveal class wale har element ko animate karta hai ---------- */
export function RevealObserver() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
      return;
    }
    // Jo element ek baar dikh chuka hai, use yaad rakhte hain
    const seen = new WeakSet();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); seen.add(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    const scan = () => document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
      if (seen.has(el)) el.classList.add('in'); else io.observe(el);
    });
    scan();
    // React jab className badalta hai (jaise FAQ open/close), to 'in' class hat jaati hai —
    // yahan use wapas laga dete hain taaki element gayab na ho
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'attributes' && seen.has(m.target) && !m.target.classList.contains('in')) m.target.classList.add('in');
      }
      scan();
    });
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
  return null;
}

/* ---------- Counter (ginti animate) ---------- */
export function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current; let raf; let started = false;
    const run = () => {
      if (started) return; started = true;
      let st = null;
      const step = (ts) => {
        if (!st) st = ts;
        const p = Math.min((ts - st) / 1800, 1);
        setVal(Math.floor(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    if (!('IntersectionObserver' in window)) { run(); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <b ref={ref}>{val.toLocaleString('en-IN')}{suffix}</b>;
}

/* ---------- Phone number cleaner ---------- */
export const cleanPhone = (v) => v.replace(/\D/g, '').slice(0, 10);
export const isPhone = (v) => /^[6-9]\d{9}$/.test(v);
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);