import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        phoneNo: '',
        address: '',
        bloodGroup: '',
    });

    const initialFormData={
        username: '',
        password: '',
        email: '',
        phoneNo: '',
        address: '',
        bloodGroup: '',
    };

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });


            if (response.ok) {
                const usersResponse = await fetch('http://localhost:8000/getUsers');
                const usersData = await usersResponse.json();
                console.log('Users array after registration:', usersData);

                // Navigate to the login page
                navigate('/');
            } else {
                alert('User already existed');
                const usersResponse = await fetch('http://localhost:8000/getUsers');
                const usersData = await usersResponse.json();
                console.log('Users array after registration:', usersData);
            }
        } catch (error) {
            console.error('Registration error:', error);
        }

        setFormData(initialFormData);
        navigate('/home');
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <form onSubmit={handleRegister}>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                    <br />
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    <br />
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <br />
                    <label>Phone Number:</label>
                    <input
                        type="tel"
                        name="phoneNo"
                        value={formData.phoneNo}
                        onChange={handleInputChange}
                    />
                    <br />
                    <label>Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                    />
                    <br />
                    <label>Blood Group:</label>
                    <input
                        type="text"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                    />
                    <br />
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
