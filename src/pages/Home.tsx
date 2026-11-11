import { Link } from 'react-router-dom';
import Terminal from '../components/Terminal';
import TextType from '../components/TextType';

export default function Home() {
  return (
    <div className="boot-home mx-auto flex w-full max-w-5xl flex-col">
      <div className="boot-intro flex flex-col">
        <div className="boot-kicker !text-terminal-muted">
          <span className="status-square light" /> PORTFOLIO <span className="boot-version !text-[#858992]">v1.0.0</span>
        </div>
        <h1>
          <TextType
            text={["Keshi Rodasi Dosieah"]}
            typingSpeed={80}
            pauseDuration={1500}
            deletingSpeed={100}
            deleteMode="backspace"
            typeEffect="none"
            mistakes={0.4}
            cursorStyle="underscore"
            cursorGlide
            showCursor
            cursorColor="currentColor"
            prefixColor="currentColor"
            cursorBlinkDuration={0.5}
            cursorCharacter="_"
            prefix=""
          />
        </h1>
        <p className="!text-xs !leading-relaxed !text-terminal-muted">Being a developer in the AI era: writing clean code, taming probabilistic models, and making sure the system doesn't lose its mind.</p>
      </div>

      <Terminal />

      <div className="boot-hint">
        <span>QUICK START</span>
        <span>Try running:</span> <code>help</code>, <code>ls projects</code>, or <code>cat about.md</code>.
      </div>

      <section
        className="mt-3 border border-solid border-terminal-line p-3 font-mono text-xs"
        aria-labelledby="browse-heading"
      >
        <h2 id="browse-heading" className="m-0 mb-2 text-xs font-normal leading-normal text-terminal-muted">
          Prefer to browse?
        </h2>

        <nav className="flex flex-wrap items-center gap-2" aria-label="Browse portfolio">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 border border-solid border-terminal-yellow/40 bg-transparent px-3 py-1.5 text-terminal-yellow no-underline transition-colors hover:border-terminal-yellow hover:bg-transparent"
          >
            <span>&gt; /projects</span>
            <span aria-hidden="true" className="text-[10px] text-terminal-muted">
              ↗
            </span>
          </Link>

          <Link
            to="/experience"
            className="inline-flex items-center gap-1.5 border border-solid border-terminal-yellow/40 bg-transparent px-3 py-1.5 text-terminal-yellow no-underline transition-colors hover:border-terminal-yellow hover:bg-transparent"
          >
            <span>&gt; /experience</span>
            <span aria-hidden="true" className="text-[10px] text-terminal-muted">
              ↗
            </span>
          </Link>

          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 border border-solid border-terminal-yellow/40 bg-transparent px-3 py-1.5 text-terminal-yellow no-underline transition-colors hover:border-terminal-yellow hover:bg-transparent"
          >
            <span>&gt; /about</span>
            <span aria-hidden="true" className="text-[10px] text-terminal-muted">
              ↗
            </span>
          </Link>
        </nav>
      </section>
    </div>
  );
}