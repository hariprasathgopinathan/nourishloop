import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { Check, CheckCircle2, Info, Package, PackageCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsList() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case 'DONATION_CLAIMED':
        return <CheckCircle2 className="text-brand-ngo" size={20} />;
      case 'DONATION_READY':
        return <Package className="text-amber-500" size={20} />;
      case 'DONATION_PICKED_UP':
        return <PackageCheck className="text-brand-donor" size={20} />;
      default:
        return <Info className="text-gray-400" size={20} />;
    }
  };

  return (
    <div className="max-w-[800px] mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-[24px] font-bold tracking-tight text-brand-text mb-1">Notifications</h2>
          <p className="text-[14px] text-brand-text-muted">Stay updated on your food rescue activity.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-[13px] font-bold text-brand-text-muted hover:text-brand-text flex items-center gap-1.5 transition-colors"
          >
            <Check size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-brand-surface rounded-[12px] shadow-[0_2px_8px_rgba(15,23,42,0.02)] border border-brand-border p-12 text-center">
          <div className="inline-flex items-center justify-center w-[48px] h-[48px] rounded-[12px] bg-brand-neutral border border-brand-border text-gray-400 mb-4 shadow-sm">
            <Info size={24} />
          </div>
          <h3 className="text-[15px] font-bold text-brand-text mb-1">No notifications</h3>
          <p className="text-[13px] text-brand-text-muted max-w-sm mx-auto">
            You don't have any notifications right now. We'll let you know when there's an update.
          </p>
        </div>
      ) : (
        <div className="bg-brand-surface rounded-[12px] shadow-[0_2px_8px_rgba(15,23,42,0.02)] border border-brand-border overflow-hidden divide-y divide-brand-border">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => {
                if (!notification.readAt) {
                  markAsRead(notification._id);
                }
              }}
              className={`p-5 flex gap-4 transition-colors cursor-pointer
                ${!notification.readAt ? 'bg-brand-donor-light/30' : 'hover:bg-brand-neutral/50'}
              `}
            >
              <div className="flex-shrink-0 mt-0.5">
                <div className={`w-[36px] h-[36px] rounded-[8px] flex items-center justify-center border border-brand-border shadow-sm bg-white`}>
                  {getIcon(notification.type)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className={`text-[14px] font-bold ${!notification.readAt ? 'text-brand-text' : 'text-brand-text'}`}>
                      {notification.title}
                    </p>
                    <p className={`mt-0.5 text-[13px] ${!notification.readAt ? 'text-brand-text-muted font-medium' : 'text-gray-500'}`}>
                      {notification.message}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-brand-text-muted whitespace-nowrap mt-1 uppercase tracking-wider">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
              {!notification.readAt && (
                <div className="flex-shrink-0 flex items-center">
                  <span className="w-[8px] h-[8px] bg-brand-donor rounded-full" aria-hidden="true" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
