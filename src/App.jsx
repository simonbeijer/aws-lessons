import { useEffect, useState } from "react";
import data from "./lessons.json";

// Samma nyckel och format som lesson.js, som markerar en lektion klar via "Nästa:".
const KEY = "aws-lektioner-klara";
const keyOf = (l) => `lessons/${l.file}`;

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && s.lessons) return s.lessons;
  } catch (e) {}
  return {};
}

function save(lessons) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ lessons }));
  } catch (e) {}
}

// lessons.json skrivs av lektioner/sync-react.mjs. Redigera inte för hand.
export default function App() {
  const [done, setDone] = useState(load);

  // Tillbaka-knappen kan visa en gammal kopia av sidan: läs in markeringarna igen.
  useEffect(() => {
    const onShow = (e) => e.persisted && setDone(load());
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  function set(lessons, value) {
    const next = { ...done };
    for (const l of lessons) {
      if (value) next[keyOf(l)] = true;
      else delete next[keyOf(l)];
    }
    save(next);
    setDone(next);
  }

  return (
    <main>
      <h1>Molnutveckling med AWS</h1>
      <p>En kort lektion om dagen inför veckans labbar. Ca 5 minuter var.</p>

      {data.weeks.map((week) => (
        <Week key={week.code} week={week} done={done} set={set} />
      ))}
    </main>
  );
}

function Week({ week, done, set }) {
  const n = week.lessons.filter((l) => done[keyOf(l)]).length;
  const allDone = n === week.lessons.length;
  // En färdig vecka visas stängd.
  const [open, setOpen] = useState(!allDone);
  useEffect(() => {
    if (allDone) setOpen(false);
  }, [allDone]);

  return (
    <details className="week" open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>
        <h2>{week.title}</h2>
        <span className="progress">
          {n} av {week.lessons.length} lästa
        </span>
        <input
          type="checkbox"
          className="week-done"
          aria-label="Markera veckan klar"
          title="Markera veckan klar"
          checked={allDone}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => set(week.lessons, e.target.checked)}
        />
      </summary>
      <ol className="lesson-list">
        {week.lessons.map((l) => (
          <li key={l.file}>
            {/* Skärmläsaren läser upp lektionens titel, t.ex. "Root user klar". */}
            <input
              type="checkbox"
              className="done"
              aria-label={`${l.title} klar`}
              checked={!!done[keyOf(l)]}
              onChange={(e) => set([l], e.target.checked)}
            />
            <span className="no">
              Lektion {l.nr}
              {l.tag && ` · ${l.tag}`}
            </span>
            <a href={`/lessons/${l.file}`}>{l.title}</a>
            <span className="goal-line" dangerouslySetInnerHTML={{ __html: l.goal }} />
          </li>
        ))}
      </ol>
    </details>
  );
}
