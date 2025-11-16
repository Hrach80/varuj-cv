// src/components/AuthModal/AuthModal.jsx
import React, { useState, useContext } from 'react';
import supabase from '../../supabaseClient';
import { AuthContext } from '../../context/AuthContext';
import './AuthModal.css'; // Ավելացնում ենք նոր CSS ֆայլ

export const AuthModal = ({ isOpen, onClose, t }) => {
    const { checkAdminStatus } = useContext(AuthContext);
    const [authForm, setAuthForm] = useState({ email: '', password: '' });
    const [status, setStatus] = useState(''); 

    if (!isOpen) return null;

    const handleLogin = async (e) => {
        e.preventDefault();
        setStatus('loading');

        const { error } = await supabase.auth.signInWithPassword(authForm);

        if (error) {
            console.error('Login failed:', error);
            setStatus('error');
            alert('Մուտքի սխալ։ Ստուգեք տվյալները։');
        } else {
            setStatus('success');
            await checkAdminStatus();
            setAuthForm({ email: '', password: '' }); 
            onClose(); 
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target.className === 'auth-modal-backdrop') {
            onClose();
        }
    };

    return (
        <div className="auth-modal-backdrop" onClick={handleBackdropClick}>
            <div className="auth-modal-content" onClick={e => e.stopPropagation()}>
                <button className="auth-modal-close-button" onClick={onClose}>
                    &times;
                </button>

                <h3>{t('login_title')}</h3>

                <form onSubmit={handleLogin} className="auth-login-form">

                    <input
                        type="email"
                        placeholder={t('form_email')}
                        value={authForm.email}
                        onChange={(e) => setAuthForm(p => ({ ...p, email: e.target.value }))}
                        required
                        disabled={status === 'loading'}
                    />
                    <input
                        type="password"
                        placeholder={t('form_password')}
                        value={authForm.password}
                        onChange={(e) => setAuthForm(p => ({ ...p, password: e.target.value }))}
                        required
                        disabled={status === 'loading'}
                    />

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? t('loading_text') : t('login_button')}
                    </button>
                </form>

                {status === 'error' && <p className="form-message error-message">{t('login_error')}</p>}
                {status === 'success' && <p className="form-message success-message">{t('login_success')}</p>}
            </div>
        </div>
    );
};