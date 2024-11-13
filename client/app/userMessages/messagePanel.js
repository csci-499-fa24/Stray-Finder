import { useState, useEffect } from 'react';
import styles from './messagePanel.module.css';

export default function MessagePanel({ selectedUser, user, setHasUnreadMessages, setUsers }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const loadingDelay = 300; // Delay in milliseconds before showing loading state

    useEffect(() => {
        let loadingTimeout;

        if (selectedUser) {
            setMessages([]);
            
            loadingTimeout = setTimeout(() => {
                setLoading(true);
            }, loadingDelay);

            async function fetchMessages() {
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/message/${selectedUser.id}`,
                        {
                            credentials: "include"
                        }
                    );
                    const data = await response.json();

                    clearTimeout(loadingTimeout);
                    setMessages(Array.isArray(data) ? data : []);

                    // Mark messages as read immediately after fetching
                    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/message/mark-as-read/${selectedUser.id}`, {
                        method: 'POST',
                        credentials: 'include'
                    });

                    // Update unread status in ProfileMenu and UserList
                    setHasUnreadMessages(false);
                    setUsers(prevUsers => 
                        prevUsers.map(user => 
                            user.id === selectedUser.id ? { ...user, delivered: true } : user
                        )
                    );
                } catch (error) {
                    console.error('Error fetching messages:', error);
                    setMessages([]); // Set messages to an empty array if there's an error
                } finally {
                    setLoading(false); // End loading state
                }
            }

            fetchMessages();
        }

        return () => clearTimeout(loadingTimeout);
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
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            messages.map((msg, index) => {
                                const isSentByCurrentUser = msg.senderId === user._id;

                                const senderLabel = msg.senderId 
                                    ? (isSentByCurrentUser ? "You" : selectedUser.username) 
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
                            })
                        )}
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
