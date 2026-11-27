import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type AppLanguage = 'en' | 'taglish';

const LANGUAGE_STORAGE_KEY = 'tradelab_lang_v1';

export interface LanguageContextValue {
  lang: AppLanguage;
  isTaglish: boolean;
  setLang: (next: AppLanguage) => void;
  toggleLang: () => void;
  t: (en: string, taglish: string) => string;
}

const DEFAULT_LANGUAGE_CONTEXT: LanguageContextValue = {
  lang: 'en',
  isTaglish: false,
  setLang: () => {},
  toggleLang: () => {},
  t: (en: string) => en,
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLanguage(): AppLanguage {
  if (typeof window === 'undefined') {
    return 'en';
  }

  try {
    const raw = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return raw === 'taglish' ? 'taglish' : 'en';
  } catch {
    return 'en';
  }
}

function persistLanguage(lang: AppLanguage): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // Ignore restricted browser storage errors
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AppLanguage>(() => readStoredLanguage());

  const setLang = useCallback((next: AppLanguage) => {
    const normalized: AppLanguage = next === 'taglish' ? 'taglish' : 'en';
    setLangState(normalized);
    persistLanguage(normalized);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next: AppLanguage = prev === 'taglish' ? 'en' : 'taglish';
      persistLanguage(next);
      return next;
    });
  }, []);

  const t = useCallback(
    (en: string, taglish: string): string => (lang === 'taglish' ? taglish : en),
    [lang],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      isTaglish: lang === 'taglish',
      setLang,
      toggleLang,
      t,
    }),
    [lang, setLang, toggleLang, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  return ctx ?? DEFAULT_LANGUAGE_CONTEXT;
}
