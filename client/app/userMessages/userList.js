import styles from './userList.module.css'; // Import CSS as styles

export default function UserList({ users, onUserSelect }) {
    return (
        <div className={styles.userList}>
            <h2 className={styles.header}>Messages</h2>
            {users.map((user) => (
                <div 
                    key={user.id}
                    className={styles.userListItem}
                    onClick={() => onUserSelect(user)}
                >
                    {user.username}
                </div>
            ))}
        </div>
    );
}
