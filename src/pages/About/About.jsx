import React, { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext.jsx';
import './About.css';
import {
    FaGraduationCap,
    FaBrain,
    FaRocket,
} from 'react-icons/fa6';

const About = () => {
    const { t } = useContext(LanguageContext);
    const focusAreas = [
        {
            icon: FaGraduationCap,
            titleKey: 'about_mission',
            textKey: 'about_mission_text',
            linkTextKey: 'about_link',
            linkHref: 'https://www.ysmu.am/',
            linkClassName: 'ysmu-link'
        },
        {
            icon: FaBrain,
            titleKey: 'about_focus',
            textKey: 'about_focus_text'
        },
        {
            icon: FaRocket,
            titleKey: 'about_innovations',
            textKey: 'about_innovations_text'
        },
    ];

    return (
        <div className="about-container">
            <header className="about-header">
                <img
                    // Շտկված ճանապարհը
                    src="/images/bhlogo.png"
                    alt="BH Logo"
                    className="about-logo"
                />

                <h1 className="fade-in">{t('about_title')}</h1>
                <p className="about-subtitle fade-in delay-1">{t('about_subtitle')}</p>
            </header>

            <div className="about-content-grid">
                {focusAreas.map((item, index) => (
                    <section
                        key={index}
                        className={`about-section section-${index + 1} bounce-in delay-${index + 2}`}
                    >
                        <div className="section-icon-wrapper">
                            <item.icon className="section-icon" />
                        </div>
                        <h2>{t(item.titleKey)}</h2>
                        <p>{t(item.textKey)}</p>

                        {item.linkHref && (
                            <a
                                href={item.linkHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`section-link ${item.linkClassName}`}
                            >
                                {t(item.linkTextKey)}
                            </a>
                        )}
                    </section>
                ))}
            </div>

        </div>
    );
}

export default About;