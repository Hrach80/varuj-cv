// src/components/Contact.jsx

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../../context/LanguageContext';
import '../Contact/Contact.css';

// ԻԿՈՆԿԱՆԵՐԻ ՆԵՐՄՈՒԾՈՒՄԸ REACT ICONS-ԻՑ
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaViber, FaWhatsapp } from 'react-icons/fa';

// Կոնտակտային տվյալներ
const contactData = {
    address: "ք. Երևան, Կորյուն 2",
    phone: "+37493395221",
    email: "vagharshakyanvarujan@gmail.com",
    viber: "viber://forward?text=Barev&phone=+37493395221", 
    whatsapp: "https://wa.me/37493395221", 
    mapLink: "https://www.google.com/maps/search/?api=1&query=Կորյուն+2,+Երևան,+Հայաստան",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1523.639700346083!2d44.5168233!3d40.187383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406abce54af00001%3A0xf69c5e317c8003f5!2zS29yeXVuIDIsIEVnYW4gS2FyeXVuLCDRgNCw0LfQsNC_0LDRgtCw0YbRiw!5e0!3m2!1sen!2sam!4v1678822479267!5m2!1sen!2sam"
};

const Contact = () => {
    const { t } = useContext(LanguageContext);

    return (
        <div className="contact-page">
            <div className="contact-hero">
                <div className="container">
                    <h1 className="contact-title">{t('contact_title')}</h1>
                    <p className="contact-subtitle">{t('contact_subtitle')}</p>
                </div>
            </div>

            <div className="contact-details-section">
                <div className="container contact-grid">
                    <div className="details-box">
                        <a
                            href={contactData.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="detail-item"
                        >
                            <FaMapMarkerAlt />
                            <div className="text-content">
                                <h3>{t('contact_address')}</h3>
                                <p>{contactData.address}</p>
                            </div>
                        </a>

                        <a href={`tel:${contactData.phone}`} className="detail-item">
                            <FaPhoneAlt />
                            <div className="text-content">
                                <h3>{t('contact_phone')}</h3>
                                <p>{contactData.phone}</p>
                            </div>
                        </a>
                        <a href={`mailto:${contactData.email}`} className="detail-item">
                            <FaEnvelope />
                            <div className="text-content">
                                <h3>{t('contact_email')}</h3>
                                <p>{contactData.email}</p>
                            </div>
                        </a>

                        <div className="messaging-links">
                            <a href={contactData.viber} target="_blank" rel="noopener noreferrer" className="messaging-btn viber-btn">
                                <FaViber /> {t('contact_viber')}
                            </a>
                            <a href={contactData.whatsapp} target="_blank" rel="noopener noreferrer" className="messaging-btn whatsapp-btn">
                                <FaWhatsapp /> {t('contact_whatsapp')}
                            </a>
                        </div>
                    </div>

                    <div className="map-box">
                        <iframe
                            title="Location Map"
                            src={contactData.mapEmbedUrl}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;