// components/MessagePanel.js
import { useState, useEffect } from 'react';
import styles from './messagePanel.module.css'

export default function MessagePanel({ selectedUser, user }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (selectedUser) {
            // Fetch message history from the server
            async function fetchMessages() {
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/message/${selectedUser.id}`,
                        {
                          credentials: "include"
                        }
                      );
                    const data = await response.json();
                    setMessages(data);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            }
            fetchMessages();
        }
    }, [selectedUser]);

    const handleSendMessage = async () => {
        console.log(messages);
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
                setMessages([...messages, { content: newMessage, sender: 'You' }]);
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
                    <h2 className={styles.panelHeader}>Chat with {selectedUser.username || "User"}</h2>
                    <div className={styles.messageHistory}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`${styles.message} ${(msg.sender === 'You' || msg.senderId === user._id) ? styles.sent : styles.received}`}
                            >
                                <p className={styles.messageContent}>{msg.content}</p>
                            </div>
                        ))}
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
                <p className={styles.selectUserPrompt}>Select a user to start a conversation</p>
            )}
        </div>
    );

}
