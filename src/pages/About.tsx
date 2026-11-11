import profilePhoto from '../assets/about/keshi.png';
import { Link } from 'react-router-dom';

const introduction = {
  title: 'About Me',
  copy: "Hi, I'm Keshi. A software engineer with a background in data science and a passion for building useful, scalable systems. I enjoy turning complex problems into practical solutions, whether that's through clean code, data, or AI.",
  philosophy: 'I enjoy making sense of the mess. Whether it is vague requirements, an unfamiliar tech stack, or a problem with no obvious starting point, I like breaking things down, connecting the dots, and figuring out what needs to happen next. I stay organised, think ahead, and keep the bigger picture in mind while working through the little details. It\'s about turning uncertainty into a clear plan, then bringing that plan to life one piece at a time.',
  tagline: 'Building · Learning · Exploring',
};

const personality = {
  type: 'INFJ',
  label: 'THE ADVOCATE',
  summary: 'Deep thinker. Quiet builder. Big dreams.',
  copy: 'I\'m drawn to the space between what is and what could be. I like understanding the bigger picture, finding meaning in the details, and turning ambitious ideas into something tangible. Whether I\'m building a system or working with people, I want to leave things better than I found them.',
  traits: ['Curious about the why, not just the how', 'Leads through understanding and intention', 'Builds with purpose, not just possibility'],
};

const interests = [
  { icon: '</>', title: 'Building', description: 'Systems, products, and solutions that make life easier.', tone: 'green' },
  { icon: '▣', title: 'Learning', description: 'New technologies, ideas, and perspectives (always).', tone: 'violet' },
  { icon: '⌁', title: 'Nature & Travel', description: 'The world is too beautiful to stay in one place.', tone: 'blue' },
  { icon: '♫', title: 'Music', description: 'A soundtrack spanning eras, moods, and memories.', tone: 'yellow' },
  { icon: '☕', title: 'Good Food', description: 'If it’s drowning in broth, extra spicy, or freshly baked, count me in.', tone: 'pink' },
];

const technicalSkills = [
  { name: 'C# / .NET', icon: '♯', tone: 'purple' },
  { name: 'React', icon: '⚛', tone: 'cyan' },
  { name: 'TypeScript', icon: 'TS', tone: 'blue' },
  { name: 'Python', icon: 'Py', tone: 'blue' },
  { name: 'FastAPI', icon: '⚡', tone: 'yellow' },
  { name: 'REST APIs', icon: '🔌', tone: 'yellow' },
  { name: 'PostgreSQL / SQL', icon: '◉', tone: 'blue' },
  { name: 'LangGraph & RAG', icon: '⛓', tone: 'green' },
  { name: 'Apache Spark', icon: '✴', tone: 'pink' },
  { name: 'Docker', icon: '▤', tone: 'cyan' },
  { name: 'Azure DevOps', icon: '☁', tone: 'blue' },
  { name: 'Git', icon: '⎇', tone: 'yellow' },
];

function SectionHeading({ icon, children }: { icon: string; children: string }) {
  return <h2 className="about-new-section-heading"><span aria-hidden="true">{icon}</span>{children}</h2>;
}

function ProfileIcon({ name }: { name: string }) {
  const commonProps = {
    'aria-hidden': true as const,
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.7,
    viewBox: '0 0 24 24',
  };

  switch (name) {
    case 'location':
      return <svg {...commonProps}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
    case 'education':
      return <svg {...commonProps}><path d="m2 9 10-5 10 5-10 5L2 9Z" /><path d="M6 11v5c4 3 8 3 12 0v-5M22 9v6" /></svg>;
    case 'experience':
      return <svg {...commonProps}><path d="m8 8-4 4 4 4m8-8 4 4-4 4m-2-11-4 14" /></svg>;
    case 'languages':
      return <svg {...commonProps}><circle cx="12" cy="12" r="10" /><path d="M2 12h20m-10-10a15 15 0 0 1 0 20m0-20a15 15 0 0 0 0 20" /></svg>;
    case 'origin':
      return <svg {...commonProps}><path d="M5 21V5m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0" /></svg>;
    case 'next':
      return <svg {...commonProps}><path d="M7 17 17 7M8 7h9v9" /></svg>;
    default:
      return null;
  }
}

