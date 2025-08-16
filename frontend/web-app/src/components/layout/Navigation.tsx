"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className }: NavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navItems = [
    { href: '/home', label: 'Home', icon: '/icon/home.svg' },
    { href: '/explore', label: 'Explore', icon: '/icon/explore.svg' },
    { href: '/create', label: 'Create', icon: '/icon/create.svg' },
  ];

  const userInitial = (user?.displayName || user?.username || user?.email || 'U')[0].toUpperCase();

  return (
    <nav className={`navigation ${className}`}>
      <div className="nav-content">
        {/* Logo */}
        <div className="nav-brand flex-center">
          <img src="/nav-logo.svg" style={{width:"50px"}}alt="" />
          <h2 className="h2">VibeTribe</h2>
        </div>

        {/* Navigation Items */}
        <ul className="nav-items">
          {navItems.map((item) => (
            <li key={item.href}>
              <button
                className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                onClick={() => router.push(item.href)}
              >
                <img src={item.icon} alt="" className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Profile Menu */}
        <div className="nav-profile">
          <button
            className="profile-trigger"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Profile"
                className="profile-avatar"
              />
            ) : (
              <div className="profile-placeholder">
                {userInitial}
              </div>
            )}
          </button>

          {isProfileMenuOpen && (
            <div className="profile-menu">
              <button onClick={() => {
                router.push('/profile');
                setIsProfileMenuOpen(false);
              }}>

                Profile
              </button>
              <hr />
              <button onClick={() => {
                router.push('/logout');
                setIsProfileMenuOpen(false);
              }}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .navigation {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: var(--bg-elevated);
          border-bottom: 1px solid var(--surface);
          z-index: 100;
          padding: 0 24px;
        }

        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          height: 64px;
        }

        .nav-brand h1 {
          margin: 0;
        }

        .nav-items {
          display: flex;
          list-style: none;
          gap: 8px;
          margin: 0;
          padding: 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 12px;
          background: none;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
          color: var(--text-default);
          font-family: var(--font-sans);
        }

        .nav-item:hover {
          background: var(--surface);
        }

        .nav-item.active {
          background: var(--brand-primary);
          color: white;
        }

        .nav-icon {
          width: 20px;
          height: 20px;
          filter: var(--icon-filter);
        }

        .nav-item.active .nav-icon {
          filter: brightness(0) invert(1);
        }

        .nav-label {
          font-weight: var(--fw-demi);
          font-size: var(--fs-body-15);
        }

        .nav-profile {
          position: relative;
        }

        .profile-trigger {
          background: none;
          border: none;
          cursor: pointer;
          border-radius: 50%;
          padding: 2px;
        }

        .profile-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .profile-placeholder {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--surface);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--fw-bold);
          color: var(--text-default);
        }

        .profile-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: var(--bg-elevated);
          border-radius: var(--card-radius);
          box-shadow: var(--shadow-soft);
          border: 1px solid var(--surface);
          padding: 8px 0;
          min-width: 160px;
          margin-top: 8px;
        }

        .profile-menu button {
          width: 100%;
          text-align: left;
          padding: 12px 16px;
          border: none;
          background: none;
          cursor: pointer;
          color: var(--text-default);
          font-family: var(--font-sans);
          transition: background-color 0.2s ease;
        }

        .profile-menu button:hover {
          background: var(--surface);
        }

        .profile-menu hr {
          border: none;
          border-top: 1px solid var(--surface);
          margin: 8px 0;
        }

        @media (max-width: 768px) {
          .nav-label {
            display: none;
          }
          
          .navigation {
            padding: 0 16px;
          }
        }
      `}</style>
    </nav>
  );
}
