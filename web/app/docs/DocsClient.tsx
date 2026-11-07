'use client';

import React, { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sun, Moon, ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { DOCS_PAGES, DOCS_TABS, type DocPageItem, type DocsTab } from './data';
import './docs.css';

/**
 * ScrollSpy Hook: Detects currently active heading relative to the sticky navigation bottom.
 */
function useDocsScrollSpy(
  page: DocPageItem | undefined,
  contentRef: React.RefObject<HTMLElement | null>,
  setActiveHeading: (id: string) => void
) {
  useEffect(() => {
    if (!page || !page.toc || page.toc.length === 0) {
      setActiveHeading('');
      return;
    }

    const firstHeadingId = page.toc[0]?.id ?? '';
    const hashId =
      typeof window !== 'undefined' && window.location.hash
        ? decodeURIComponent(window.location.hash.slice(1))
        : '';

    if (!hashId || (typeof window !== 'undefined' && window.scrollY <= 10)) {
      setActiveHeading(firstHeadingId);
    } else {
      setActiveHeading(hashId);
    }

    const getNavBottom = () => {
      const nav = document.querySelector('.docs-subnav-bar');
      return nav ? nav.getBoundingClientRect().bottom : 110;
    };

    let ticking = false;

    const recalculate = () => {
      ticking = false;
      const article = contentRef.current;
      if (!article) return;

      const tocIds = new Set(page.toc.map((h) => h.id));
      const allHeadings = Array.from(article.querySelectorAll<HTMLElement>('h2[id], h3[id]'));
      const headingElements = allHeadings.filter((el) => tocIds.has(el.id));

      if (headingElements.length === 0) {
        setActiveHeading(firstHeadingId);
        return;
      }

      if (window.scrollY <= 10) {
        setActiveHeading(firstHeadingId);
        return;
      }

      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const isScrollable = scrollHeight > clientHeight + 40;
      const atBottom = isScrollable && window.scrollY + clientHeight >= scrollHeight - 20;

      if (atBottom) {
        let lowest = headingElements[0];
        for (const el of headingElements) {
          if (el.getBoundingClientRect().top < clientHeight) {
            lowest = el;
          }
        }
        setActiveHeading(lowest.id);
        return;
      }

      const detectionPoint = getNavBottom() + 16;
      let active = headingElements[0];
      for (const el of headingElements) {
        if (el.getBoundingClientRect().top <= detectionPoint) {
          active = el;
        }
      }
      setActiveHeading(active.id);
    };

    const scheduleRecalculate = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(recalculate);
      }
    };

    const rafId = requestAnimationFrame(recalculate);

    let observer: IntersectionObserver | null = null;
    try {
      const navBottom = getNavBottom();
      const rootMarginTop = -Math.round(navBottom);
      const rootMarginBottom = -Math.round(Math.max(0, window.innerHeight - navBottom - 60));

      observer = new IntersectionObserver(scheduleRecalculate, {
        rootMargin: `${rootMarginTop}px 0px ${rootMarginBottom}px 0px`,
        threshold: [0, 1],
      });

      const article = contentRef.current;
      if (article) {
        article.querySelectorAll<HTMLElement>('h2[id], h3[id]').forEach((el) => observer?.observe(el));
      }
    } catch {
      // Fallback handled by scroll listener
    }

    window.addEventListener('scroll', scheduleRecalculate, { passive: true });
    window.addEventListener('resize', scheduleRecalculate, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
      window.removeEventListener('scroll', scheduleRecalculate);
      window.removeEventListener('resize', scheduleRecalculate);
    };
  }, [page, contentRef, setActiveHeading]);
}

/**
 * TOC Auto-Scroll Hook: Vertically centers the active heading item within the scrollable TOC rail.
 */
function useTocScroll(
  railRef: React.RefObject<HTMLElement | null>,
  activeHeading: string,
  pathname: string
) {
  const isInitial = useRef(true);

  useEffect(() => {
    isInitial.current = true;
  }, [pathname]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !activeHeading) return;
    if (rail.clientHeight === 0 || rail.scrollHeight <= rail.clientHeight) return;

    const activeItem =
      rail.querySelector<HTMLElement>(`[data-heading-id="${CSS.escape(activeHeading)}"]`) ||
      rail.querySelector<HTMLElement>('.docs-toc-item.active');

    if (!activeItem) return;

    const railRect = rail.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    const linkScrollTop = rail.scrollTop + (itemRect.top - railRect.top);
    const targetScroll = linkScrollTop - rail.clientHeight / 2 + itemRect.height / 2;
    const maxScroll = Math.max(0, rail.scrollHeight - rail.clientHeight);
    const clampedTarget = Math.max(0, Math.min(maxScroll, Math.round(targetScroll)));

    if (Math.abs(clampedTarget - rail.scrollTop) < 2) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior = isInitial.current || prefersReducedMotion ? 'instant' : 'smooth';
    isInitial.current = false;

    rail.scrollTo({
      top: clampedTarget,
      behavior,
    });
  }, [activeHeading, pathname, railRef]);
}

