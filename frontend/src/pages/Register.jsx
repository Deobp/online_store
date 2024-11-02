import { useState } from 'react';
import axios from 'axios';
import './Register.css';

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        username: '',
        phone: '',
        country: '',
        city: '',
        street: '',
        house: '',
        apartment: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        
        // Validate first step
        if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
            setError('Please fill in all required fields');
            return;
        }
        
        setError('');
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/users/register', formData, {
                withCredentials: true
            });
            setSuccess(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            setSuccess('');
        }
    };

    return (
        <div className="register-container">
            <h2>Register {step === 1 ? '(Step 1/2)' : '(Step 2/2)'}</h2>
            
            {step === 1 ? (
                <form onSubmit={handleNext} className="register-form">
                    <div className="form-group">
                        <label>Email*</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password*</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>First Name*</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name*</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="next-btn">Next</button>
                </form>
            ) : (
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label>Username*</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone*</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Country*</label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>City*</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Street*</label>
                        <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>House Number*</label>
                        <input
                            type="number"
                            name="house"
                            value={formData.house}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Apartment (optional)</label>
                        <input
                            type="number"
                            name="apartment"
                            value={formData.apartment}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="button-group">
                        <button type="button" onClick={handleBack} className="back-btn">
                            Back
                        </button>
                        <button type="submit" className="register-btn">
                            Register
                        </button>
                    </div>
                </form>
            )}
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
        </div>
    );
};

export default Register;
