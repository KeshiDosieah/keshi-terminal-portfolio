import { useLayoutEffect, useRef, useState } from 'react';
import { experience } from '../data';

type GraphPath = {
  d: string;
  branch: 'main' | 'software' | 'data';
  dashed?: boolean;
};

export default function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [graphPaths, setGraphPaths] = useState<GraphPath[]>([]);

  useLayoutEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const updatePaths = () => {
      const bounds = timeline.getBoundingClientRect();
      const nodes = Array.from(
        timeline.querySelectorAll<HTMLElement>('.git-graph-node'),
      );
      const points = new Map(nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return [node.dataset.graphNode ?? '', {
          x: rect.left + rect.width / 2 - bounds.left,
          y: rect.top + rect.height / 2 - bounds.top,
        }] as const;
      }));

      const bsc = points.get('bsc');
      const bigbang = points.get('bigbang');
      const dayforce = points.get('dayforce');
      const msc = points.get('msc');
      const merge = points.get('merge');
      const next = points.get('next');
      if (!bsc || !bigbang || !dayforce || !msc || !merge || !next) return;

      const softwareX = bigbang.x;
      const dataX = msc.x;
      const softwareSplitY = bsc.y + (bigbang.y - bsc.y) * 0.65;
      const dataSplitY = dayforce.y + (msc.y - dayforce.y) * 0.6;
      const joinMerge = (x: number) =>
        `L ${x} ${merge.y - 22} C ${x} ${merge.y - 8}, ${merge.x + 22} ${merge.y}, ${merge.x} ${merge.y}`;
      setGraphPaths([
        {
          branch: 'main',
          d: `M ${bsc.x} ${bsc.y} L ${merge.x} ${merge.y}`,
        },
        {
          branch: 'main',
          d: `M ${merge.x} ${merge.y} L ${next.x} ${next.y}`,
        },
        {
          branch: 'software',
          d: `M ${bsc.x} ${softwareSplitY} C ${bsc.x + 12} ${softwareSplitY}, ${softwareX} ${bigbang.y - 24}, ${softwareX} ${bigbang.y} L ${softwareX} ${dayforce.y}${joinMerge(softwareX)}`,
        },
        {
          branch: 'data',
          d: `M ${softwareX} ${dataSplitY} C ${softwareX + 12} ${dataSplitY}, ${dataX} ${msc.y - 24}, ${dataX} ${msc.y}${joinMerge(dataX)}`,
        },
        {
          branch: 'main',
          dashed: true,
          d: `M ${next.x} ${next.y} L ${next.x} ${bounds.height}`,
        },
      ]);
    };

    updatePaths();
    const resizeObserver = new ResizeObserver(updatePaths);
    resizeObserver.observe(timeline);
    window.addEventListener('resize', updatePaths);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePaths);
    };
  }, []);

  return (
    <div className="document-page experience-page w-full">
      <div className="breadcrumb">~/experience/</div>

      <h1>
        My journey<span className="title-period">.</span>
      </h1>

      <p className="page-lead">
        From curiosity to code, from code to data, and back to building
        meaningful things.
      </p>

      <div className="git-graph-header">
        <div className="git-command">
          <span className="git-prompt">$</span>
          git log --graph --branches --reverse
        </div>
        <div className="git-branches" aria-label="Timeline branches">
          <span className="branch-label branch-main"><i /> main</span>
          <span className="branch-label branch-software"><i /> software</span>
          <span className="branch-label branch-data"><i /> data</span>
        </div>
      </div>

      <div className="git-timeline" role="list" ref={timelineRef}>
        <svg className="git-graph-paths" aria-hidden="true">
          {graphPaths.map((path, index) => (
            <path
              className={`git-branch-path git-branch-path--${path.branch}${path.dashed ? ' git-branch-path--dashed' : ''}`}
              d={path.d}
              key={`timeline-path-${index}`}
            />
          ))}
        </svg>
        {experience.map((item) => (
          <article
            className={`git-entry git-entry--${item.branch}`}
            key={`${item.title}-${item.period}`}
            role="listitem"
          >
            <div className="git-graph-rail" aria-hidden="true">
              <span className="git-graph-node" data-graph-node={item.graphNode} />
              <span className="git-graph-connector" />
            </div>

            <div className="git-entry-content">
              <div className="git-entry-card">
                <div className="git-entry-topline">
                  <span className="git-period">{item.period}</span>
                  <span className="git-branch-name">
                    {item.branch === 'merge' ? 'HEAD → main' : item.branch}
                  </span>
                </div>

                <div className="git-commit-title">
                  <span className="git-commit-type">{item.commit}:</span>
                  <h2>{item.title}</h2>
                </div>

                <h3>{item.org}</h3>
                <p className="git-description">{item.description}</p>

                {item.highlights && (
                  <div className="git-highlights">
                    <span className="git-highlights-heading">@@ highlights @@</span>
                    {item.highlights.map((highlight) => (
                      <span key={highlight}>+ {highlight}</span>
                    ))}
                  </div>
                )}

                {item.metrics && (
                  <div className="git-metrics">
                    {item.metrics.map((metric) => (
                      <div key={metric.label}>
                        <strong>{metric.value}</strong>
                        <span>{metric.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="tag-list git-tags">
                  {item.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
        <article className="git-entry git-entry--main git-entry--next" role="listitem">
          <div className="git-graph-rail" aria-hidden="true">
            <span className="git-graph-node" data-graph-node="next" />
          </div>
          <div className="git-entry-content">
            <div className="git-entry-card">
              <div className="git-entry-topline">
                <span className="git-period">HEAD -&gt; main</span>
                <span className="git-category">Next Branch</span>
                <span className="git-branch-name">(feature/production-ai)</span>
              </div>
              <div className="git-commit-title">
                <span className="git-commit-type">git checkout -b</span>
                <h2>What&apos;s Next</h2>
              </div>
              <h3>Full-Stack · Data Engineering · Agentic AI</h3>
              <p className="git-description">
                Bridging robust software engineering with autonomous AI systems, building
                scalable web apps, streaming pipelines and models that work in production, not just notebooks.
              </p>
              <div className="tag-list git-tags">
                {[
                  'Full-Stack Architecture',
                  'Data Pipelines',
                  'Agentic Systems',
                  'Cloud Native',
                  'Distributed ML',
                ].map((focus) => (
                  <span key={focus}>{focus}</span>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>

      <div className="git-end-marker">
        <span className="git-end-dot" />
        <code>~/experience</code>
        <span>— end of timeline</span>
      </div>
    </div>
  );
}
