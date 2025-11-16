import React, { useContext, useState, useEffect } from 'react';
import { LanguageContext } from '../../context/LanguageContext.jsx';
import '../Servis/Servis.css';

const NEWS_API_KEY = 'YOUR_NEWSDATA_IO_KEY'; 
const NEWS_URL = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&category=health&language=en&country=us,gb,ca`; 


// ---------------------- ՆՈՐՈՒԹՅՈՒՆՆԵՐԻ ՔԱՐՏԻ ԲԱՂԱԴՐԻՉԸ ----------------------
const NewsCard = ({ title, description, imageURL, link, delay }) => {
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="news-card fade-up"
            style={{ animationDelay: delay }}
        >

            {imageURL && (
                <div className="news-image-wrapper">
                    <img src={imageURL} alt={title} className="news-image" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
            )}

            <div className="news-content">
                <h3 className="card-title">{title}</h3>
                {description && <p className="card-description">{description.substring(0, 150)}...</p>}
                <span className="read-more">Կարդալ Ավելին →</span>
            </div>
        </a>
    );
};


// ---------------------- ՀԻՄՆԱԿԱՆ ԷՋԸ (ՆՈՐՈՒԹՅՈՒՆՆԵՐԻ ԲԵՌՆՈՒՄ) ----------------------
const Services = () => {
    const { t, currentLanguageCode } = useContext(LanguageContext);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            setError(null);

            const FUNCTION_URL = 'https://wnkzxhtqqszojfnyjxdg.supabase.co/functions/v1/fetch_medical_news';
            let newsLanguageCode = 'en';

            if (currentLanguageCode === 'hy' || t('current_lang') === 'hy') {
                newsLanguageCode = 'am';
            } else if (currentLanguageCode) {
                newsLanguageCode = currentLanguageCode;
            }

            try {
                const response = await fetch(FUNCTION_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indua3p4aHRxcXN6b2pmbnlqeGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDgyMjgsImV4cCI6MjA3ODA4NDIyOH0.-wMG0kO1hJC_Voc4ItfgTTld52nNWz70NiuZdbdLm_E',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ language: newsLanguageCode }),
                });

                if (!response.ok) {
                    throw new Error(`Edge Function Error: ${response.status}`);
                }

                const data = await response.json();
                if (Array.isArray(data.results)) {
                    const validNews = data.results.filter(item => item.title && item.link);
                    setNews(validNews);
                } else if (data.error) {
                    setError(data.error);
                    setNews([]);
                } else {
                    setError(`Նորություններ չեն գտնվել NewsData.io-ից (${newsLanguageCode}):`);
                    setNews([]);
                }

            } catch (err) {
                console.error("News Fetch Error:", err);
                setError(`Նորություններ բեռնելիս սխալ: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [t, currentLanguageCode]);

    // ------------------ ՑՈՒՑԱԴՐՄԱՆ ԼՈԳԻԿԱ ------------------

    let cardCount = 0; 

    return (
        <div className="services-container news-feed-container">
            <header className="services-header">

                <img
                    src="/images/news.png"
                    alt="News Icon"
                    className="header-icon"
                />

                <h1 className="fade-in">{t('news_feed_title') || 'Բժշկական Նորություններ'}</h1>
                <p className="fade-in delay-1">{t('news_feed_subtitle') || 'Վերջին թարմացումները գլոբալ առողջապահական ոլորտից'}</p>
            </header>

            {loading && <div className="loading-state">Բեռնվում է...</div>}
            {error && <div className="error-state">{error}</div>}

            {!loading && !error && news.length > 0 && (
                <div className="news-card-grid">
                    {news.map((item, index) => {
                        const animationDelay = `${0.1 * cardCount}s`;
                        cardCount++;
                        return (
                            <NewsCard
                                key={index}
                                title={item.title}
                                description={item.description}
                                link={item.link}
                                imageURL={item.image_url}
                                delay={animationDelay}
                            />
                        );
                    })}
                </div>
            )}

            {!loading && !error && news.length === 0 && (
                <div className="no-data-state">Նորություններ չեն գտնվել այս պահին։</div>
            )}

        </div>
    );
};

export default Services;