import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import type { Project } from '../data';
import projectImageCaptions from '../assets/project-images/captions';
import projectVisualisations, { type GalleryItem } from '../assets/project-images/visualisations';
import PlotlyGalleryItem from './PlotlyGalleryItem';

function getProjectImages(projectSlug: string): GalleryItem[] {
  return [...(projectVisualisations[projectSlug] ?? []), ...(projectImageCaptions[projectSlug] ?? [])];
}

export default function ProjectGallery({ project }: { project: Project }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const expandButtonRef = useRef<HTMLButtonElement>(null);
  const images = getProjectImages(project.slug);
  const activeImage = images[activeIndex];

  useEffect(() => {
    setActiveIndex(0);
    setIsExpanded(false);
  }, [project.slug]);

  useEffect(() => {
    if (!isExpanded) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        setIsExpanded(false);
      } else if (event.key === 'Tab') {
        const dialog = closeButtonRef.current?.closest('[role="dialog"]');
        const focusable = dialog?.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex="0"]');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      } else if ((event.target as HTMLElement)?.closest('.plotly-gallery-item, input, select, textarea')) {
        return;
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setActiveIndex((index) => (index - 1 + images.length) % images.length);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.body.style.overflow = previousOverflow;
      expandButtonRef.current?.focus();
    };
  }, [images.length, isExpanded]);

  const move = (offset: number) => {
    setActiveIndex((index) => (index + offset + images.length) % images.length);
  };

  return (
    <section className="project-gallery" aria-label="Project gallery">
      {activeImage ? (
        <div className="project-gallery-layout">
          <div className="project-gallery-main">
            <div className={`project-gallery-stage${activeImage.kind === 'plotly' ? ' project-gallery-stage-interactive' : ''}`} aria-live="polite">
              {activeImage.kind === 'plotly' ? <>
                {!isExpanded && <PlotlyGalleryItem key={activeImage.src} src={activeImage.src} label={activeImage.title} />}
                <button ref={expandButtonRef} type="button" className="project-gallery-chart-expand nodrag nopan"
                  onClick={() => setIsExpanded(true)} aria-label={`Expand ${activeImage.title}`}>
                  <Expand aria-hidden="true" /> EXPAND
                </button>
              </> : <button
                ref={expandButtonRef}
                type="button"
                className="project-gallery-expand"
                onClick={() => setIsExpanded(true)}
                aria-label={`Open ${activeImage.label}`}
              >
                <img className="project-gallery-image" src={activeImage.src} alt={`${project.title}: ${activeImage.label}`} />
                <span className="project-gallery-expand-hint"><Expand aria-hidden="true" /> EXPAND</span>
              </button>}
              <span className="project-gallery-position">
                {String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </span>
            </div>
            <p className="project-gallery-caption">{activeImage.label}</p>
          </div>
          <aside className="project-gallery-rail" aria-label="Gallery navigation">
            <div className="project-gallery-thumbnails" role="group" aria-label="Choose gallery item">
              {images.map((image, index) => (
                <button
                  type="button"
                  className={index === activeIndex ? 'is-active' : ''}
                  key={image.src}
                  onClick={() => setActiveIndex(index)}
                  aria-label={image.label}
                  aria-pressed={index === activeIndex}
                >
                  {image.kind === 'plotly' ? <span className="plotly-gallery-thumbnail">{image.title}<small>INTERACTIVE</small></span> : <img src={image.src} alt="" loading="lazy" />}
                </button>
              ))}
            </div>
            {images.length > 1 && (
              <div className="project-gallery-navigation">
                <button type="button" className="project-gallery-arrow" onClick={() => move(-1)} aria-label="Previous gallery item">
                  <ChevronLeft aria-hidden="true" />
                </button>
                <button type="button" className="project-gallery-arrow" onClick={() => move(1)} aria-label="Next gallery item">
                  <ChevronRight aria-hidden="true" />
                </button>
              </div>
            )}
          </aside>
        </div>
      ) : (
        <div className="project-gallery-empty" role="status">
          <span><Expand aria-hidden="true" /></span>
          <strong>No project images yet</strong>
          <p>Add images to <code>src/assets/project-images/{project.slug}/</code>.</p>
        </div>
      )}

      {isExpanded && activeImage && createPortal(
        <div
          className="project-gallery-lightbox"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsExpanded(false);
          }}
        >
          <section
            className="project-gallery-lightbox-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} gallery`}
          >
            <header>
              <span>{project.slug} / {activeImage.label}</span>
              <button ref={closeButtonRef} type="button" onClick={() => setIsExpanded(false)} aria-label="Close expanded gallery item">
                <X aria-hidden="true" />
              </button>
            </header>
            <div className={`project-gallery-lightbox-image${activeImage.kind === 'plotly' ? ' project-gallery-lightbox-chart' : ''}${images.length === 1 ? ' project-gallery-lightbox-single' : ''}`}>
              {images.length > 1 && (
                <button type="button" className="project-gallery-lightbox-arrow" onClick={() => move(-1)} aria-label="Previous gallery item">
                  <ChevronLeft aria-hidden="true" />
                </button>
              )}
              {activeImage.kind === 'plotly' ? <PlotlyGalleryItem key={activeImage.src} src={activeImage.src} label={activeImage.title} /> : <img src={activeImage.src} alt={`${project.title}: ${activeImage.label}`} />}
              {images.length > 1 && (
                <button type="button" className="project-gallery-lightbox-arrow" onClick={() => move(1)} aria-label="Next gallery item">
                  <ChevronRight aria-hidden="true" />
                </button>
              )}
            </div>
            <footer>
              <span>{activeImage.label}</span>
              <span>{String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
            </footer>
          </section>
        </div>,
        document.body,
      )}
    </section>
  );
}
