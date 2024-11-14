import React, { useState, useEffect, useRef } from "react";
import styles from "./MessagingInterface.module.css";

const MessagingInterface = ({ recipientId, senderId, animalReportId, recipientName }) => {
    const [content, setContent] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    // Function to fetch messages between the sender and recipient
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

    // Function to send a new message
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
                    body: JSON.stringify({ content, senderId, animalReportId })
                }
            );
            const data = await response.json();

            if (response.ok) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { content, senderId, timestamp: new Date().toISOString(), animalReportId }
                ]);
                setContent("");
            } else {
                console.error("Failed to send message:", data.message);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // Fetch messages on component mount
    useEffect(() => {
        getMessages();
    }, [recipientId]);

    // Scroll to the latest message when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Messaging</h1>

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

            <div className={styles.messagesContainer}>
                <h2 className={styles.subHeading}>Messages</h2>
                {messages.length > 0 ? (
                    <ul className={styles.messageList}>
                        {messages.map((msg, index) => {
                            const isSentByCurrentUser = msg.senderId === senderId;

                            return (
                                <li key={msg._id || index} className={
                                    isSentByCurrentUser
                                        ? styles.sentMessage
                                        : styles.receivedMessage
                                }>
                                    <strong>{isSentByCurrentUser ? "You" : recipientName}</strong>: {msg.content}

                                    {/* Display animal report preview if available */}
                                    {msg.animalReportId && msg.animalReportId.animal && (
                                        <div className={styles.animalReportPreview}>
                                            <img src={msg.animalReportId.animal.imageUrl} alt={msg.animalReportId.animal.name} className={styles.animalImage} />
                                            <p><strong>{msg.animalReportId.animal.name}</strong></p>
                                            <p>{msg.animalReportId.animal.species}</p>
                                        </div>
                                    )}

                                    <span className={styles.timestamp}>
                                        {new Date(msg.timestamp).toLocaleString()}
                                    </span>
                                </li>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </ul>
                ) : (
                    <p className={styles.noMessages}>No messages found.</p>
                )}
            </div>
        </div>
    );
};

export default MessagingInterface;
