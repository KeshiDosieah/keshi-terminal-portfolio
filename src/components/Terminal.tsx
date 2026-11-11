import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { projects } from "../data";

type TerminalEntry =
  | { type: "command" | "output" | "system"; text: string }
  | {
      type:
        | "help"
        | "projects"
        | "milestones"
        | "experience_summary"
        | "about_summary"
        | "skills_summary";
    };

type BootLine = { text: string; delay: number };

const bootLines: BootLine[] = [
  { text: "SYSTEM :: portfolio runtime v1.0.0", delay: 180 },
  { text: "BACKGROUND :: BSc Computer Science • MSc Data Science (3+ YOE)", delay: 480 },
  { text: "CORE :: Full-stack apps, data pipelines, applied AI. End to end.", delay: 760 },
  { text: "Session active. Welcome.", delay: 1040 },
];

const help: [string, string][] = [
  ["help", "See all available options"],
  ["ls projects", "Browse selected projects with metadata"],
  ["cat about.md", "Read developer summary"],
  ["experience", "Brief career overview"],
  ["skills", "Summary of technical stack"],
  ["contact", "Find contact details"],
  ["clear", "Clear console output"],
];

export default function Terminal() {
  const [booted, setBooted] = useState<boolean>(false);
  const [bootIndex, setBootIndex] = useState<number>(0);
  const [input, setInput] = useState<string>("");
  const [history, setHistory] = useState<TerminalEntry[]>([]);
  const [commands, setCommands] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    bootLines.forEach((line, i) => {
      const timer = setTimeout(() => {
        setBootIndex(i + 1);
        if (i === bootLines.length - 1) {
          setTimeout(() => {
            setBooted(true);
            setHistory([
              {
                type: "output",
                text: "Hi, I'm Keshi — this terminal is your way in !",
              },
              {
                type: "output",
                text: 'Type "help" to see commands, or "ls projects" to browse work.',
              },
            ]);
          }, 250);
        }
      }, line.delay);
      timers.push(timer);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (booted) inputRef.current?.focus();
  }, [booted]);

  useEffect(() => {
    if (outputRef.current)
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [history, bootIndex]);

  
  function runCommand(raw: string): void {
  const command = raw.trim();
  if (!command || !booted) return;
  setCommands((old) => [...old, command]);
  
  // Clean raw input
  const c = command.toLowerCase().replace(/\s+/g, " ").trim();

  if (c === "clear") {
    setHistory([]);
    setInput("");
    return;
  }

  const next: TerminalEntry[] = [
    ...history,
    { type: "command", text: command },
  ];
  let response: TerminalEntry;

  // 1. HELP & COMMANDS
  if (["help", "?", "commands", "menu"].includes(c)) {
    response = { type: "help" };
  } 

  // 2. PROJECTS / WORK / PORTFOLIO
  else if (
    [
      "ls",
      "dir",
      "ls projects",
      "projects",
      "project",
      "show projects",
      "work",
      "portfolio",
      "projects list",
    ].includes(c)
  ) {
    response = { type: "projects" };
  } 

  // 3. EXPERIENCE / CAREER / EDUCATION
  else if (
    [
      "experience",
      "education",
      "work history",
      "career",
      "jobs",
      "background",
    ].includes(c) ||
    c.includes("career") ||
    c.includes("work history") ||
    c.includes("education")
  ) {
    response = { type: "experience_summary" };
  } 

  // 4. SKILLS / TECH STACK
  else if (
    ["toolkit", "skills", "stack", "tech"].includes(c) ||
    c.includes("technologies")
  ) {
    response = { type: "skills_summary" };
  } 

  // 5. ABOUT / WHOAMI
  else if (
    ["about", "whoami", "who am i", "cat about.md", "about me"].includes(c) ||
    c.includes("tell me about yourself")
  ) {
    response = { type: "about_summary" };
  } 

  // 6. CONTACT
  else if (
    c === "contact" ||
    c.includes("get in touch") ||
    c.includes("email")
  ) {
    response = {
      type: "output",
      text: "Email: keshi@example.com | GitHub: github.com/keshimods | LinkedIn: linkedin.com/in/keshi",
    };
  } 

  // 7. OPEN PROJECT (Improved String Parsing)
  else if (c.startsWith("open ")) {
    // Extract target string and clean out brackets, quotes, .md extensions, and underscores
    const rawTarget = command.slice(5).trim();
    const query = rawTarget
      .replace(/[<>'"\`]/g, "") // Strips < > ' " `
      .replace(/\.md$/i, "")    // Strips trailing .md
      .replaceAll("_", "-")
      .replaceAll(" ", "-")
      .toLowerCase();

    const project = projects.find(
      (p) =>
        p.slug.toLowerCase() === query ||
        p.slug.toLowerCase().includes(query) ||
        p.title.toLowerCase() === rawTarget.toLowerCase() ||
        p.title.toLowerCase().replace(/\s+/g, "-") === query
    );

    if (project) {
      navigate(`/projects/${project.slug}`);
      return;
    }

    response = {
      type: "output",
      text: `Project "${rawTarget}" not found. Type "ls projects" to see available options.`,
    };
  } 

  // 8. UTILITIES
  else if (c === "pwd") {
    response = { type: "output", text: "/home/keshi/portfolio" };
  } else if (c === "git log") {
    response = { type: "milestones" };
  } 

  // FALLBACK
  else {
    response = {
      type: "output",
      text: `Command not recognized: "${command}". Type "help" or "ls projects".`,
    };
  }

  setHistory([...next, response]);
  setInput("");
}

  function onSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    runCommand(input);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "ArrowUp" && commands.length) {
      e.preventDefault();
      setInput(commands[commands.length - 1]);
    }
    if (e.key === "Tab") {
      const options = [
        "help",
        "ls projects",
        "cat about.md",
        "experience",
        "skills",
        "contact",
        "git log",
        "clear",
      ];
      const match = options.find((option) =>
        option.startsWith(input.toLowerCase())
      );
      if (match) {
        e.preventDefault();
        setInput(match);
      }
    }
  }

  return (
    <section
      className={`terminal w-full overflow-hidden bg-neutral-950 font-mono text-sm leading-relaxed ${
        booted ? "terminal-ready" : "terminal-booting"
      }`}
      aria-label="Interactive portfolio terminal"
    >
      {/* Terminal Title Bar */}
      <div className="terminal-bar flex items-center justify-between px-3 py-1.5 bg-neutral-900 border-b border-neutral-800 text-xs text-neutral-400 select-none">
        <div className="terminal-window-title flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="terminal-window-name ml-2 font-semibold text-neutral-300">
            keshi@portfolio: ~
          </span>
        </div>
        <div className="terminal-bar-status text-[11px] font-medium tracking-wider">
          {booted ? (
            <span className="text-emerald-400">● ACTIVE</span>
          ) : (
            <span className="text-amber-400 animate-pulse">● BOOTING</span>
          )}
        </div>
      </div>

      {/* Output Console */}
      <div
        className="terminal-output p-4 overflow-y-auto max-h-[600px] text-xs space-y-3"
        ref={outputRef}
        aria-live="polite"
      >
        {/* Boot sequence */}
        {bootLines.slice(0, bootIndex).map((line, i) => (
          <div className="boot-line flex gap-2" key={line.text}>
            <span
              className={
                i < bootIndex - 1 || booted
                  ? "text-emerald-400 font-semibold"
                  : "text-neutral-600"
              }
            >
              {i < bootIndex - 1 || booted ? "[ OK ]" : "[ .. ]"}
            </span>
            <span className="text-neutral-400">{line.text}</span>
          </div>
        ))}

        {booted && (
          <>
            <div className="terminal-divider my-2 border-b border-neutral-800/80" />
            {history.map((line, i) => (
              <div className="terminal-row my-2" key={`${i}-${line.type}`}>
                {/* Command Input Row */}
                {line.type === "command" && (
                  <div className="flex gap-2 items-center text-xs">
                    <span className="text-emerald-400 font-semibold">
                      keshi@portfolio:~$
                    </span>
                    <span className="text-white font-medium">{line.text}</span>
                  </div>
                )}

                {/* Generic Plain Output */}
                {(line.type === "output" || line.type === "system") && (
                  <div className="text-neutral-300 pl-2 border-l border-neutral-800">
                    {line.text}
                  </div>
                )}

                {/* Help Command Output */}
                {line.type === "help" && (
                  <div className="space-y-1.5 pl-2 my-2">
                    <div className="text-neutral-500 text-[11px]">
                      AVAILABLE COMMANDS:
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                      {help.map(([cmd, desc]) => (
                        <div key={cmd} className="flex items-baseline gap-2">
                          <code className="text-cyan-400 font-semibold shrink-0">
                            {cmd}
                          </code>
                          <span className="text-neutral-500 text-[11px] truncate">
                            {desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects Output (LS -LA style) */}
                {line.type === "projects" && (
                  <div className="my-2 space-y-1">
                    <div className="text-neutral-500 text-[11px] flex justify-between border-b border-neutral-800 pb-1 mb-1 font-mono">
                      <span>total {projects.length} directories</span>
                      <span>click item or run 'open &lt;slug&gt;'</span>
                    </div>

                    {projects.map((p) => (
                      <button
                        key={p.slug}
                        onClick={() => navigate(`/projects/${p.slug}`)}
                        className="w-full text-left font-mono text-xs py-1 px-1.5 hover:bg-neutral-800/60 rounded flex items-center justify-between gap-3 group transition-colors cursor-pointer border-none bg-transparent"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-neutral-600 font-mono text-[11px] hidden sm:inline">
                            drwxr-xr-x
                          </span>
                          <span className="text-cyan-400 font-semibold group-hover:text-cyan-300 group-hover:underline shrink-0">
                            {p.slug}/
                          </span>
                          <span className="text-neutral-400 truncate text-[11px]">
                            {p.summary}
                          </span>
                        </div>
                        <span className="text-emerald-400/70 group-hover:text-emerald-400 font-mono text-[11px] shrink-0">
                          [view ↗]
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Experience Summary */}
                {line.type === "experience_summary" && (
                  <div className="my-2 font-mono text-xs pl-2 border-l-2 border-amber-500/40 space-y-1.5 py-1">
                    <div className="text-amber-400 font-semibold">
                      ┌── [EXPERIENCE SUMMARY]
                    </div>
                    <p className="text-neutral-300">
                      • 3+ YOE Commercial Software Engineering & Applied AI
                    </p>
                    <p className="text-neutral-400">
                      • High-scale backend services, data pipelines, LLM fine-tuning
                    </p>
                    <div className="pt-1">
                      <Link
                        to="/experience"
                        className="text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1 font-semibold"
                      >
                        └─ execute 'cat full_experience.log' ↗
                      </Link>
                    </div>
                  </div>
                )}

                {/* Skills Summary */}
                {line.type === "skills_summary" && (
                  <div className="my-2 font-mono text-xs pl-2 border-l-2 border-cyan-500/40 space-y-1.5 py-1">
                    <div className="text-cyan-400 font-semibold">
                      ┌── [TECHNICAL STACK]
                    </div>
                    <div className="text-neutral-300">
                      <span className="text-amber-400 font-medium">
                        STACK:
                      </span>{" "}
                      Python, TypeScript, React, Node.js, PostgreSQL, Docker
                    </div>
                    <div className="text-neutral-300">
                      <span className="text-amber-400 font-medium">
                        AI / ML:
                      </span>{" "}
                      PyTorch, LangChain, RAG Systems, Model Tuning, Data
                      Pipelines
                    </div>
                    <div className="pt-1">
                      <Link
                        to="/toolkit"
                        className="text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1 font-semibold"
                      >
                        └─ inspect full toolkit matrix ↗
                      </Link>
                    </div>
                  </div>
                )}

                {/* About Summary */}
                {line.type === "about_summary" && (
                  <div className="my-2 font-mono text-xs pl-2 border-l-2 border-emerald-500/40 space-y-1.5 py-1">
                    <div className="text-emerald-400 font-semibold">
                      ┌── [ABOUT DEVELOPER]
                    </div>
                    <p className="text-neutral-300">
                      Software engineer with a BSc in CS and MSc in Data Science.
                    </p>
                    <p className="text-neutral-400">
                      Specialized in production-grade GenAI and distributed backends.
                    </p>
                    <div className="pt-1">
                      <Link
                        to="/about"
                        className="text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1 font-semibold"
                      >
                        └─ read complete bio (about.md) ↗
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Input Form */}
      {booted && (
        <form
          className="terminal-form flex items-center gap-2 px-4 py-2 bg-neutral-950 border-t border-neutral-800"
          onSubmit={onSubmit}
        >
          <label
            htmlFor="terminal-command"
            className="text-emerald-400 font-bold font-mono text-xs shrink-0"
          >
            keshi@portfolio:~$
          </label>
          <input
            ref={inputRef}
            id="terminal-command"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type 'help' or 'ls projects'"
            className="bg-transparent border-none outline-none text-white font-mono text-xs w-full focus:ring-0 placeholder:text-neutral-600"
            autoComplete="off"
            spellCheck="false"
          />
          <button
            type="submit"
            className="text-neutral-600 hover:text-emerald-400 font-mono text-xs transition-colors"
          >
            [↵]
          </button>
        </form>
      )}

      {/* Booting Progress Indicator */}
      {!booted && (
        <div className="terminal-boot-progress w-full h-1 bg-neutral-900 overflow-hidden">
          <div
            className="h-full bg-emerald-400 transition-all duration-300"
            style={{
              width: `${Math.min(100, (bootIndex / bootLines.length) * 100)}%`,
            }}
          />
        </div>
      )}
    </section>
  );
}