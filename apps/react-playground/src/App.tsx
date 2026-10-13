import { useEffect, useState } from 'react';
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

/** `#<case-id>` shows one case; `#overlay/<id>/<react|web>` one open overlay; no hash shows every case. */
export function App() {
  const hash = useHash();
  const [kind, id, side] = hash.split('/');
  if (kind === 'overlay') return <OverlayPage key={hash} id={id} side={side === 'web' ? 'web' : 'react'} />;
  const shown = hash ? cases.filter((c) => c.id === hash) : cases;
  return (
    <main>
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
