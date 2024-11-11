import styles from './userList.module.css'; // Import CSS as styles

export default function UserList({ users, onUserSelect, selectedUser }) {
    return (
        <div className={styles.userList}>
            <h2 className={styles.header}>Messages</h2>
            {users.map((user) => (
                <div 
                    key={user.id}
                    className={`${styles.userListItem} ${selectedUser && selectedUser.id === user.id ? styles.userListItemSelected : ''}`}
                    onClick={() => onUserSelect(user)}
                >
                    {user.username}
                </div>
            ))}
        </div>
    );
}
