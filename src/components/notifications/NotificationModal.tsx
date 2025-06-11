
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { bell, circle-check, x } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}

const NotificationModal = ({ isOpen, onClose }: NotificationModalProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Tree Added Nearby',
      message: 'A Banyan tree was tagged 0.5km from your location in Maharashtra',
      time: '5 minutes ago',
      type: 'info',
      read: false
    },
    {
      id: '2',
      title: 'Enhanced AI Identification Complete',
      message: 'Your recent tree scan has been processed with color analysis and cultural data',
      time: '1 hour ago',
      type: 'success',
      read: false
    },
    {
      id: '3',
      title: 'Tree Verification Approved',
      message: 'Your Neem tree entry has been verified by the community with Sangam Land data',
      time: '2 hours ago',
      type: 'success',
      read: true
    },
    {
      id: '4',
      title: 'Location Services Enhanced',
      message: 'GPS accuracy improved for better tree tagging in your region',
      time: '3 hours ago',
      type: 'info',
      read: false
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 dark:text-white">
            <bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                {unreadCount} new
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                notification.read 
                  ? 'bg-muted/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600' 
                  : 'bg-background dark:bg-gray-800 border-primary/20 dark:border-green-600/30 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm dark:text-white">{notification.title}</h4>
                    {!notification.read && (
                      <Badge variant="secondary" className="h-2 w-2 p-0 rounded-full bg-primary dark:bg-green-500"></Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground dark:text-gray-300 leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-gray-400 mt-2">
                    {notification.time}
                  </p>
                </div>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                    className="ml-2 h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/30"
                  >
                    <circle-check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4 border-t dark:border-gray-700">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 dark:border-gray-600 dark:text-gray-300"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <circle-check className="h-4 w-4 mr-2" />
            Mark All Read {unreadCount > 0 && `(${unreadCount})`}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose}
            className="dark:border-gray-600 dark:text-gray-300"
          >
            <x className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;
