import { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router';

import { BreadcrumbContext } from './BreadcrumbContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const SIDEBAR_ID = 'admin-sidebar';

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [detailLabel, setDetailLabel] = useState<string | undefined>(undefined);

  const breadcrumbContextValue = useMemo(
    () => ({ detailLabel, setDetailLabel }),
    [detailLabel],
  );

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);

  function handleMenuToggle() {
    setIsSidebarOpen((isOpen) => !isOpen);
  }

  function handleCloseSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <BreadcrumbContext.Provider value={breadcrumbContextValue}>
      <div className="flex min-h-screen bg-surface-row-alt text-ink">
        <a
          className="absolute left-2 -top-12 z-50 rounded-control bg-brand-600 px-3.5 py-2.5 font-semibold text-on-dark no-underline transition-all focus:top-2"
          href="#main-content"
        >
          Skip to content
        </a>

        <Sidebar id={SIDEBAR_ID} isOpen={isSidebarOpen} onNavigate={handleCloseSidebar} />

        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-[#150829]/55 min-[901px]:hidden"
            aria-hidden="true"
            onClick={handleCloseSidebar}
          />
        )}

        <div className="flex flex-1 flex-col min-w-0">
          <Header
            isMenuOpen={isSidebarOpen}
            menuControlsId={SIDEBAR_ID}
            onMenuToggle={handleMenuToggle}
          />
          <main
            id="main-content"
            className="flex flex-1 flex-col w-full max-w-full box-border p-8 gap-6 max-[900px]:p-4"
          >
            <Outlet />
          </main>
        </div>
      </div>
    </BreadcrumbContext.Provider>
  );
}
