import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react';
import { Activity, AlertTriangle, Cpu, Images, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import ProjectGallery from './ProjectGallery';
import '@xyflow/react/dist/style.css';
import type { Project } from '../data';

type FlowLayout = 'wide' | 'tablet' | 'mobile';
type StoryData = {
  kind: 'challenge' | 'approach' | 'outcome';
  body?: string;
  steps?: string[];
};
type StoryNode = Node<StoryData, 'projectStory'>;

function StoryCard({ data }: NodeProps<StoryNode>) {
  const isChallenge = data.kind === 'challenge';
  const isApproach = data.kind === 'approach';
  const Icon = isChallenge ? AlertTriangle : isApproach ? SlidersHorizontal : ShieldCheck;
  const label = isChallenge ? 'INPUT NODE' : isApproach ? 'PROCESSING NODE' : 'OUTPUT NODE';
  const heading = isChallenge ? '01 / CHALLENGE' : isApproach ? '02 / APPROACH PIPELINE' : '03 / VERIFIED OUTCOME';

  return (
    <article className={`project-flow-node project-flow-node--${data.kind}`}>
      <Handle type="target" position={Position.Top} />
      <header>
        <span>{label}</span>
        <Icon aria-hidden="true" />
      </header>
      <h3>{heading}</h3>
      {data.steps ? (
        <ol>
          {data.steps.map((step, index) => (
            <li key={step}>
              <span className="project-flow-step-index">{String(index + 1).padStart(2, '0')}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p>{data.body}</p>
      )}
      {data.kind !== 'outcome' && <Handle type="source" position={Position.Bottom} />}
    </article>
  );
}

const nodeTypes = { projectStory: StoryCard };

function createNodes(project: Project, layout: FlowLayout): StoryNode[] {
  const isWide = layout === 'wide';
  const isMobile = layout === 'mobile';
  const x = isWide ? 18 : 14;
  const width = isWide ? 510 : isMobile ? 250 : 580;
  const challengeY = 18;
  const approachY = isMobile ? 230 : 190;
  const outcomeY = isMobile ? 580 : 440;

  return [
    {
      id: 'challenge',
      type: 'projectStory',
      position: { x, y: challengeY },
      style: { width },
      data: { kind: 'challenge', body: project.problem },
    },
    {
      id: 'approach',
      type: 'projectStory',
      position: { x, y: approachY },
      style: { width },
      data: { kind: 'approach', steps: project.approach },
    },
    {
      id: 'outcome',
      type: 'projectStory',
      position: { x, y: outcomeY },
      style: { width },
      data: { kind: 'outcome', body: project.outcome },
    },
  ];
}

function createEdges(project: Project): Edge[] {
  const color = 'var(--project-accent)';
  const edge = (id: string, source: string, target: string): Edge => ({
    id,
    source,
    target,
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed, color: accentFor(project) },
    style: { stroke: color, strokeWidth: 2.5 },
  });

  return [
    edge('challenge-to-approach', 'challenge', 'approach'),
    edge('approach-to-outcome', 'approach', 'outcome'),
  ];
}

function accentFor(project: Project): string {
  if (project.category === 'research') return '#e879f9';
  if (project.category === 'data-eng') return '#55c7c2';
  if (project.category === 'others') return '#f0a36f';
  return '#91baff';
}

export default function ProjectStoryFlow({ project }: { project: Project }) {
  const [layout, setLayout] = useState<FlowLayout>(() => getLayout());
  useEffect(() => {
    const updateLayout = () => setLayout(getLayout());
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  return (
    <section className="project-story-flow project-detail-flow" aria-label={`${project.title} project detail`}>
      <header className="project-story-flow-heading">
        <span className="project-story-flow-status" aria-hidden="true" />
        <h2>PROJECT DETAIL <span>//</span> {project.slug.toUpperCase()}</h2>
      </header>

      <header className="project-flow-overview">
        <div className="project-flow-overview-mark"><span /> PROJECT FILE</div>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>
      </header>

      <div className={`project-detail-dashboard is-${layout}`}>
        <aside className="project-detail-sidebar" aria-label="Project gallery and facts">
          <section className="project-flow-panel project-flow-gallery">
            <header>
              <span><Images aria-hidden="true" /> PROJECT GALLERY</span>
              <small>{project.slug} / media</small>
            </header>
            <div className="project-flow-gallery-content">
              <ProjectGallery key={project.slug} project={project} />
            </div>
          </section>

          <section className="project-flow-panel project-flow-telemetry">
            <header>
              <span><Activity aria-hidden="true" /> PROJECT FACTS</span>
              <small>3 KEY FACTS</small>
            </header>
            <section className="project-flow-impact" aria-label="Project facts">
              {project.impact.map((metric, index) => (
                <div className="project-flow-impact-row" key={metric.label}>
                  <span className="project-flow-impact-index">{String(index + 1).padStart(2, '0')}</span>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </section>
            <section className="project-flow-stack" aria-label="Technology stack">
              <h3><Cpu aria-hidden="true" /> STACK</h3>
              <div>
                {project.stack.map((item) => <span key={item}>{item}</span>)}
              </div>
            </section>
          </section>
        </aside>

        <section className="project-flow-story-column" aria-label="Challenge, approach and outcome">
          <div className={`project-story-flow-canvas is-${layout}`}>
            <ReactFlowProvider>
              <ProjectFlowCanvas project={project} layout={layout} />
            </ReactFlowProvider>
          </div>
        </section>
      </div>
    </section>
  );
}

function getLayout(): FlowLayout {
  if (window.matchMedia('(max-width: 760px)').matches) return 'mobile';
  if (window.matchMedia('(max-width: 1300px)').matches) return 'tablet';
  return 'wide';
}

function ProjectFlowCanvas({ project, layout }: { project: Project; layout: FlowLayout }) {
  const initialNodes = useMemo(() => createNodes(project, layout), [project, layout]);
  const initialEdges = useMemo(() => createEdges(project), [project]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const arrangedLayout = useRef('');
  const shouldFitAfterArrange = useRef(false);
  const { fitView } = useReactFlow();

  useEffect(() => {
    setNodes(createNodes(project, layout));
    setEdges(createEdges(project));
  }, [layout, project, setEdges, setNodes]);

  useEffect(() => {
    if (nodes.some((node) => !node.measured?.height)) return;

    const layoutKey = `${project.slug}:${layout}:${nodes.map((node) => `${node.id}-${node.measured?.height}`).join('|')}`;
    if (layoutKey === arrangedLayout.current) {
      if (shouldFitAfterArrange.current) {
        shouldFitAfterArrange.current = false;
        void fitView({ padding: 0.08, minZoom: 0.55, maxZoom: 1, duration: 180 });
      }
      return;
    }

    const gap = 30;
    let nextY = 18;
    let positionsChanged = false;
    const verticallyStacked = nodes.map((node) => {
      if (node.position.y !== nextY) positionsChanged = true;
      const positionedNode = { ...node, position: { ...node.position, y: nextY } };
      nextY += (node.measured?.height ?? 0) + gap;
      return positionedNode;
    });

    if (positionsChanged) {
      arrangedLayout.current = layoutKey;
      shouldFitAfterArrange.current = true;
      setNodes(verticallyStacked);
      return;
    }

    arrangedLayout.current = layoutKey;
    void fitView({ padding: 0.08, minZoom: 0.55, maxZoom: 1, duration: 180 });
  }, [fitView, layout, nodes, project.slug, setNodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      fitViewOptions={{ padding: 0.08, minZoom: 0.55, maxZoom: 1 }}
      minZoom={0.55}
      maxZoom={2}
      nodesDraggable
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag
      zoomOnScroll
      zoomOnPinch
    >
      <Background variant={BackgroundVariant.Dots} gap={18} size={1.5} color="#26374e" />
      <Controls showInteractive={false} showFitView />
      <div className="project-flow-interaction-hint" aria-hidden="true">DRAG NODES / PAN CANVAS <span>·</span> SCROLL TO ZOOM</div>
    </ReactFlow>
  );
}
