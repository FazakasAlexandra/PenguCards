import React, {ReactNode} from 'react';
import {UserProvider} from './contexts/UserContext';
import {DeckProvider} from './contexts/DeckContext';
// Import other providers as needed

export const ContextProviders: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  return (
    <UserProvider>
      <DeckProvider>
        {/* Wrap other providers as needed */}
        {children}
      </DeckProvider>
    </UserProvider>
  );
};
