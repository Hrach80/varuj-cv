
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from '../../context/LanguageContext.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import { AuthModal } from '../AuthModal/AuthModal.jsx';
import "./Nav.css";

export const Nav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { currentLang, setCurrentLang, t } = useContext(LanguageContext);
    const { isAdmin, handleLogout } = useContext(AuthContext);


    const handleLangChange = (lang) => {
        setCurrentLang(lang);
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };
    const handleOpenModal = () => {
        setIsMenuOpen(false);
        setIsModalOpen(true);
    };
    const handleAdminLogout = () => {
        handleLogout();
        setIsMenuOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    const languages = ['AM', 'EN', 'RU'];

    const mainLinks = [
        { path: '/', key: 'home' },
        { path: '/about', key: 'about' },
        { path: '/services', key: 'services' },
        { path: '/testimonial', key: 'testimonial' },
        { path: '/blog', key: 'blog' },
        { path: '/timeline', key: 'timeline_title', className: 'appointment-button' },
    ];

    const AuthButton = ({ className, onClick }) => (
        <button
            className={className}
            onClick={onClick}
        >
            {isAdmin ? t('logout_button') : t('login_button')}
        </button>
    );

    return (
        <>
            <nav className="nav-bar">
                {/* Լոգո */}
                <div className="logo">
                    <Link to="/" onClick={handleLinkClick}>Varujan Vagharshakyan</Link>
                </div>

                <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                    {mainLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={handleLinkClick}
                            className={link.className}
                        >
                            {t(link.key)}
                        </Link>
                    ))}

                    <AuthButton
                        className="modal-button"
                        onClick={isAdmin ? handleAdminLogout : handleOpenModal}
                    />
                </div>
                <div className="nav-actions">
                    <AuthButton
                        className="modal-button desktop-only-button"
                        onClick={isAdmin ? handleAdminLogout : handleOpenModal}
                    />

                    <div className="language-selector">
                        {languages.map((lang, index) => (
                            <React.Fragment key={lang}>
                                <span
                                    className={`lang-option ${currentLang === lang ? 'active' : ''}`}
                                    onClick={() => handleLangChange(lang)}
                                >
                                    {lang}
                                </span>
                                {index < languages.length - 1 && ' / '}
                            </React.Fragment>
                        ))}
                    </div>

                    <div
                        className={`burger-menu ${isMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <div className="bar1"></div>
                        <div className="bar2"></div>
                        <div className="bar3"></div>
                    </div>
                </div>
            </nav>
            <AuthModal isOpen={isModalOpen} onClose={handleCloseModal} t={t} />
        </>
    );
};