"use client";

import React, { useEffect, useState } from "react";
import { FaThumbtack } from "react-icons/fa";
import Navbar from "@/app/components/layouts/Navbar/Navbar";
import "./NotificationsPage.css";

const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(timestamp)) / 1000);
  
    if (diffInSeconds < 60) return `${diffInSeconds}s`; // Seconds
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`; // Minutes
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`; // Hours
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`; // Days
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w`; // Weeks
    const diffInMonths = Math.floor(diffInWeeks / 4);
    if (diffInMonths < 12) return `${diffInMonths}m`; // Months
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears}y`; // Years
  };  

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications on page load
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/notifications`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        console.log(`Fetched Notifications Count: ${data.notifications.length}`);
        console.log("Fetched Notifications Data:", data.notifications);
        
        const pinnedNotifications = data.notifications.filter((n) => n.isPinned);
        const regularNotifications = data.notifications.filter((n) => !n.isPinned);
        setNotifications([...pinnedNotifications, ...regularNotifications]);

      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Helper to group notifications by time
  const groupNotificationsByTime = (notifications) => {
    const grouped = { Today: [], Yesterday: [], Earlier: [] };
    const now = new Date();

    notifications.forEach((notification) => {
      const notificationDate = new Date(notification.timestamp);
      const isToday = now.toDateString() === notificationDate.toDateString();

      const yesterdayDate = new Date(now);
      yesterdayDate.setDate(now.getDate() - 1);
      const isYesterday = yesterdayDate.toDateString() === notificationDate.toDateString();

      if (isToday) grouped.Today.push(notification);
      else if (isYesterday) grouped.Yesterday.push(notification);
      else grouped.Earlier.push(notification);
    });

    return grouped;
  };

  const groupedNotifications = groupNotificationsByTime(
    notifications.filter((n) => !n.isPinned)
  );

  return (
    <div className="notifications-page">
      <Navbar />
      <main className="notifications-container">
        <h1 className="notifications-title">Notifications</h1>
        {loading ? (
          <p className="loading-message">Loading notifications...</p>
        ) : notifications.length > 0 ? (
          <>
            {/* Display Pinned Notifications */}
            {notifications.filter((n) => n.isPinned).length > 0 && (
              <div>
                <div className="notifications-list">
                  {notifications
                    .filter((n) => n.isPinned)
                    .map((notification, index) => (
                      <div
                        key={index}
                        className={`notification-item ${notification.read ? "read" : "unread"} ${
                          notification.isPinned ? "pinned" : ""
                        }`}
                      >
                        <div className="notification-left">
                          <span className="notification-message">{notification.message}</span>
                        </div>

                        {/* Right Section: Pinned Icon */}
                        <div className="notification-right">
                          <FaThumbtack className="pinned-icon" title="Pinned" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
  
            {/* Display Regular Notifications Grouped by Time */}
            {Object.keys(groupedNotifications).map((group) => groupedNotifications[group].length > 0 && (
              <div key={group}>
                <h2 className="time-group-title">{group}</h2>
                <div className="notifications-list">
                  {groupedNotifications[group].map((notification, index) => (
                    <div
                      key={index}
                      className={`notification-item ${notification.read ? "read" : "unread"}`}
                    >
                      {/* Render Based on Notification Type */}
                      {notification.type === "match" && (
                        <div className="notification-left">
                          <span className="notification-message">{notification.message}</span>
                        </div>
                      )}

                      {/* Left Section: Commenter's Profile Image, Name, and Notification Message */}
                      {notification.type === "comment" && (
                        <div className="notification-left">
                          <img
                            src={
                              notification.meta.commenterProfileImage ||
                              "/no_pfp.jpg"
                            }
                            alt={notification.meta.commenterName}
                            className="profile-image"
                          />
                          <div className="notification-content">
                            <div className="notification-header">
                              <span className="commenter-name">{notification.meta.commenterName}</span>
                              <span className="notification-message">
                                {`New comment on your post captioned: "${notification.meta.postPreview?.description?.substring(
                                  0,
                                  50
                                )}${
                                  notification.meta.postPreview?.description.length > 50 ? "..." : ""
                                }"`}
                              </span>
                            </div>
    
                            {/* Second Line: Latest Comment + Timestamp */}
                            {notification.meta.latestComment && (
                              <div className="notification-body">
                                <span className="latest-comment">
                                  <strong>Comment:</strong> {notification.meta.latestComment}
                                </span>
                                <span className="notification-timestamp">
                                  {formatRelativeTime(notification.timestamp)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
  
                      {/* Right Section: Post Preview (only for comments)*/}
                      {notification.type === "comment" && notification.meta.postPreview && (
                        <div className="notification-right">
                          <img
                            src={notification.meta.postPreview.imageUrl || "paw-pattern.jpg"}
                            alt={notification.meta.postPreview.name}
                            className="post-image"
                          />
                          <div className="post-info">
                            <p className="post-name">{notification.meta.postPreview.name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className="no-notifications-message">You're all caught up! 🎉</p>
        )}
      </main>
    </div>
  );  
};

export default NotificationsPage;
