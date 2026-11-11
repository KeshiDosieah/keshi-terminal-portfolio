import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAbout = location.pathname === '/about';
  const isExperience = location.pathname === '/experience';
  const isProjects = location.pathname.startsWith('/projects');
  return <div className={`app-frame min-h-screen flex flex-col ${isHome ? 'is-home' : ''} ${isAbout ? 'is-about' : ''} ${isExperience ? 'is-experience' : ''}`}>
    <header className="topbar sticky top-0 z-10 flex items-center">
      <div className="window-controls" aria-hidden="true"><span /><span /><span /></div>
      <Link to="/" className="brand" aria-label="Keshi Dosieah home"><span className="brand-mark">kd</span><span>keshi@portfolio:~</span></Link>
      <nav className="top-nav" aria-label="Main navigation">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/experience">Experience</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
      <Link className="top-contact" to="/contact">Contact <span aria-hidden="true">↗</span></Link>
    </header>
    <div className="workspace-layout">
      <aside className="workspace-explorer" aria-label="File explorer">
        <p>FILE EXPLORER</p>
        <nav aria-label="Portfolio files">
          <NavLink to="/about"><span aria-hidden="true">▤</span> about.md</NavLink>
          <NavLink to="/projects"><span aria-hidden="true">▱</span> projects/</NavLink>
          <NavLink to="/experience"><span aria-hidden="true">▱</span> experience/</NavLink>
          <NavLink to="/toolkit"><span aria-hidden="true">▱</span> skills/</NavLink>
          <NavLink to="/contact"><span aria-hidden="true">▱</span> contact/</NavLink>
        </nav>
      </aside>
      <main className={`main-pane min-w-0 flex-1 ${isHome ? 'main-home' : ''}`} id="main">
        <div className={`page-content mx-auto w-full max-w-none ${isAbout ? 'about-content-page' : ''} ${isProjects ? 'projects-content-page' : ''}`}><Outlet /></div>
      </main>
    </div>
    {!isHome && !isAbout && <footer className="statusbar flex items-center justify-between"><div><span className="status-square light"/> main</div><div>Built with React</div><div>Software · Data · Applied AI</div></footer>}
  </div>;
}
