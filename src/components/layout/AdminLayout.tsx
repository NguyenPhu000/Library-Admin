import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import './layout.css';

const SIDEBAR_ID = 'admin-sidebar';

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="admin-layout">
      <a className="admin-layout__skip-link" href="#main-content">
        Skip to content
      </a>

      <Sidebar id={SIDEBAR_ID} isOpen={isSidebarOpen} onNavigate={handleCloseSidebar} />

      {isSidebarOpen && (
        <div className="admin-layout__backdrop" aria-hidden="true" onClick={handleCloseSidebar} />
      )}

      <div className="admin-layout__content">
        <Header
          isMenuOpen={isSidebarOpen}
          menuControlsId={SIDEBAR_ID}
          onMenuToggle={handleMenuToggle}
        />
        <main id="main-content" className="admin-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}