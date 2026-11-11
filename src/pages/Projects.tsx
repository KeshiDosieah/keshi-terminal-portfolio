import { ChevronLeft, ChevronRight, Code2, Cpu, Database, Microscope, Terminal as TerminalIcon } from 'lucide-react';
import { useRef, useState, type DragEvent } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { projects, type Project, type ProjectCategory } from '../data';
import ProjectDetail from './ProjectDetail';

type ProjectFilter = 'all' | ProjectCategory;
const filters: Array<[ProjectFilter, string]> = [
  ['all', 'All projects'],
  ['web-apps', 'Web apps'],
  ['research', 'Research'],
  ['data-eng', 'Data engineering'],
  ['others', 'Other projects'],
];

function matchesFilter(project: Project, filter: ProjectFilter): boolean {
  return filter === 'all' || project.category === filter;
}

function isProjectCategory(value: string | null): value is ProjectCategory {
  return value === 'web-apps' || value === 'research' || value === 'data-eng' || value === 'others';
}

const categoryLabels: Record<ProjectCategory, string> = {
  'web-apps': 'Web apps',
  research: 'Research',
  'data-eng': 'Data engineering',
  others: 'Other projects',
};

function ProjectIcon({ project }: { project: Project }) {
  const Icon = project.category === 'web-apps'
    ? Code2
    : project.category === 'research'
      ? Microscope
      : project.category === 'data-eng'
        ? Database
        : Cpu;
  return <Icon className="project-entry-icon" aria-hidden="true" />;
}