interface DocsClientProps {
  currentSlug?: string[];
}

export function DocsClient({ currentSlug = [] }: DocsClientProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  // Resolve current active path
  const slugPath = currentSlug.length > 0 ? `/docs/${currentSlug.join('/')}` : '/docs/overview';
  const page = DOCS_PAGES.find((p) => p.path === slugPath) || DOCS_PAGES[0];
  const currentPath = page.path;

  // Derive groups
  const groups = useMemo(() => Array.from(new Set(DOCS_PAGES.map((p) => p.group))), []);

  // Determine current active subnav tab
  const currentTabId = page.tab;

  // State
  const [navOpen, setNavOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(0);
  const [activeHeading, setActiveHeading] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  const searchRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const mobileTocRef = useRef<HTMLDetailsElement>(null);
  const tocRailRef = useRef<HTMLElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Search Index across all pages and headings
  const searchIndex = useMemo(
    () =>
      DOCS_PAGES.flatMap((p) => [
        { title: p.title, category: p.group, href: p.path },
        ...p.toc.map((h) => ({
          title: h.text,
          category: `${p.group} / ${p.title}`,
          href: `${p.path}#${h.id}`,
        })),
      ]),
    []
  );

  const searchResults = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return searchIndex
      .filter((entry) => `${entry.title} ${entry.category}`.toLowerCase().includes(term))
      .slice(0, 10);
  }, [query, searchIndex]);

  // Navigate helper
  const navigateTo = (url: string) => {
    if (url.startsWith('#')) {
      const element = document.getElementById(url.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', url);
        setActiveHeading(url.slice(1));
      }
      return;
    }

    const [pathname, hash] = url.split('#');
    router.push(url);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setActiveHeading(hash);
        }
      }, 100);
    }
  };

  // Keyboard shortcut: Cmd/Ctrl + K and Escape
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
        setSearchOpen(true);
      }
      if (event.key === 'Escape') {
        setNavOpen(false);
        setSearchOpen(false);
        if (mobileTocRef.current) mobileTocRef.current.open = false;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Reset drawer and search on path change
  useEffect(() => {
    setNavOpen(false);
    setQuery('');
    setSearchOpen(false);
    if (mobileTocRef.current) mobileTocRef.current.open = false;
  }, [currentPath]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (navOpen && typeof window !== 'undefined' && window.innerWidth <= 1025) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [navOpen]);

  useDocsScrollSpy(page, contentRef, setActiveHeading);
  useTocScroll(tocRailRef, activeHeading, currentPath);

  // Copy helper
  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('Copied to clipboard.');
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopyStatus(''), 1800);
    } catch {
      setCopyStatus('Copy failed.');
    }
  };

  const onContentClick = (event: MouseEvent<HTMLElement>) => {
    if (event.defaultPrevented) return;
    const target = event.target as HTMLElement;

    // Delegated copy buttons inside code blocks and URL boxes
    const copyButton = target.closest<HTMLButtonElement>('[data-copy-code]');
    if (copyButton) {
      const codeBlock = copyButton.closest('.docs-code-block');
      const urlBox = copyButton.closest('.docs-base-url-box');
      const textToCopy =
        codeBlock?.querySelector('pre code')?.textContent ||
        urlBox?.querySelector('.dbu-code')?.textContent ||
        '';
      if (textToCopy) {
        void copyText(textToCopy);
      }
      return;
    }

    // Delegated internal link navigation
    const anchor = target.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href || event.button !== 0 || event.metaKey || event.ctrlKey || anchor.target === '_blank') return;

    if (href.startsWith('#') || href.startsWith('/docs')) {
      event.preventDefault();
      navigateTo(href);
    }
  };

  const showSearchDropdown = searchOpen && query.trim().length > 0;
  const pageIndex = DOCS_PAGES.findIndex((p) => p.path === currentPath);

  return (
    <div className="docs-page-wrapper">
      <a className="docs-skip-link" href="#docs-main">
        Skip to content
      </a>

      {/* 1. Sticky Top Header (64px desktop / 112px mobile) */}
      <header className="docs-top-header">
        <div className="docs-header-inner">
          {/* Brand Logo & Wordmark */}
          <a href="https://paidx.cc" className="docs-brand" title="PaidX Home (paidx.cc)">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-02.png" alt="PaidX Logo" />
            <span className="docs-brand-title">
              PaidX
            </span>
            <span className="docs-badge">Docs</span>
          </a>

          {/* Search Box */}
          <div
            className="docs-search-container"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setSearchOpen(false);
            }}
          >
            <div className="docs-search-input-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={searchRef}
                className="docs-search-input"
                placeholder="Search documentation, contracts, APIs..."
                aria-label="Search documentation"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={showSearchDropdown}
                aria-controls="docs-search-results"
                value={query}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedResult(0);
                  setSearchOpen(true);
                }}
                onKeyDown={(e) => {
                  if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && searchResults.length) {
                    e.preventDefault();
                    setSearchOpen(true);
                    setSelectedResult((idx) => (idx + (e.key === 'ArrowDown' ? 1 : -1) + searchResults.length) % searchResults.length);
                  } else if (e.key === 'Enter' && showSearchDropdown && searchResults[selectedResult]) {
                    e.preventDefault();
                    navigateTo(searchResults[selectedResult].href);
                    setSearchOpen(false);
                    setQuery('');
                    searchRef.current?.blur();
                  }
                }}
              />
              <kbd className="docs-search-kbd">⌘ / Ctrl K</kbd>
            </div>

            {showSearchDropdown && (
              <div id="docs-search-results" className="docs-search-dropdown" role="listbox" aria-label="Search results">
                {searchResults.length === 0 ? (
                  <p className="docs-search-empty" role="status">
                    No results found for “{query}”.
                  </p>
                ) : (
                  searchResults.map((result, idx) => (
                    <div
                      key={result.href}
                      role="option"
                      aria-selected={selectedResult === idx}
                      className="docs-search-item"
                      onClick={() => {
                        navigateTo(result.href);
                        setSearchOpen(false);
                        setQuery('');
                      }}
                    >
                      <span>{result.title}</span>
                      <small>{result.category}</small>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Header Action Buttons */}
          <div className="docs-header-actions">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="docs-icon-btn"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-cyan-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#1749F5]" />
              )}
            </button>

            {/* GitHub Repo */}
            <a
              href="https://github.com/RealRatnadwip/PaidX"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              className="docs-icon-btn hidden sm:inline-flex"
              title="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>

            {/* X / Twitter */}
            <a
              href="https://x.com/paidx_cc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow on X"
              className="docs-icon-btn hidden sm:inline-flex"
              title="Follow on X (@paidx_cc)"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Launch Console CTA */}
            <a
              href="https://console.paidx.cc"
              target="_blank"
              rel="noopener noreferrer"
              className="docs-launch-btn"
            >
              <span>Launch Console</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>
      </header>

      {/* 2. Secondary Subnav Bar (Sticky 46px) */}
      <nav className="docs-subnav-bar" aria-label="Documentation areas">
        <div className="docs-subnav-inner">
          {/* Desktop Navigation Tabs */}
          <div className="docs-subnav-desktop-tabs">
            {DOCS_TABS.map((tab) => (
              <Link
                key={tab.tabId}
                href={tab.path}
                className={`docs-subnav-tab${currentTabId === tab.tabId ? ' active' : ''}`}
              >
                {tab.title}
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger & Breadcrumb */}
          <div className="docs-mobile-breadcrumb-bar">
            <button
              className="docs-hamburger-btn"
              type="button"
              aria-expanded={navOpen}
              aria-label="Toggle navigation menu"
              onClick={() => setNavOpen((open) => !open)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="docs-breadcrumb-trail">
              <span className="docs-breadcrumb-group">{page.group}</span>
              <span className="docs-breadcrumb-sep" aria-hidden="true">›</span>
              <span className="docs-breadcrumb-current">{page.title}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop */}
      {navOpen && <div className="docs-drawer-backdrop" onClick={() => setNavOpen(false)} aria-hidden="true" />}

      {/* 3. Main 3-Column Shell */}
      <div className="docs-main-shell">
        {/* Left Sidebar Navigation (Desktop sticky / Mobile drawer) */}
        <aside
          id="docs-sidebar"
          className={`docs-sidebar-nav${navOpen ? ' open' : ''}`}
          data-open={navOpen ? 'true' : 'false'}
          aria-label="Documentation navigation"
        >
          {/* Mobile Drawer Header */}
          <div className="docs-drawer-header">
            <div className="docs-drawer-brand">
              <a href="https://paidx.cc" className="docs-brand-title hover:opacity-80 transition-opacity">
                PaidX Docs
              </a>
            </div>
            <button
              className="docs-drawer-close-btn"
              type="button"
              aria-label="Close menu"
              onClick={() => setNavOpen(false)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Mobile Drawer Tabs */}
          <div className="docs-drawer-tabs">
            {DOCS_TABS.slice(0, 3).map((tab) => (
              <Link
                key={tab.tabId}
                href={tab.path}
                className={`docs-drawer-tab${currentTabId === tab.tabId ? ' active' : ''}`}
                onClick={() => setNavOpen(false)}
              >
                {tab.title}
              </Link>
            ))}
          </div>

          {/* Grouped Page Links */}
          <nav className="docs-nav-group-list">
            {groups.map((group) => (
              <div className="docs-nav-group" key={group}>
                <div className="docs-nav-group-title">{group}</div>
                {DOCS_PAGES.filter((p) => p.group === group).map((p) => (
                  <Link
                    key={p.path}
                    href={p.path}
                    className={`docs-nav-link-item${p.path === currentPath ? ' active' : ''}`}
                    aria-current={p.path === currentPath ? 'page' : undefined}
                    onClick={() => setNavOpen(false)}
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            ))}

            {/* Mobile Drawer Social Links */}
            <div className="pt-4 mt-4 border-t border-[var(--docs-border-color)] flex items-center gap-3 px-2">
              <a
                href="https://github.com/RealRatnadwip/PaidX"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--docs-text-secondary)] hover:text-[var(--docs-brand-primary)]"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <span className="text-[var(--docs-border-color)]">•</span>
              <a
                href="https://x.com/paidx_cc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--docs-text-secondary)] hover:text-[var(--docs-brand-primary)]"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>X (@paidx_cc)</span>
              </a>
            </div>
          </nav>
        </aside>

        {/* Center Main Article */}
        <main id="docs-main" className="docs-main-content" tabIndex={-1}>
          <article ref={contentRef} className="docs-article" onClick={onContentClick}>
            <p className="docs-eyebrow">{page.group}</p>
            <h1 id="docs-page-title" className="docs-title" tabIndex={-1}>
              {page.title}
            </h1>

            {/* Mobile Collapsible TOC */}
            {page.toc.length > 0 && (
              <details className="docs-mobile-toc" ref={mobileTocRef}>
                <summary>On this page ({page.toc.length} sections)</summary>
                <nav className="docs-toc-links" aria-label="Page subsections">
                  {page.toc.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      data-heading-id={h.id}
                      className={`docs-toc-item${h.depth === 3 ? ' docs-toc-subitem' : ''}${activeHeading === h.id ? ' active' : ''}`}
                      onClick={() => {
                        if (mobileTocRef.current) mobileTocRef.current.open = false;
                      }}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </details>
            )}

            {/* Article Markdown Body */}
            <div className="docs-markdown-body" dangerouslySetInnerHTML={{ __html: page.contentHtml }} />

            {/* Bottom Pagination */}
            <nav className="docs-pagination" aria-label="Previous and next pages">
              {pageIndex > 0 ? (
                <Link href={DOCS_PAGES[pageIndex - 1].path}>
                  <span>Previous</span>
                  <strong>{DOCS_PAGES[pageIndex - 1].title}</strong>
                </Link>
              ) : (
                <div />
              )}
              {pageIndex < DOCS_PAGES.length - 1 && (
                <Link href={DOCS_PAGES[pageIndex + 1].path}>
                  <span>Next</span>
                  <strong>{DOCS_PAGES[pageIndex + 1].title}</strong>
                </Link>
              )}
            </nav>

            {/* Community Links */}
            <div className="mt-10 pt-6 border-t border-[var(--docs-border-color)] flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--docs-text-secondary)]">
              <span>PaidX Developer Community</span>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/RealRatnadwip/PaidX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[var(--docs-brand-primary)] transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
                <a
                  href="https://x.com/paidx_cc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[var(--docs-brand-primary)] transition-colors"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>Follow @paidx_cc</span>
                </a>
              </div>
            </div>
          </article>
        </main>

        {/* Right TOC Rail (Desktop Only >1280px) */}
        {page.toc.length > 0 && (
          <aside ref={tocRailRef} className="docs-toc-rail" aria-label="On this page">
            <div className="docs-toc-header">On this page</div>
            <nav className="docs-toc-links">
              {page.toc.map((h) => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  data-heading-id={h.id}
                  className={`docs-toc-item${h.depth === 3 ? ' docs-toc-subitem' : ''}${activeHeading === h.id ? ' active' : ''}`}
                >
                  {h.text}
                </a>
              ))}
            </nav>
          </aside>
        )}
      </div>

      {/* Floating Status Notification */}
      <p className="docs-copy-status" role="status" aria-live="polite">
        {copyStatus}
      </p>
    </div>
  );
}
