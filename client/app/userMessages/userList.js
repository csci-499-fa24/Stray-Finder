import styles from './userList.module.css'; // Import CSS as styles

export default function UserList({ users, onUserSelect }) {
    return (
        <div className={styles.userList}>
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
