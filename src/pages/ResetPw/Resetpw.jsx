import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase'; 
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'; 
import { doc, getDocs, query, where, updateDoc, collection } from 'firebase/firestore'; 
import { db } from '../../firebase/firebase'; 
import './Resetpw.css';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';

function ResetPassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [reEnterNewPassword, setReEnterNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const updateFirestore = async (email) => {
        try {
            const studentsQuery = query(collection(db, 'students'), where('email', '==', email));
            const studentSnapshot = await getDocs(studentsQuery);

            if (!studentSnapshot.empty) {
                const studentDoc = studentSnapshot.docs[0];
                await updateDoc(doc(db, 'students', studentDoc.id), { isFirstTimeLogin: false });
                return 'student';
            }

            const teachersQuery = query(collection(db, 'teachers'), where('email', '==', email));
            const teacherSnapshot = await getDocs(teachersQuery);

            if (!teacherSnapshot.empty) {
                const teacherDoc = teacherSnapshot.docs[0];
                await updateDoc(doc(db, 'teachers', teacherDoc.id), { isFirstTimeLogin: false });
                return 'teacher';
            }

            throw new Error('User not found in Firestore');
        } catch (error) {
            throw new Error('Failed to update Firestore: ' + error.message);
        }
    };
    

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== reEnterNewPassword) {
            setError('New passwords do not match.');
            return;
        }

        try {
            const user = auth.currentUser;

            if (user) {
                const credential = EmailAuthProvider.credential(user.email, currentPassword);

                await reauthenticateWithCredential(user, credential);

                await updatePassword(user, newPassword);

                const userType = await updateFirestore(user.email);
                
                setSuccess(`Password successfully updated for ${userType}! Redirecting to login...`);

                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError('User not found. Please log in again.');
            }
        } catch (error) {
            setError('Failed to reset password: ' + error.message);
        }
    };

    return (
            <div className="reset-container">
            <div className="reset-box">
                <h2>Reset Password</h2>
                <form onSubmit={handleResetPassword}>
                <div className="input-container">
                    <label>Current Password</label>
                    <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    />
                </div>

                <div className="input-container">
                    <label>New Password</label>
                    <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    />
                </div>

                <div className="input-container">
                    <label>Re-Enter New Password</label>
                    <input
                    type="password"
                    value={reEnterNewPassword}
                    onChange={(e) => setReEnterNewPassword(e.target.value)}
                    required
                    />
                </div>

                <button type="submit" className="reset-button">RESET</button>

                <div className="back-to-login">
                    <a href="/login">&lt;back to login</a>
                </div>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                </form>
            </div>
            </div>

    );
}

export default ResetPassword;
