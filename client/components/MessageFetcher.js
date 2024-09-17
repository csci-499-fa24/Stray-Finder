import React, { useState } from 'react'

const MessageFetcher = () => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchMessages = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_SERVER_URL + '/api/message'
            )
            if (!response.ok) {
                throw new Error('Error fetching messages')
            }
            const data = await response.json()
            setMessages(data.message)
        } catch (error) {
            setError('Failed to load messages')
        }

        setLoading(false)
    }

    const buttonStyle = {
        fontSize: '18px',
    }

    return (
        <div>
            <button style={buttonStyle} onClick={fetchMessages}>Get Message</button>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            {messages.map((msg) => (
                <h1 key={msg._id}>{msg.content}</h1>
            ))}
        </div>
    )
}

export default MessageFetcher
