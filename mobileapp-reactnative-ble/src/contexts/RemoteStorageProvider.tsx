import { ReactNode, createContext, useContext } from 'react';

import useRemoteStorage, { remoteStorageProps } from '../utils/useRemoteStorage';

const RemoteStorageContext = createContext<remoteStorageProps | undefined>(undefined);

const RemoteStorageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <RemoteStorageContext.Provider value={useRemoteStorage()}>
      {children}
    </RemoteStorageContext.Provider>
  );
};

export function useCustomRemoteStorage() {
  const context = useContext(RemoteStorageContext);
  if (!context) {
    throw new Error('useCustomRemoteStorage debe ser utilizado dentro de un RemoteStorageProvider');
  }
  return context;
}

export default RemoteStorageProvider;
