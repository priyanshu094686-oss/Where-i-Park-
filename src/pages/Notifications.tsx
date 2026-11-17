import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  XCircle,
  Plus,
  Send
} from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import { storageService } from '../services/storageService';

interface NotificationsPageProps {
  onNavigate: (page: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { notifications, role } = useStorage();
  const [filterType, setFilterType] = useState<string>('all');

  // Admin Broadcast Announcement State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<'info' | 'warning' | 'success' | 'danger'>('warning');

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.isRead;
    return n.type === filterType;
  });

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    storageService.addNotification({
      title: broadcastTitle.trim(),
      message: broadcastMessage.trim(),
      type: broadcastType,
      actionUrl: '/find-parking',
    });

    setBroadcastTitle('');
    setBroadcastMessage('');
    setShowBroadcastModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-sky-600" />
                Notification System
              </span>
              <span className="text-xs text-slate-400 font-mono">Real-time Campus Alerts</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              In-App Notifications & Alerts
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live updates on parking confirmations, lot saturation warnings, and traffic security notices.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {role === 'admin' && (
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Send Alert
              </button>
            )}
            <button
              onClick={() => storageService.markAllNotificationsAsRead()}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark All Read
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          {['all', 'unread', 'warning', 'success', 'info'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1.5 rounded-xl capitalize transition-colors ${
                filterType === tab
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'unread' ? `Unread (${notifications.filter(n => !n.isRead).length})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-card">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">No notifications found</h3>
            <p className="text-xs text-slate-500 mt-1">
              You are completely caught up with campus parking alerts.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            return (
              <div
                key={notif.id}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-card flex items-start justify-between gap-4 ${
                  !notif.isRead
                    ? 'border-sky-300 bg-sky-50/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.type === 'success'
                      ? 'bg-emerald-100 text-emerald-700'
                      : notif.type === 'warning'
                      ? 'bg-amber-100 text-amber-700'
                      : notif.type === 'danger'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-sky-100 text-sky-700'
                  }`}>
                    {notif.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                    {notif.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                    {notif.type === 'danger' && <XCircle className="w-5 h-5" />}
                    {notif.type === 'info' && <Info className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{notif.title}</h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span>{new Date(notif.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      {notif.actionUrl && (
                        <button
                          onClick={() => {
                            storageService.markNotificationAsRead(notif.id);
                            onNavigate(notif.actionUrl!.replace('/', ''));
                          }}
                          className="text-sky-600 hover:text-sky-800 font-bold flex items-center gap-1"
                        >
                          View Action <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!notif.isRead && (
                    <button
                      onClick={() => storageService.markNotificationAsRead(notif.id)}
                      className="p-1.5 text-slate-400 hover:text-sky-600 rounded-lg hover:bg-slate-100"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => storageService.deleteNotification(notif.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                    title="Delete alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Admin Broadcast Alert Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Broadcast Campus Traffic Announcement
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Dispatch an in-app notice to all student and faculty two-wheeler riders.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Alert Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Block 25 Bay Closed for Maintenance"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Severity Type
                </label>
                <select
                  value={broadcastType}
                  onChange={(e) => setBroadcastType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="warning">Warning (Orange)</option>
                  <option value="info">Information (Blue)</option>
                  <option value="success">Success / Clearance (Green)</option>
                  <option value="danger">High Congestion / Emergency (Red)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Alert Message
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide guidance to two-wheeler riders regarding vacant parking bay alternatives..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
