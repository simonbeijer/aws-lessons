import data from "./lessons.json";

// lessons.json skrivs av lektioner/sync-react.mjs. Redigera inte för hand.
export default function App() {
  return (
    <main>
      <h1>Molnutveckling med AWS</h1>
      <p>En kort lektion om dagen inför veckans labbar. Ca 5 minuter var.</p>

      {data.weeks.map((week) => (
        <section key={week.code}>
          <h2>{week.title}</h2>
          <ol className="lesson-list">
            {week.lessons.map((l) => (
              <li key={l.file}>
                <span className="no">
                  Lektion {l.nr}
                  {l.tag && ` · ${l.tag}`}
                </span>
                <a href={`/lessons/${l.file}`}>{l.title}</a>
                <span className="goal-line" dangerouslySetInnerHTML={{ __html: l.goal }} />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </main>
  );
}
