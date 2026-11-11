import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Terminal as TerminalIcon } from 'lucide-react';
import { projects } from '../data';

const ProjectStoryFlow = lazy(() => import('../components/ProjectStoryFlow'));

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isDecoding, setIsDecoding] = useState(true);
  const [decodeProgress, setDecodeProgress] = useState(0);
  const project = projects.find((item) => item.slug === slug);

  // Handle decoding animation timeline & cleanup
  useEffect(() => {
    setIsDecoding(true);
    setDecodeProgress(0);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDecodeProgress(100);
      const reducedMotionTimer = window.setTimeout(() => setIsDecoding(false), 350);
      return () => window.clearTimeout(reducedMotionTimer);
    }

    const interval = window.setInterval(() => {
      setDecodeProgress((progress) => Math.min(progress + 5, 100));
    }, 80);

    const timer = window.setTimeout(() => {
      setIsDecoding(false);
      window.clearInterval(interval);
    }, 1600);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, [slug]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') navigate('/projects');
    };
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [navigate]);

  if (!project) return <Navigate to="/projects" replace />;

  const titleCharacters = Array.from(project.title);
  const revealedCharacters = Math.floor((titleCharacters.length * decodeProgress) / 100);
  const scrambleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]';

  return (
    <section className={`project-reader project-reader--${project.category}`} aria-label={`${project.title} project reader`}>
      <header className="project-terminal-titlebar">
        <span className="project-terminal-filename">
          <TerminalIcon aria-hidden="true" />
          <span>~/projects/{project.slug}/README.md</span>
        </span>
        <Link className="project-terminal-eject" to="/projects" aria-label="Eject project memory card">
          <ArrowLeft aria-hidden="true" />
          <span>Eject</span>
        </Link>
      </header>

      <div className={`project-terminal-document${isDecoding ? ' is-decoding' : ' is-decoded'}`}>
        <div className="project-document-content">
          <Suspense fallback={<div className="project-story-flow-loading" role="status">Rendering project flow...</div>}>
            <ProjectStoryFlow key={project.slug} project={project} />
          </Suspense>
        </div>
      </div>

      {isDecoding && (
        <div className="project-detail-decode-overlay" role="region" aria-label={`Decoding ${project.title}`}>
          <div className="project-decoder-console">
            <div className="project-decoder-main">
              <p className="project-decoder-kicker">
                <span />PROJECT DATA RECOVERY <code>0x{Math.floor(decodeProgress * 2.55).toString(16).padStart(2, '0').toUpperCase()}</code>
              </p>
              <p className="project-terminal-command"><span>$</span> read ./{project.slug} --decode --restore</p>
              <h2 className="project-decoded-title" aria-label={project.title}>
                {titleCharacters.map((character, characterIndex) => {
                  const isRevealed = characterIndex < revealedCharacters || character === ' ';
                  const scrambleIndex = (characterIndex * 13 + decodeProgress * 7) % scrambleCharacters.length;
                  return (
                    <span className={isRevealed ? 'is-decoded' : ''} aria-hidden="true" key={`${character}-${characterIndex}`}>
                      {isRevealed ? character : scrambleCharacters[scrambleIndex]}
                    </span>
                  );
                })}
              </h2>
              <p className="project-decoder-line">Reassembling project data<span>{String(decodeProgress).padStart(2, '0')}%</span></p>
              <div
                className="project-decoder-progress"
                role="progressbar"
                aria-label="Project detail decoding progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={decodeProgress}
              >
                <span style={{ width: `${decodeProgress}%` }} />
              </div>
              <div className="project-decoder-stages" aria-hidden="true">
                <span className={decodeProgress >= 25 ? 'is-complete' : 'is-current'}>READ</span>
                <span className={decodeProgress >= 55 ? 'is-complete' : decodeProgress >= 25 ? 'is-current' : ''}>INDEX</span>
                <span className={decodeProgress >= 85 ? 'is-complete' : decodeProgress >= 55 ? 'is-current' : ''}>DECODE</span>
                <span className={decodeProgress >= 100 ? 'is-complete' : decodeProgress >= 85 ? 'is-current' : ''}>RESTORE</span>
              </div>
            </div>
            <div className="project-decoder-visual" aria-hidden="true">
              <div className="project-decoder-data-grid">
                {Array.from({ length: 4 }, (_, rowIndex) => (
                  <div className="project-decoder-data-row" key={rowIndex}>
                    <span>0x{(rowIndex * 16).toString(16).padStart(2, '0').toUpperCase()}</span>
                    <div>
                      {Array.from({ length: 8 }, (_, cellIndex) => (
                        <i
                          className={(rowIndex * 3 + cellIndex) % 4 === 0 ? 'is-highlighted' : ''}
                          key={cellIndex}
                        />
                      ))}
                    </div>
                    <b>{rowIndex < 3 ? 'READ' : 'OK'}</b>
                  </div>
                ))}
              </div>
              <div className="project-decoder-wave">
                {Array.from({ length: 28 }, (_, barIndex) => (
                  <i key={barIndex} style={{ animationDelay: `${barIndex * 24}ms` }} />
                ))}
              </div>
              <span className="project-decoder-visual-label">SIGNAL / {project.slug.toUpperCase()}</span>
            </div>
          </div>
        </div>
      )}

      <footer className="project-terminal-statusbar" aria-label="Reader status">
        <span><i aria-hidden="true" />{isDecoding ? 'READING MEMORY CARD' : 'READER READY'}</span>
      </footer>
    </section>
  );
}