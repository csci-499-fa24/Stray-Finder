import React, { useState } from "react";
import styles from "./MessagingInterface.module.css";

const MessagingInterface = ( { recipientId, senderId } ) => {
  const [content, setContent] = useState("");
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
          body: JSON.stringify({ content, senderId }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        //alert("Message sent successfully");
        setMessages((prevMessages) => [...prevMessages, { content, senderId, timestamp: new Date().toISOString() }]);
        setContent("");
      } else {
        console.error("Failed to send message:", data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getMessages = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/message/${recipientId}`,
        {
          credentials: "include"
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessages(data); // Update state with fetched messages from the server
      } else {
        console.error("Failed to fetch messages:", data.message);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
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
            {messages.map((message, index) => (
              <li key={message._id || index} className={
                message.senderId === senderId
                  ? styles.sentMessage
                  : styles.receivedMessage
              }>
                <strong>{message.senderId === senderId ? "You" : "Recipient"}</strong>: {message.content}
                <span className={styles.timestamp}>
                  {new Date(message.timestamp).toLocaleString()}
                </span>
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