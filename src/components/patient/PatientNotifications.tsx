import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, Calendar, Info, Clock, AlertCircle } from 'lucide-react';

export const PatientNotifications: React.FC = () => {
  const { currentUser, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();

  const userNotifs = currentUser
    ? notifications.filter((n) => n.user_id === currentUser.user_id)
    : [];

  const unreadCount = userNotifs.filter((n) => !n.is_read).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 bg-blue-600 text-white rounded-full text-xs font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time appointment alerts, status updates, and clinic reminders.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => currentUser && markAllNotificationsAsRead(currentUser.user_id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            <CheckCheck className="w-4 h-4 text-blue-600" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
        {userNotifs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Bell className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No notifications yet.</p>
            <p className="text-xs text-slate-400">You will receive notifications when you book or update an appointment.</p>
          </div>
        ) : (
          userNotifs.map((notif) => (
            <div
              key={notif.notification_id}
              className={`p-5 transition-colors flex items-start justify-between gap-4 ${
                notif.is_read ? 'bg-white' : 'bg-blue-50/60'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    (notif.type || '').includes('CANCEL')
                      ? 'bg-red-100 text-red-700'
                      : (notif.type || '').includes('CONFIRM') || notif.type === 'appointment'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 uppercase">
                      {(notif.type || 'system').replace(/_/g, ' ')}
                    </span>
                    {!notif.is_read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    {new Date(notif.created_at).toLocaleDateString()} at{' '}
                    {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {!notif.is_read && (
                <button
                  onClick={() => markNotificationAsRead(notif.notification_id)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-100 rounded-lg shrink-0 transition-colors cursor-pointer"
                >
                  Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
