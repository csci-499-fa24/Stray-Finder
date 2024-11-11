import { useState, useEffect } from 'react';
import styles from './messagePanel.module.css';

export default function MessagePanel({ selectedUser, user }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (selectedUser) {
            async function fetchMessages() {
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/message/${selectedUser.id}`,
                        {
                            credentials: "include"
                        }
                    );
                    const data = await response.json();
                    console.log("Raw message data from server:", data); // Log entire response from server
                    
                    // Ensure messages is an array before setting it in state
                    setMessages(Array.isArray(data) ? data : []);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                    setMessages([]); // Set messages to an empty array if there's an error
                }
            }
            fetchMessages();
        }
    }, [selectedUser]);

    const handleSendMessage = async () => {
        if (newMessage.trim() && selectedUser) {
            try {
                const senderId = selectedUser.id;
                const content = newMessage;
                await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/message/${senderId}`, 
                    {
                        method: 'POST',
                        headers: 
                        {
                            'Content-Type': 'application/json',
                        },
                        credentials: "include",
                        body: JSON.stringify({ content, senderId }),
                    }
                );
                console.log("Sent message:", content); // Log to check message sent
                setMessages([...messages, { content: newMessage, senderId: user._id, timestamp: new Date().toISOString() }]);
                setNewMessage("");
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    return (
        <div className={styles.messagePanel}>
            {selectedUser ? (
                <>
                    <h2 className={styles.panelHeader}>Chat with {selectedUser.username}</h2>
                    <div className={styles.messageHistory}>
                        {messages.map((msg, index) => {
                            console.log("Message senderId:", msg.senderId, "Current user id:", user._id); // Log senderId and user ID for verification
                            const isSentByCurrentUser = msg.senderId === user._id;

                            // Handle undefined senderId with a default label
                            const senderLabel = msg.senderId 
                                ? (isSentByCurrentUser ? "You" : "Recipient") 
                                : "Unknown";

                            return (
                                <div key={index} className={`${styles.messageWrapper} ${isSentByCurrentUser ? styles.sent : styles.received}`}>
                                    <p className={styles.senderLabel}>{senderLabel}</p>
                                    <div className={styles.messageBubble}>
                                        <p className={styles.messageContent}>{msg.content}</p>
                                    </div>
                                    <span className={styles.timestamp}>
                                        {new Date(msg.timestamp).toLocaleString()}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.messageInputContainer}>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className={styles.messageInput}
                        />
                        <button onClick={handleSendMessage} className={styles.sendButton}>Send</button>
                    </div>
                </>
            ) : (
                <div className={styles.waitingContainer}>
                    <img src="/waiting-dog.jpg" alt="Waiting for selection" className={styles.waitingImage} />
                    <p className={styles.selectUserPrompt}>Select a user to start a conversation</p>
                </div>
            )}
        </div>
    );
}