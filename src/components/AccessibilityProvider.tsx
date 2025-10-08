import React, { createContext, useContext, useEffect } from 'react';

interface AccessibilityContextType {
  announceMessage: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  announceMessage: () => {},
});

export const useAccessibility = () => useContext(AccessibilityContext);

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  useEffect(() => {
    // Add skip link for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white focus:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add keyboard navigation message
    const handleFirstTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
      }
    };
    window.addEventListener('keydown', handleFirstTab);

    return () => {
      window.removeEventListener('keydown', handleFirstTab);
      skipLink.remove();
    };
  }, []);

  const announceMessage = (message: string) => {
    const announcer = document.getElementById('aria-live-announcer');
    if (announcer) {
      announcer.textContent = message;
    }
  };

  return (
    <AccessibilityContext.Provider value={{ announceMessage }}>
      {children}
      <div
        id="aria-live-announcer"
        className="sr-only"
        role="status"
        aria-live="polite"
      />
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider;