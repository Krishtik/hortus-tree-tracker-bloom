
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Check, X } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal = ({ isOpen, onClose }: NotificationModalProps) => {
  const notifications = [
    {
      id: '1',
      title: 'New Tree Added Nearby',
      message: 'A Banyan tree was tagged 0.5km from your location',
      time: '5 minutes ago',
      type: 'info',
      read: false
    },
    {
      id: '2',
      title: 'AI Identification Complete',
      message: 'Your recent tree scan has been processed successfully',
      time: '1 hour ago',
      type: 'success',
      read: false
    },
    {
      id: '3',
      title: 'Tree Verification Approved',
      message: 'Your Neem tree entry has been verified by the community',
      time: '2 hours ago',
      type: 'success',
      read: true
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border ${
                notification.read ? 'bg-muted/50' : 'bg-background border-primary/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    {!notification.read && (
                      <Badge variant="secondary" className="h-2 w-2 p-0 rounded-full bg-primary"></Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {notification.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" size="sm" className="flex-1">
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;
