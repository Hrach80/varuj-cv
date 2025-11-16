import React, { useContext, useState } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

import './Portfolio.css';
const profileData = {
    personal: {
        photo: "../../../public/images/varujan_profile.png",
        email: "vagharshakyanvarujan@gmail.com",
    
    },
    education: [
        { id: 1, institution: 'edu_inst_ysmu', degree: 'edu_degree_md', years: "2019 - 2025" },
        { id: 2, institution: 'edu_inst_residency', degree: 'edu_degree_cardio', years: "2025 - 2028" },
    ],
    certifications: [
        { id: 1, name: 'cert_license', issuer: 'ՀՀ ԱՆ', date: "2025", icon: 'fas fa-certificate' },
        { id: 2, name: 'cert_acls', issuer: 'AHA', date: "2024", icon: 'fas fa-heartbeat' },
    ],
    experience: [
        { id: 1, hospital: 'exp_hosp_surgery', rotation: 'exp_rot_surgery', duration: '3 ամիս', skills: 'exp_skills_surgery' },
        { id: 2, hospital: 'exp_hosp_peds', rotation: 'exp_rot_peds', duration: '2 ամիս', skills: 'exp_skills_peds' },
    ],
    procedureStats: [
        { id: 1, count: '20+', labelKey: 'stat_intubation', icon: 'fas fa-lungs' },
        { id: 2, count: '15+', labelKey: 'stat_catheter', icon: 'fas fa-syringe' },
        { id: 3, count: '40+', labelKey: 'stat_sutures', icon: 'fas fa-cut' },
    ],
    research: [
        { id: 1, title: 'res_title_infarct', type: 'res_type_publication', link: "#" },
        { id: 2, title: 'res_title_infection', type: 'res_type_poster', link: "#" },
    ],
    skills: {
        soft: ['skill_comm', 'skill_ethics', 'skill_teamwork', 'skill_patient_edu'],
        tech: ['tech_ehr', 'tech_telemed', 'tech_stats'],
        languages: ['lang_armenian', 'lang_english', 'lang_russian'],
    }
};

const Profile = () => {
    const { t } = useContext(LanguageContext) || { t: (key) => key };
    const [openSections, setOpenSections] = useState({
        academic: false, 
        clinical: false,
        research: false,
        skills: false,
    });

    const toggleSection = (key) => {
        setOpenSections(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };
    const renderSection = (titleKey, content, sectionKey, className) => {
        const isOpen = openSections[sectionKey];

        return (
            <div className={`profile-section ${className} ${isOpen ? 'open' : 'closed'}`}>
                <div className="accordion-header" onClick={() => toggleSection(sectionKey)}>
                    <h2 className="section-title">{t(titleKey)}</h2>
                    <i className={`accordion-icon fas ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </div>
                <div className="accordion-content">
                    {content}
                </div>
            </div>
        );
    };
    const contactItems = [
        { icon: 'fas fa-envelope', label: profileData.personal.email, link: `mailto:${profileData.personal.email}` },
        
    ];

    return (
        <div className="profile-page">
            <div className="container">
                {/* I. ՆԵՐԱԾԱԿԱՆ ԲԱԺԻՆ (HERO) */}
                <section className="hero-section">
                    <div className="photo-container">
                        <img src={profileData.personal.photo} alt={t('profile_photo_alt')} className="profile-photo" />
                    </div>
                    <div className="bio-container">
                        <h1 className="profile-name">{t('profile_name')}</h1>
                        <h2 className="profile-specialty">{t('profile_specialty')}</h2>
                        <p className="profile-summary">{t('profile_summary')}</p>

                        <div className="contact-info">
                            {contactItems.map((item, index) => (
                                <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="contact-item-link">
                                    <i className={item.icon}></i>
                                    <span>{item.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="main-content-grid">
                    {renderSection('section_academic', (
                        <>
                            <div className="list-group">
                                <h3>{t('academic_education')}</h3>
                                {profileData.education.map(edu => (
                                    <div key={edu.id} className="list-item">
                                        <h4>{t(edu.degree)}</h4>
                                        <p className="institution">{t(edu.institution)}</p>
                                        <p className="years">{edu.years}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="list-group">
                                <h3>{t('academic_certs')}</h3>
                                {profileData.certifications.map(cert => (
                                    <div key={cert.id} className="list-item cert-item">
                                        <i className={cert.icon}></i>
                                        <p>{t(cert.name)} ({cert.issuer}, {cert.date})</p>
                                    </div>
                                ))}
                                <div className="awards-box">
                                    <i className="fas fa-trophy"></i>
                                    <h4>{t('academic_awards_title')}</h4>
                                    <p>{t('academic_awards_example')}</p>
                                </div>
                            </div>
                        </>
                    ), 'academic', 'academic-section')}
                    {renderSection('section_clinical', (
                        <div className="clinical-grid">
                            <div className="list-group full-width">
                                <h3>{t('clinical_rotations_title')}</h3>
                                {profileData.experience.map(exp => (
                                    <div key={exp.id} className="list-item experience-item">
                                        <h4>{t(exp.rotation)} ({t(exp.hospital)})</h4>
                                        <p>{t('clinical_duration')}: {exp.duration}</p>
                                        <p className="skills-summary">{t('clinical_skills')}: {t(exp.skills)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="list-group full-width">
                                <h3>{t('clinical_procedures_title')}</h3>
                                <div className="skills-stats">
                                    {profileData.procedureStats.map(stat => (
                                        <div key={stat.id} className="stat-item">
                                            <i className={stat.icon}></i>
                                            <span className="stat-number">{stat.count}</span>
                                            <span className="stat-label">{t(stat.labelKey)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ), 'clinical', 'clinical-section')}
                    {renderSection('section_research', (
                        <div className="list-group full-width">
                            {profileData.research.map(res => (
                                <a key={res.id} href={res.link} target="_blank" rel="noopener noreferrer" className="list-item research-item">
                                    <i className="fas fa-file-alt"></i>
                                    <div>
                                        <h4>{t(res.title)}</h4>
                                        <p className="research-type">{t('research_type')}: {t(res.type)}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ), 'research', 'research-section')}
                    {renderSection('section_skills', (
                        <div className="skills-group-grid">
                            <div className="skill-group">
                                <h3>{t('skills_soft_title')}</h3>
                                <ul className="skill-list">
                                    {profileData.skills.soft.map((skillKey, i) => <li key={i}><i className="fas fa-check-circle"></i>{t(skillKey)}</li>)}
                                </ul>
                            </div>
                            <div className="skill-group">
                                <h3>{t('skills_tech_title')}</h3>
                                <ul className="skill-list tech-list">
                                    {profileData.skills.tech.map((skillKey, i) => <li key={i}><i className="fas fa-laptop-medical"></i>{t(skillKey)}</li>)}
                                </ul>
                            </div>
                            <div className="skill-group full-width">
                                <h3>{t('skills_languages_title')}</h3>
                                <ul className="skill-list language-list">
                                    {profileData.skills.languages.map((langKey, i) => <li key={i}><i className="fas fa-comments"></i>{t(langKey)}</li>)}
                                </ul>
                            </div>
                            <div className="skill-group full-width">
                                <h3>{t('skills_projects_title')}</h3>
                                <p className="project-example">{t('skills_projects_example')}</p>
                            </div>
                        </div>
                    ), 'skills', 'skills-section')}
                </div>
            </div>
        </div>
    );
};

export default Profile;