function ProjectPreview({ project }: { project: Project }) {
  const projectCategory = project.category;
  const isEngineering = projectCategory === 'web-apps';
  const isResearch = projectCategory === 'research';
  const isData = projectCategory === 'data-eng';
  const accent = isEngineering ? '#6aa7f2' : isResearch ? '#9a82ec' : isData ? '#55c7c2' : '#f0a36f';

  return (
    <svg
      className={`project-preview project-preview--${projectCategory}`}
      viewBox="0 0 320 180"
      role="img"
      aria-label={`${project.title} preview`}
    >
      <defs>
        <linearGradient id={`preview-bg-${project.slug}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={isEngineering ? '#1b2c43' : isResearch ? '#20243d' : isData ? '#173238' : '#39283b'} />
          <stop offset="1" stopColor="#11151d" />
        </linearGradient>
        <radialGradient id={`preview-glow-${project.slug}`}>
          <stop offset="0" stopColor={accent} stopOpacity=".6" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#preview-bg-${project.slug})`} />
      <circle cx="258" cy="28" r="118" fill={`url(#preview-glow-${project.slug})`} />
      <path d="M0 48H320" stroke="#ffffff" strokeOpacity=".13" />
      <circle cx="17" cy="24" r="4" fill="#ff7772" />
      <circle cx="31" cy="24" r="4" fill="#f3c86b" />
      <circle cx="45" cy="24" r="4" fill="#8bcda0" />
      <rect x="64" y="19" width="93" height="10" rx="3" fill="#dbe6f5" fillOpacity=".22" />
      <rect x="18" y="66" width="47" height="96" rx="5" fill="#0c1018" fillOpacity=".72" stroke="#ffffff" strokeOpacity=".13" />
      {isEngineering ? (
        <>
          <rect x="28" y="78" width="26" height="5" rx="2" fill="#91baff" />
          <rect x="28" y="93" width="21" height="4" rx="2" fill="#aab6c8" fillOpacity=".35" />
          <rect x="28" y="106" width="25" height="4" rx="2" fill="#aab6c8" fillOpacity=".35" />
          <rect x="28" y="119" width="18" height="4" rx="2" fill="#aab6c8" fillOpacity=".35" />
          <rect x="78" y="66" width="224" height="26" rx="5" fill="#111720" stroke="#ffffff" strokeOpacity=".14" />
          <rect x="91" y="76" width="74" height="6" rx="3" fill="#e2e8f0" fillOpacity=".65" />
          <rect x="249" y="75" width="40" height="8" rx="4" fill="#8bcda0" fillOpacity=".75" />
          <rect x="78" y="101" width="68" height="61" rx="5" fill="#121821" stroke="#ffffff" strokeOpacity=".12" />
          <rect x="154" y="101" width="68" height="61" rx="5" fill="#121821" stroke="#ffffff" strokeOpacity=".12" />
          <rect x="230" y="101" width="72" height="61" rx="5" fill="#121821" stroke="#ffffff" strokeOpacity=".12" />
          <path d="M90 148V135h8v13m8 0v-24h8v24m8 0v-17h8v17m8 0v-31h8v31" fill="#91baff" fillOpacity=".78" />
          <path d="M166 148V132h8v16m8 0v-29h8v29m8 0v-22h8v22" fill="#73d0b1" fillOpacity=".8" />
          <path d="M242 148v-21h8v21m8 0v-34h8v34m8 0v-17h8v17m8 0v-26h8v26" fill="#c3a6ff" fillOpacity=".78" />
        </>
      ) : isResearch ? (
        <>
          <rect x="28" y="78" width="26" height="5" rx="2" fill={accent} />
          <rect x="28" y="93" width="21" height="4" rx="2" fill="#aab6c8" fillOpacity=".35" />
          <rect x="28" y="106" width="25" height="4" rx="2" fill="#aab6c8" fillOpacity=".35" />
          <rect x="78" y="66" width="224" height="96" rx="5" fill="#121720" stroke="#ffffff" strokeOpacity=".14" />
          <text x="94" y="84" fill="#aab6c8" fontSize="7" fontFamily="monospace">MODEL EVALUATION</text>
          <rect x="92" y="102" width="52" height="40" rx="4" fill="#202c43" stroke={accent} strokeOpacity=".8" />
          <text x="106" y="119" fill="#cbdcff" fontSize="7" fontFamily="monospace">MODEL</text>
          <path d="M144 122h23" stroke="#9eabc1" strokeWidth="1.5" />
          <path d="m162 117 6 5-6 5" fill="none" stroke="#9eabc1" strokeWidth="1.5" />
          <rect x="168" y="102" width="52" height="40" rx="4" fill="#2a2540" stroke={accent} strokeOpacity=".8" />
          <text x="178" y="119" fill="#e0d5ff" fontSize="7" fontFamily="monospace">COMPARE</text>
          <path d="M220 122h20" stroke="#9eabc1" strokeWidth="1.5" />
          <path d="m235 117 6 5-6 5" fill="none" stroke="#9eabc1" strokeWidth="1.5" />
          <rect x="242" y="102" width="47" height="40" rx="4" fill="#26302b" stroke="#8bcda0" strokeOpacity=".8" />
          <text x="250" y="119" fill="#c9f1d2" fontSize="7" fontFamily="monospace">REPORT</text>
        </>
      ) : isData ? (
        <>
          <rect x="28" y="78" width="26" height="5" rx="2" fill={accent} />
          <rect x="28" y="93" width="21" height="4" rx="2" fill="#aab6c8" fillOpacity=".35" />
          <rect x="28" y="106" width="25" height="4" rx="2" fill="#aab6c8" fillOpacity=".35" />
          <rect x="78" y="66" width="224" height="96" rx="5" fill="#121720" stroke="#ffffff" strokeOpacity=".14" />
          <text x="94" y="84" fill="#aab6c8" fontSize="7" fontFamily="monospace">LIVE SENSOR PIPELINE</text>
          <path d="M94 132h22l12-20 14 29 13-21 13 12h16l12-29 13 31 12-17 12 15h35" fill="none" stroke={accent} strokeWidth="2" />
          <path d="M94 145h196" stroke="#aab6c8" strokeOpacity=".2" />
          <circle cx="287" cy="95" r="4" fill="#8bcda0" />
        </>
      ) : (
        <>
          <rect x="28" y="78" width="26" height="5" rx="2" fill={accent} />
          <rect x="28" y="93" width="21" height="4" rx="2" fill="#aab6c8" fillOpacity=".35" />
          <rect x="28" y="106" width="25" height="4" rx="2" fill="#aab6c8" fillOpacity=".35" />
          <rect x="78" y="66" width="224" height="96" rx="5" fill="#121720" stroke="#ffffff" strokeOpacity=".14" />
          <text x="94" y="84" fill="#aab6c8" fontSize="7" fontFamily="monospace">CONNECTED SYSTEM</text>
          <rect x="91" y="104" width="48" height="36" rx="4" fill="#202c43" stroke={accent} strokeOpacity=".8" />
          <text x="99" y="126" fill="#dbe6f5" fontSize="7" fontFamily="monospace">INPUT</text>
          <path d="M139 122h22" stroke="#9eabc1" strokeWidth="1.5" />
          <path d="m156 117 6 5-6 5" fill="none" stroke="#9eabc1" strokeWidth="1.5" />
          <rect x="164" y="104" width="48" height="36" rx="4" fill="#2a2540" stroke={accent} strokeOpacity=".8" />
          <text x="171" y="126" fill="#e0d5ff" fontSize="7" fontFamily="monospace">PROCESS</text>
          <path d="M212 122h22" stroke="#9eabc1" strokeWidth="1.5" />
          <path d="m229 117 6 5-6 5" fill="none" stroke="#9eabc1" strokeWidth="1.5" />
          <rect x="236" y="104" width="52" height="36" rx="4" fill="#26302b" stroke="#8bcda0" strokeOpacity=".8" />
          <text x="245" y="126" fill="#c9f1d2" fontSize="7" fontFamily="monospace">OUTPUT</text>
        </>
      )}
    </svg>
  );
}

