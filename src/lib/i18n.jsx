import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { T } from '../data/strings';

const LangContext = createContext(null);

function initialLang() {
  try { return localStorage.getItem('ah_lang') === 'en' ? 'en' : 'hi'; } catch { return 'hi'; }
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    try { localStorage.setItem('ah_lang', lang); } catch { /* storage band ho to koi baat nahi */ }
    document.documentElement.lang = lang;
  }, [lang]);

  // t('key', {n: 'value'}) — UI text, {n} jaise placeholders ke saath
  const t = useCallback((key, vars) => {
    let s = T[lang]?.[key] ?? T.hi[key] ?? key;
    if (vars) for (const v in vars) s = s.split('{' + v + '}').join(vars[v]);
    return s;
  }, [lang]);

  // L({hi:'..', en:'..'}) — content ka sahi bhasha wala hissa
  const L = useCallback((o) => {
    if (o == null) return '';
    if (typeof o !== 'object' || Array.isArray(o)) return o;
    return o[lang] ?? o.hi;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t, L }), [lang, t, L]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** Trusted UI strings jinme <span class="grad"> hota hai */
export function Html({ as: Tag = 'span', html, ...rest }) {
  return <Tag {...rest} dangerouslySetInnerHTML={{ __html: html }} />;
}