export default function About() {
  return (
    <article className="about-workspace about-redesign document-page w-full">
      <div className="about-editor-tab" aria-label="Current file">
        <span className="about-file-icon" aria-hidden="true">♧</span>
        <span>about.md</span>
        <span className="about-tab-close" aria-hidden="true">×</span>
      </div>

      <div className="about-file-body about-new-body">
        <div className="about-new-grid">
          <section className="about-new-card about-new-intro">
            <p className="about-new-command"><span>keshi@portfolio:~$</span> cat about.md</p>
            <h1><span aria-hidden="true">&gt;</span> {introduction.title}</h1>
            <p className="about-new-intro-copy">{introduction.copy}</p>
            <h2 className="about-work-philosophy-heading">Work Philosophy</h2>
            <p className="about-new-intro-copy about-work-philosophy-copy">{introduction.philosophy}</p>
            <p className="about-new-tagline"><span aria-hidden="true">ϟ</span> {introduction.tagline}</p>
          </section>

          <section className="about-new-card about-new-portrait" aria-label="Profile portrait">
            <div className="about-new-portrait-art">
              <img src={profilePhoto} alt="Keshi Rodasi Dosieah" />
            </div>
          </section>

          <div className="about-new-profile-column">
            <section className="about-new-card about-new-details" aria-label="Profile details">
              <header className="about-profile-header">
                <h2>Keshi Rodasi Dosieah</h2>
                <div className="about-profile-role">
                  <span>Software Engineer</span>
                  <i aria-hidden="true" />
                  <p>3+ Years Experience</p>
                </div>
              </header>
              <div className="about-profile-grid">
                <section className="about-profile-row">
                  <div className="about-profile-row-label"><ProfileIcon name="location" /><span>Based in</span></div>
                  <div className="about-profile-row-value">
                    <strong>Nottingham, UK 🇬🇧</strong>
                  </div>
                </section>
                <section className="about-profile-row">
                  <div className="about-profile-row-label"><ProfileIcon name="origin" /><span>Originally from</span></div>
                  <div className="about-profile-row-value">
                    <strong>Mauritius 🇲🇺</strong>
                  </div>
                </section>
                <section className="about-profile-row">
                  <div className="about-profile-row-label"><ProfileIcon name="education" /><span>Education</span></div>
                  <div className="about-profile-row-value about-profile-education">
                    <strong>BSc Computer Science</strong>
                    <strong>MSc Data Science</strong>
                  </div>
                </section>
                <section className="about-profile-row">
                  <div className="about-profile-row-label"><ProfileIcon name="languages" /><span>Languages</span></div>
                  <div className="about-profile-languages" aria-label="English, French, and Creole">
                    <span>English</span><span>French</span><span>Creole</span>
                  </div>
                </section>
                <section className="about-profile-row">
                  <div className="about-profile-row-label"><ProfileIcon name="next" /><span>Next chapter</span></div>
                  <div className="about-profile-row-value">
                    <strong>Open to opportunities across Europe 🌍</strong>
                  </div>
                </section>
              </div>
            </section>

            <section className="about-new-card about-new-placeholder about-new-current">
              <SectionHeading icon="◎">Currently</SectionHeading>
              <div className="about-new-input"> &gt; Applying Agentic AI and uncertainty quantification to multimodal EEG-audio data for mental health applications (publication in progress)<span aria-hidden="true">▮</span></div>
            </section>

          </div>

          <section className="about-new-card about-new-personality">
            <div className="about-personality-heading">
              <SectionHeading icon="◉">{personality.type}</SectionHeading>
              <span className="about-personality-label">{personality.label} ◇</span>
            </div>
            <p className="about-personality-summary">{personality.summary}</p>
            <p className="about-personality-copy">{personality.copy}</p>
            <ul className="about-personality-traits">
              {personality.traits.map((trait) => <li key={trait}>→ <span>{trait}</span></li>)}
            </ul>
          </section>

          <section className="about-new-card about-new-interests">
            <SectionHeading icon="✧">What I Love</SectionHeading>
            <ul className="about-interest-list">
              {interests.map(({ icon, title, description, tone }) => (
                <li className="about-interest-row" key={title}>
                  <span className={`about-interest-icon tone-${tone}`} aria-hidden="true">{icon}</span>
                  <div><strong className={`text-${tone}`}>{title}</strong><p>{description}</p></div>
                </li>
              ))}
            </ul>
          </section>

          <section className="about-new-card about-new-skills">
            <SectionHeading icon="</>">Technical Skills</SectionHeading>
            <ul className="about-skill-list">
              {technicalSkills.map(({ name, icon, tone }) => (
                <li className={`tone-${tone}`} key={name}>
                  <span aria-hidden="true">{icon}</span>{name}
                </li>
              ))}
            </ul>

            <div className="about-skills-footer">
              <Link to="/toolkit" className="about-skills-link">
                Explore Complete Stack <span aria-hidden="true">→</span>
              </Link>
            </div>
        </section>
        </div>

        <footer className="about-new-footer">
          <span><span>keshi@portfolio:~$</span> <i aria-hidden="true" /></span>
          <div>Let’s build something great <span aria-hidden="true">→</span> <Link to="/contact">contact</Link></div>
        </footer>
      </div>
    </article>
  );
}
