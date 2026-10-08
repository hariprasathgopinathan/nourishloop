import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { Check, CheckCircle2, Info, Package, PackageCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsList() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case 'DONATION_CLAIMED':
        return <CheckCircle2 className="text-brand-donor" size={24} />;
      case 'DONATION_READY':
        return <Package className="text-blue-500" size={24} />;
      case 'DONATION_PICKED_UP':
        return <PackageCheck className="text-purple-500" size={24} />;
      default:
        return <Info className="text-gray-500" size={24} />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Notifications</h2>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm font-medium text-brand-donor hover:text-brand-darkGreen hover:underline flex items-center gap-1 transition-colors"
          >
            <Check size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-400 mb-4">
            <Info size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
          <p className="mt-1 text-gray-500 max-w-sm mx-auto text-sm">
            You don't have any notifications right now. We'll let you know when there's an update.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => {
                if (!notification.readAt) {
                  markAsRead(notification._id);
                }
              }}
              className={`p-5 flex gap-4 transition-colors cursor-default sm:cursor-pointer
                ${!notification.readAt ? 'bg-brand-donor/5' : 'hover:bg-gray-50'}
              `}
            >
              <div className="flex-shrink-0 mt-1">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className={`text-sm font-semibold ${!notification.readAt ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </p>
                    <p className={`mt-1 text-sm ${!notification.readAt ? 'text-gray-700' : 'text-gray-500'}`}>
                      {notification.message}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
              {!notification.readAt && (
                <div className="flex-shrink-0 flex items-center">
                  <span className="w-2.5 h-2.5 bg-brand-donor rounded-full" aria-hidden="true" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
