import React, { useEffect } from 'react';
import { useSyncStore } from '../../store/syncStore';
import { WifiOff, RefreshCw, Wifi } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const OfflineBanner: React.FC = () => {
  const { isOnline, isSyncing, pendingCount, setOnlineStatus } = useSyncStore();
  const { t } = useTranslation();

  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus]);

  if (isOnline && !isSyncing && pendingCount === 0) {
    return null;
  }

  return (
    <div
      role="status"
      className={`w-full px-4 py-2 text-xs md:text-sm font-medium flex items-center justify-between transition-all duration-300 ${
        !isOnline
          ? 'bg-warning-amber/90 text-yellow-950 border-b border-warning-amber'
          : isSyncing
          ? 'bg-denim text-white border-b border-denim-dark'
          : 'bg-olive/90 text-white'
      }`}
    >
      <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full">
        {!isOnline ? (
          <>
            <WifiOff className="w-4 h-4 flex-shrink-0 animate-bounce" />
            <span>{t('status.offline')}</span>
            {pendingCount > 0 && (
              <span className="ml-auto font-mono bg-yellow-950/20 px-2 py-0.5 rounded text-xs">
                {pendingCount} items pending
              </span>
            )}
          </>
        ) : isSyncing ? (
          <>
            <RefreshCw className="w-4 h-4 flex-shrink-0 animate-sync" />
            <span>{t('status.syncing')}</span>
          </>
        ) : (
          <>
            <Wifi className="w-4 h-4 flex-shrink-0" />
            <span>All offline data synchronized successfully</span>
          </>
        )}
      </div>
    </div>
  );
};
