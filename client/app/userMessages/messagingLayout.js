import { useState, useEffect } from 'react';
import UserList from './userList';
import MessagePanel from './messagePanel';
import useAuth from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Loader from '../components/loader/Loader';
import styles from './messagingLayout.module.css'; // Import CSS as styles
import { useUnreadMessages } from '@/app/context/UnreadMessagesContext';


export default function MessagingLayout() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true); // New loading state
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();
    const { setHasUnreadMessages } = useUnreadMessages();

    useEffect(() => {
        console.log("Current user data:", user);
        if (isAuthenticated === false) {
            router.push('/auth'); // Redirect to login page if not authenticated
        } else if (isAuthenticated && user) {
            // Set loading to false once user data is available
            setLoading(false);

            async function fetchUsersWithLastMessage() {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/message/last-messages`, {
                        credentials: 'include'
                    });
                    const data = await response.json();
                    setUsers(Array.isArray(data) ? data : []);
            
                    // Update hasUnreadMessages in the context based on the fetched data
                    const unread = data.some(msg => msg.senderId !== user._id && !msg.read);
                    setHasUnreadMessages(unread);
                } catch (error) {
                    console.error('Error fetching users with last messages:', error);
                    setUsers([]);
                }
            }
            

            fetchUsersWithLastMessage();
        }
    }, [isAuthenticated, user]);

    if (loading) return <Loader />;

    return (
        <div className={styles.messagingLayout}>
            <UserList 
                users={users} 
                onUserSelect={setSelectedUser} 
                selectedUser={selectedUser} 
                currentUser={user}
                setHasUnreadMessages={setHasUnreadMessages} 
            />
            <MessagePanel 
                selectedUser={selectedUser} 
                user={user} 
                setHasUnreadMessages={setHasUnreadMessages} 
                users={users} 
                setUsers={setUsers} 
            />
        </div>
    );
}
