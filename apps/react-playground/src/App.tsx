import { useEffect, useState } from 'react';
import { Toggle } from '@kalads/react-components';
import { cases } from './cases.js';
import { OverlayPage } from './overlays.js';

function useHash() {
  const [hash, setHash] = useState(location.hash.slice(1));
  useEffect(() => {
    const onChange = () => setHash(location.hash.slice(1));
    addEventListener('hashchange', onChange);
    return () => removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

/** Dark mode on the whole page, like an app sets it: `data-kds-theme` on <html>. `?theme=dark` starts dark. */
function useDarkMode() {
  const [dark, setDark] = useState(new URLSearchParams(location.search).get('theme') === 'dark');
  useEffect(() => {
    document.documentElement.dataset.kdsTheme = dark ? 'dark' : 'light';
  }, [dark]);
  return [dark, setDark] as const;
}

/**
 * `#<case-id>` shows one case; `#overlay/<id>/<react|web>` one open overlay; no hash shows every case.
 * Add `?theme=dark` to any of them for dark mode.
 */
export function App() {
  const hash = useHash();
  const [dark, setDark] = useDarkMode();
  const [kind, id, side] = hash.split('/');
  if (kind === 'overlay') return <OverlayPage key={hash} id={id} side={side === 'web' ? 'web' : 'react'} />;
  const shown = hash ? cases.filter((c) => c.id === hash) : cases;
  return (
    <main>
      {hash ? null : (
        <header className="toolbar">
          <Toggle checked={dark} onChange={setDark}>
            Dark mode
          </Toggle>
        </header>
      )}
      {shown.map((c) => (
        <section key={c.id} className="case" id={c.id}>
          <h2>{c.title}</h2>
          <div className="side react">{c.react}</div>
          <div className="side web" dangerouslySetInnerHTML={{ __html: c.web }} />
        </section>
      ))}
    </main>
  );
}
