import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import supabase from '../../supabaseClient';
import '../Home/Home.css';


const HERO_IMAGE_BASE_URL = "https://wnkzxhtqqszojfnyjxdg.supabase.co/storage/v1/object/public/hero-images/doctor_image.jpg";

const ImageUploadButton = ({ t, onUploadSuccess }) => { 
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const BUCKET_NAME = 'hero-images';
    const FILE_PATH = 'doctor_image.jpg';

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert(t('error_not_image'));
            return;
        }

        setUploading(true);
        console.log(`Uploading file: ${file.name}`);

        try {
            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(FILE_PATH, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (error) {
                console.error('Upload Error:', error.message);
                alert(t('upload_error') + ': ' + error.message);
            } else {
                alert(t('upload_success'));
                onUploadSuccess();
            }
        } catch (e) {
            console.error('Unexpected error during upload:', e);
            alert(t('upload_error_unexpected'));
        } finally {
            setUploading(false);
            event.target.value = null;
        }
    };

    return (
        <>
            <button
                className="btn-image-upload"
                onClick={handleButtonClick}
                title={t('change_hero_image')}
                disabled={uploading}
            >
                {uploading ? t('loading_text') : t('change_image_button')}
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
        </>
    );
};

const calculateTimeLeft = () => {
    const difference = +new Date('2030-08-01') - +new Date();
    let timeLeft = {};

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    } else {
        timeLeft = { finished: true };
    }
    return timeLeft;
};

const Home = () => {
    const { t } = useContext(LanguageContext);
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [imageTimestamp, setImageTimestamp] = useState(Date.now());
    const { isAdmin, loading } = useAuth();

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });
    const handleImageUpdate = () => {
        setImageTimestamp(Date.now());
    };

    const timerComponents = [];
    Object.keys(timeLeft).forEach((interval) => {
        if (interval === 'finished') return;
        let labelKey = `countdown_${interval}`;

        timerComponents.push(
            <div className="countdown-item" key={interval}>
                <span className="countdown-number">{timeLeft[interval].toString().padStart(2, '0')}</span>
                <span className="countdown-label">{t(labelKey)}</span>
            </div>
        );
    });

    return (
        <div className="home-box">
            <section className="hero-section">
                <div className="container">

                    {/* 1. Նկարի Բաժին (order: 2 - Desktop | order: 1 - Mobile) */}
                    <div className="hero-image-container">
                        <div
                            className="doctor-placeholder"
                            style={{
                                backgroundImage: `url(${HERO_IMAGE_BASE_URL}?t=${imageTimestamp})`,
                            }}
                        >
                            {(!loading && isAdmin) && <ImageUploadButton t={t} onUploadSuccess={handleImageUpdate} />}
                        </div>
                    </div>

                    {/* 2. Հիմնական Բովանդակություն (order: 1 - Desktop | order: 3 - Mobile) */}
                    <div className="hero-content">
                        <h1 className="main-title">
                            {t('main_title_part1')} <span className="highlight">{t('main_title_highlight')}</span>
                        </h1>
                        <p className="description">
                            {t('description')}
                        </p>
                    </div>
                    <section className="results-section top-countdown">
                        <div className="results-container">
                            <div className="countdown-container">
                                {timerComponents.length ? (
                                    timerComponents
                                ) : (
                                    <div className="stat-number">
                                        <span className="highlight">{t('congratulations')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* 4. Կոճակներ (order: 4 - Desktop/Mobile) */}
                    <div className="action-buttons action-buttons-container">
                        <Link to="/portfolio" className="btn btn-primar">
                            {t('btn_portfolio')}
                        </Link>
                        <Link to="/contact" className="btn btn-secondary">
                            {t('btn_contact')}
                        </Link>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default Home;