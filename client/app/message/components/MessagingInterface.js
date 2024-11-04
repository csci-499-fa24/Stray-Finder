import React, { useState } from "react";
import styles from "./MessagingInterface.module.css";

const MessagingInterface = () => {
  const [content, setContent] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!recipientId || !content) {
      alert("Recipient and message content are required!");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/message/${recipientId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ content }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        alert("Message sent successfully");
      } else {
        console.error("Failed to send message:", data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getMessages = async () => {
    try {
      const otherUserId = recipientId;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/message/${otherUserId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      } else {
        console.error("Failed to get messages:", data.message);
      }
    } catch (error) {
      console.error("Error getting messages:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Messaging</h1>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Recipient ID:</label>
        <input
          type="text"
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
          placeholder="Enter recipient ID"
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Message Content:</label>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter message content"
          className={styles.input}
        />
      </div>

      <button className={styles.button} onClick={sendMessage}>
        Send Message
      </button>
      <button className={styles.button} onClick={getMessages}>
        Get Messages
      </button>

      <div className={styles.messagesContainer}>
        <h2 className={styles.subHeading}>Messages</h2>
        {messages.length > 0 ? (
          <ul className={styles.messageList}>
            {messages.map((message) => (
              <li key={message._id} className={styles.messageItem}>
                <strong>{message.senderId}</strong>: {message.content}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noMessages}>No messages found.</p>
        )}
      </div>
    </div>
  );
};

export default MessagingInterface;
