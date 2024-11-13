import styles from './userList.module.css';

export default function UserList({ users, onUserSelect, selectedUser, currentUser }) {
    const handleUserClick = async (user) => {
        onUserSelect(user);
        
        // Mark messages as read on the server
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/message/mark-as-read/${user.id}`, {
            method: 'POST',
            credentials: 'include'
        });

        // Update local unread status immediately after marking as read
        const unreadExists = users.some(u => u.id !== user.id && u.senderId !== currentUser._id && !u.delivered);
        setHasUnreadMessages(unreadExists);
    };
    
    return (
        <div className={styles.userList}>
            <h2 className={styles.header}>Messages</h2>
            {users
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((user) => {
                    const isUnread = user.senderId !== currentUser._id && !user.delivered;

                    return (
                        <div 
                            key={user.id}
                            className={`${styles.userListItem} ${selectedUser && selectedUser.id === user.id ? styles.userListItemSelected : ''}`}
                            onClick={() => onUserSelect(user)}
                        >
                            <div className={styles.username}>
                                {user.username}
                            </div>
                            <div className={`${styles.lastMessage} ${isUnread ? styles.unreadLastMessage : ''}`}>
                                {user.lastMessage}
                            </div>
                            {isUnread && <span className={styles.unreadDot}></span>}
                        </div>
                    );
                })}
        </div>
    );
}
