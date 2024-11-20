import styles from './userList.module.css';

export default function UserList({ users, onUserSelect, selectedUser, currentUser, setHasUnreadMessages }) {
    const handleUserClick = async (user) => {
        onUserSelect(user);

        // Mark messages as read on the server
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/message/mark-as-read/${user.id}`, {
            method: 'POST',
            credentials: 'include'
        });

        // Update local unread status immediately after marking as read
        const unreadExists = users.some(u => u.id !== user.id && u.senderId !== currentUser._id && !u.read);
        setHasUnreadMessages(unreadExists);
    };

    return (
        <div className={styles.userList}>
            <h2 className={styles.header}>Messages</h2>
            {users
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((user) => {
                    const isUnread = user.senderId !== currentUser._id && !user.read;

                    const userProfileImage = user.profileImage || null;

                    return (
                        <div 
                            key={user.id}
                            className={`${styles.userListItem} ${selectedUser && selectedUser.id === user.id ? styles.userListItemSelected : ''}`}
                            onClick={() => handleUserClick(user)}
                        >
                            <div className={styles.userInfo}>
                                {/* Profile image and username are in the same row */}
                                <div className={styles.profileColumn}>
                                    <div className={styles.profileIcon}>
                                        {userProfileImage ? (
                                            <img src={userProfileImage} alt={`${user.username}'s profile`} className={styles.profileImage} />
                                        ) : (
                                            <span className={styles.avatarCircle}>{user.username.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.textContainer}>
                                    <div className={styles.username}>{user.username}</div>
                                    <div className={`${styles.lastMessage} ${isUnread ? styles.unreadLastMessage : ''}`}>
                                        {user.lastMessage}
                                    </div>
                                </div>
                            </div>
                            {isUnread && <span className={styles.unreadDot}></span>}
                        </div>
                    );
                })}
        </div>
    );
}
