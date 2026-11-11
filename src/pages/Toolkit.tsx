import React from 'react';
import { 
  Code2, 
  Server, 
  Layout, 
  Bot, 
  Database, 
  HardDrive, 
  CheckCircle2, 
  GitBranch, 
  Folder,
  ChevronRight 
} from 'lucide-react';
import { toolkit } from '../data';

// 1. Icon mapping for each directory slug
const FOLDER_ICONS: Record<string, React.ElementType> = {
  'languages': Code2,
  'backend-apis': Server,
  'frontend-ui': Layout,
  'agentic-ai-ml': Bot,
  'data-engineering': Database,
  'databases': HardDrive,
  'testing-qa': CheckCircle2,
  'devops-infrastructure': GitBranch,
};

// 2. Color themes matching terminal directory semantics
export interface FolderTheme {
  iconColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export const FOLDER_THEMES: Record<string, FolderTheme> = {
  'languages': {
    iconColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/20',
    badgeText: 'text-emerald-300',
  },
  'backend-apis': {
    iconColor: 'text-sky-400',
    badgeBg: 'bg-sky-500/10',
    badgeBorder: 'border-sky-500/20',
    badgeText: 'text-sky-300',
  },
  'frontend-ui': {
    iconColor: 'text-violet-400',
    badgeBg: 'bg-violet-500/10',
    badgeBorder: 'border-violet-500/20',
    badgeText: 'text-violet-300',
  },
  'agentic-ai-ml': {
    iconColor: 'text-fuchsia-400',
    badgeBg: 'bg-fuchsia-500/10',
    badgeBorder: 'border-fuchsia-500/20',
    badgeText: 'text-fuchsia-300',
  },
  'data-engineering': {
    iconColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/20',
    badgeText: 'text-amber-300',
  },
  'databases': {
    iconColor: 'text-yellow-400',
    badgeBg: 'bg-yellow-500/10',
    badgeBorder: 'border-yellow-500/20',
    badgeText: 'text-yellow-300',
  },
  'testing-qa': {
    iconColor: 'text-rose-400',
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/20',
    badgeText: 'text-rose-300',
  },
  'devops-infrastructure': {
    iconColor: 'text-teal-400',
    badgeBg: 'bg-teal-500/10',
    badgeBorder: 'border-teal-500/20',
    badgeText: 'text-teal-300',
  },
};

const DEFAULT_THEME: FolderTheme = {
  iconColor: 'text-slate-400',
  badgeBg: 'bg-slate-800/50',
  badgeBorder: 'border-slate-700/50',
  badgeText: 'text-slate-300',
};

export default function Toolkit() {
  return (
    <div className="document-page toolkit-page w-full">
      <p className="skill-browser-path">
        <span>~/</span>skills/
      </p>
      
      <h1 className="toolkit-title">Technical toolkit.</h1>

      <div className="skill-browser">
        <div className="skill-folder-list">
          {toolkit.map((group) => {
            const IconComponent = FOLDER_ICONS[group.title] || Folder;
            const theme = FOLDER_THEMES[group.title] || DEFAULT_THEME;

            return (
              <section 
                className={`skill-folder skill-folder-${group.title}`} 
                key={group.title}
              >
                <h2 className="skill-folder-heading">
                  <IconComponent 
                    className={`skill-folder-icon w-5 h-5 transition-colors ${theme.iconColor}`} 
                    aria-hidden="true" 
                  />
                  <span>{group.title}/</span>
                </h2>

                <div className="skill-folder-items">
                  {group.items.map((item) => (
                    <span 
                      key={`${group.title}-${item}`}
                      className={`text-xs font-mono px-2.5 py-1 rounded-md border transition-all duration-150 ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <span className="skill-folder-chevron" aria-hidden="true">
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </span>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}