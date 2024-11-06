// src/components/AdminPanel/AdminPanel.js
import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import DeleteUserModal from './DeleteUserModal';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newUser, setNewUser] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'player'
    });
    const [message, setMessage] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:5000/api/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                console.error('Expected an array of users, but got:', data);
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setMessage('Error fetching users: ' + error.message);
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                setMessage('User created successfully');
                setNewUser({
                    username: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                    role: 'player'
                });
                fetchUsers();
            } else {
                const data = await response.json();
                setMessage(data.message || 'Error creating user');
            }
        } catch (error) {
            setMessage('Error creating user');
        }
    };

    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const confirmDelete = async () => {
        if (userToDelete) {
            await handleDeleteUser(userToDelete.id);
            closeDeleteModal();
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                setMessage('User deleted successfully');
                fetchUsers();
            } else {
                const data = await response.json();
                setMessage(data.message || 'Error deleting user');
            }
        } catch (error) {
            setMessage('Error deleting user');
        }
    };

    return (
        <div className="container">
            <h2 className="title is-2">Admin Panel</h2>
            
            {message && (
                <div className={`notification ${message.includes('Error') ? 'is-danger' : 'is-success'}`}>
                    {message}
                </div>
            )}
            
            <div className="columns">
                <div className="column is-half">
                    <h3 className="title is-4">Create New User Account</h3>
                    <form onSubmit={handleAddUser}>
                        <div className="field">
                            <label className="label">Username</label>
                            <input
                                className="input"
                                type="text"
                                value={newUser.username}
                                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                                required
                            />
                        </div>
                        <div className="field">
                            <label className="label">Password</label>
                            <input
                                className="input"
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                required
                            />
                        </div>
                        <div className="field">
                            <label className="label">First Name</label>
                            <input
                                className="input"
                                type="text"
                                value={newUser.firstName}
                                onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                                required
                            />
                        </div>
                        <div className="field">
                            <label className="label">Last Name</label>
                            <input
                                className="input"
                                type="text"
                                value={newUser.lastName}
                                onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                                required
                            />
                        </div>
                        <div className="field">
                            <label className="label">Role</label>
                            <div className="select is-fullwidth">
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                    required
                                >
                                    <option value="player">Player</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <button className="button is-primary" type="submit">Create User Account</button>
                    </form>
                </div>
                
                <div className="column is-half">
                    <h3 className="title is-4">User Accounts</h3>
                    {isLoading ? (
                        <p>Loading users...</p>
                    ) : users.length > 0 ? (
                        <table className="table is-fullwidth">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.username}</td>
                                        <td>{`${user.first_name || ''} ${user.last_name || ''}`}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <button 
                                                className="button is-small is-danger"
                                                onClick={() => openDeleteModal(user)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No users found.</p>
                    )}
                </div>
            </div>

            <DeleteUserModal 
                isOpen={deleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                username={userToDelete?.username}
            />
        </div>
    );
};

export default AdminPanel;