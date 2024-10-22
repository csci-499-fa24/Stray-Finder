import React, { useState } from 'react';

const MessagingInterface = () => {
    const [content, setContent] = useState('');  // Message content
    const [recipientId, setRecipientId] = useState('');  // Recipient ID
    const [messages, setMessages] = useState([]);  // Messages state

    // Function to send a message
    const sendMessage = async () => {
        if (!recipientId || !content) {
            alert('Recipient and message content are required!');
            return;
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/message/${recipientId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ content }),
            });
            const data = await response.json();

            if (response.ok) {
                alert('Message sent successfully');
            } else {
                console.error('Failed to send message:', data.message);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Function to get messages
    const getMessages = async () => {
        try {
            const otherUserId = recipientId;  // Assume the recipientId is the other user
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/message/${otherUserId}`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setMessages(data);  // Store fetched messages in state
            } else {
                console.error('Failed to get messages:', data.message);
            }
        } catch (error) {
            console.error('Error getting messages:', error);
        }
    };

    return (
        <div>
            <h1>Messaging</h1>

            <div>
                <label>Recipient ID:</label>
                <input
                    type="text"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    placeholder="Enter recipient ID"
                />
            </div>

            <div>
                <label>Message Content:</label>
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter message content"
                />
            </div>

            <button onClick={sendMessage}>Send Message</button>
            <button onClick={getMessages}>Get Messages</button>

            <div>
                <h2>Messages</h2>
                {messages.length > 0 ? (
                    <ul>
                        {messages.map((message) => (
                            <li key={message._id}>
                                <strong>{message.senderId}</strong>: {message.content}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No messages found.</p>
                )}
            </div>
        </div>
    );
};

export default MessagingInterface;