export default function Projects() {
  const [params, setParams] = useSearchParams();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isDragOver, setIsDragOver] = useState(false);
  const cartridgeListRef = useRef<HTMLDivElement>(null);
  const requestedFilter = params.get('type');
  const filter: ProjectFilter = isProjectCategory(requestedFilter)
    ? requestedFilter
    : requestedFilter === 'engineering'
      ? 'web-apps'
      : requestedFilter === 'ml'
        ? 'data-eng'
        : 'all';
  const filtered = projects.filter((project) => matchesFilter(project, filter));
  const selectedProject = projects.find((project) => project.slug === slug);

  if (slug && !selectedProject) return <Navigate to="/projects" replace />;

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const droppedValue =
      event.dataTransfer.getData('application/x-project-memory-card') ||
      event.dataTransfer.getData('text/plain');
    const droppedProject = projects.find(
      (project) => droppedValue === project.slug || droppedValue.endsWith(`/projects/${project.slug}`),
    );
    if (droppedProject) {
      navigate(`/projects/${droppedProject.slug}`);
    }
  };

  return (
    <div className={`document-page projects-page w-full${selectedProject ? ' has-loaded-project' : ''}`}>
      <p className="skill-browser-path"><span>~/</span>projects/</p>
      <h1 className="toolkit-title">Memory card reader.</h1>
      <p className="projects-intro">Choose a project card or drop it into the reader.</p>

      <div className="projects-filter-list" role="group" aria-label="Filter projects">
        {filters.map(([value, label]) => {
          const count = projects.filter((project) => matchesFilter(project, value)).length;
          return (
            <button
              key={value}
              className={`projects-filter projects-filter--${value}${filter === value ? ' is-selected' : ''}`}
              aria-pressed={filter === value}
              onClick={() => setParams(value === 'all' ? {} : { type: value })}
            >
              {label}<span>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="project-machine-layout">
        <nav className="project-cartridge-bay" aria-label="Project memory cards">
          <div className="project-cartridge-bay-heading">
            <span>MEMORY CARDS</span>
            <div className="project-cartridge-controls">
              <span>{filtered.length} / {projects.length}</span>
              <button
                type="button"
                aria-label="Scroll to previous project cards"
                onClick={() => cartridgeListRef.current?.scrollBy({ left: -260, behavior: 'smooth' })}
              >
                <ChevronLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Scroll to next project cards"
                onClick={() => cartridgeListRef.current?.scrollBy({ left: 260, behavior: 'smooth' })}
              >
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="project-cartridge-list" ref={cartridgeListRef}>
            {filtered.map((project) => {
              const projectCategory = project.category;
              return (
                <Link
                  className={`project-cartridge project-cartridge--${projectCategory}${project.slug === slug ? ' is-loaded' : ''}`}
                  key={project.slug}
                  to={`/projects/${project.slug}`}
                  draggable
                  aria-current={project.slug === slug ? 'page' : undefined}
                  onDragStart={(event) => {
                    event.dataTransfer.setData('text/plain', project.slug);
                    event.dataTransfer.setData('application/x-project-memory-card', project.slug);
                    event.dataTransfer.effectAllowed = 'copy';
                  }}
                >
                  <span className="project-memory-card-label">
                    <ProjectIcon project={project} />
                    <span>SD / {categoryLabels[projectCategory].toUpperCase()}</span>
                  </span>
                  <ProjectPreview project={project} />
                  <span className="project-cartridge-name">{project.title}</span>
                  <span className="project-cartridge-summary">{project.summary}</span>
                  <span className="project-cartridge-kind">{categoryLabels[projectCategory]}</span>
                  <span className="project-cartridge-contacts" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </nav>

        <div
          className={`project-reader-hardware${isDragOver ? ' is-drag-over' : ''}`}
          role="region"
          aria-label="Memory card reader. Drop a project memory card here."
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
            setIsDragOver(true);
          }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setIsDragOver(false);
            }
          }}
          onDrop={handleDrop}
        >
          <header className="project-reader-hardware-header" aria-hidden="true">
            <span className="project-reader-hardware-name">SD / SDHC CARD READER</span>
            <span className="project-reader-hardware-spec">USB 3.0 · PORT 01</span>
          </header>
          <div className="project-reader-slot-track" aria-hidden="true">
            <span className="project-reader-slot-notch" />
            <i /><i /><i /><i /><i /><i /><i /><i />
            <span className="project-reader-slot-light" />
          </div>
          <div className="project-reader-drop-zone">
            {selectedProject ? (
              <ProjectDetail key={selectedProject.slug} />
            ) : (
              <section className="project-reader-empty" aria-label="Empty memory card reader">
                <header className="project-terminal-titlebar">
                  <div className="project-terminal-controls" aria-hidden="true"><i /><i /><i /></div>
                  <span className="project-terminal-filename"><TerminalIcon aria-hidden="true" /><span>MEMORY_READER / EMPTY</span></span>
                  <span className="project-reader-eject-placeholder" aria-hidden="true">—</span>
                </header>
                <div className="project-reader-empty-screen">
                  <span className="project-reader-slot" aria-hidden="true"><i /></span>
                  <p>$ await memory_card<span className="project-cursor">_</span></p>
                  <span>INSERT OR DROP A MEMORY CARD</span>
                </div>
                <footer className="project-terminal-statusbar"><span><i aria-hidden="true" />NO CARD INSERTED</span></footer>
              </section>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
