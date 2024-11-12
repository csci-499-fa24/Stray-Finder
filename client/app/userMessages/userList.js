import styles from './userList.module.css';

export default function UserList({ users, onUserSelect, selectedUser, currentUser }) {
    return (
        <div className={styles.userList}>
            <h2 className={styles.header}>Messages</h2>
            {users
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((user) => {
                    const isUnread = user.senderId !== currentUser._id && user.id !== (selectedUser && selectedUser.id);

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
