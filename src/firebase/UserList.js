import React, { useEffect, useState } from 'react';
import { db } from './firebase'; // Adjust the path to your firebase config file
import { collection, getDocs } from 'firebase/firestore';

const UsersList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCollection);
                const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(usersList);

                // Log the users list to the console
                console.log('Fetched users:', usersList);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h1>Users List</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <p>Name: {user.firstName} {user.lastName}</p>
                        <p>Username: {user.username}</p>
                        <p>Email: {user.email}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UsersList;
