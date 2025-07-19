import React, { useEffect, useState } from 'react';
import { Dropdown, Badge, ListGroup, Button } from 'react-bootstrap';
import { BsBell, BsBellFill } from 'react-icons/bs';
import axios from 'axios';
import { toast } from 'react-toastify';

const NotificationCenter = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/notifications/user/${userId}`);
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:4000/api/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`http://localhost:4000/api/notifications/user/${userId}/read-all`);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task_assigned': return '📋';
      case 'task_updated': return '🔄';
      case 'task_completed': return '✅';
      case 'comment_added': return '💬';
      case 'due_date_reminder': return '⏰';
      default: return '📢';
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notificationDate.toLocaleDateString();
  };

  return (
    <Dropdown show={show} onToggle={setShow} align="end">
      <Dropdown.Toggle
        variant="outline-light"
        id="notification-dropdown"
        className="position-relative border-0"
        style={{ background: 'none' }}
      >
        {unreadCount > 0 ? (
          <BsBellFill size={20} className="text-warning" />
        ) : (
          <BsBell size={20} />
        )}
        {unreadCount > 0 && (
          <Badge
            bg="danger"
            className="position-absolute top-0 start-100 translate-middle rounded-pill"
            style={{ fontSize: '0.7rem' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ width: '350px', maxHeight: '400px', overflowY: 'auto' }}>
        <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
          <h6 className="mb-0">Notifications</h6>
          {unreadCount > 0 && (
            <Button variant="link" size="sm" onClick={markAllAsRead} className="p-0">
              Mark all read
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <BsBell size={30} className="mb-2" />
            <p className="mb-0">No notifications yet</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {notifications.slice(0, 10).map((notification) => (
              <ListGroup.Item
                key={notification._id}
                className={`border-0 ${!notification.isRead ? 'bg-light' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => !notification.isRead && markAsRead(notification._id)}
              >
                <div className="d-flex align-items-start">
                  <span className="me-2" style={{ fontSize: '1.2rem' }}>
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>
                        {notification.title}
                      </h6>
                      {!notification.isRead && (
                        <Badge bg="primary" className="ms-2" style={{ fontSize: '0.6rem' }}>
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="mb-1 text-muted" style={{ fontSize: '0.8rem' }}>
                      {notification.message}
                    </p>
                    <small className="text-muted">
                      {formatTimeAgo(notification.createdAt)}
                    </small>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        {notifications.length > 10 && (
          <div className="text-center py-2 border-top">
            <small className="text-muted">Showing latest 10 notifications</small>
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationCenter;