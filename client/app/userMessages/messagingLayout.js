import { useState, useEffect } from 'react';
import UserList from './userList';
import MessagePanel from './messagePanel';
import useAuth from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import styles from './messagingLayout.module.css'; // Import CSS as styles

export default function MessagingLayout() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated === false) {
            router.push('/auth'); // Redirect to login page if not authenticated
        } else if (isAuthenticated) {
            async function fetchUsers() {
                try {
                    const response = await fetch(
                        process.env.NEXT_PUBLIC_SERVER_URL + '/api/message',
                        { credentials: "include" }
                    );
                    const data = await response.json();
                    setUsers(Array.isArray(data) ? data : []); // Ensure data is an array
                } catch (error) {
                    console.error('Error fetching users:', error);
                    setUsers([]); // Set to an empty array in case of error
                }
            }
            fetchUsers();

            async function fetchUsersWithLastMessage() {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/message/last-messages`, {
                        credentials: 'include'
                    });
                    const data = await response.json();
                    setUsers(Array.isArray(data) ? data : []);
                } catch (error) {
                    console.error('Error fetching users with last messages:', error);
                    setUsers([]);
                }
            }
            fetchUsersWithLastMessage();
        }
    }, [isAuthenticated]);

    return (
        <div className={styles.messagingLayout}>
            <UserList users={users} onUserSelect={setSelectedUser} selectedUser={selectedUser}/>
            <MessagePanel selectedUser={selectedUser} user={user}/>
        </div>
    );
}
