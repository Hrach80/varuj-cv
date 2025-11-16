import React, { useContext, useState, useEffect, useCallback } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import { AuthContext } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import './Testimonial.css';

/**
  @param {string} dateString 
  @param {object} translations 
  @returns {string|null} 
 */
const formatDateByLang = (dateString, langCode, translations) => {
    if (!dateString || !translations) return null;

    const upperLangCode = langCode.toUpperCase();

    try {
        const dateObj = new Date(dateString);
        if (upperLangCode === 'AM') {
            const day = dateObj.getDate();
            const monthIndex = dateObj.getMonth();
            const year = dateObj.getFullYear();
            const monthKey = `month_${monthIndex}`;
            const armenianMonth = translations[monthKey] || 'ամիս';
            return `${day} ${armenianMonth} ${year} թ.`;
        }
        let locale;
        switch (upperLangCode) {
            case 'EN':
                locale = 'en-US';
                break;
            case 'RU':
                locale = 'ru-RU';
                break;
            default:
                locale = 'en-US'; 
                break;
        }

        const dateOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        return dateObj.toLocaleDateString(locale, dateOptions);

    } catch (e) {
        console.error("Invalid date format, locale, or processing error:", dateString, langCode, e);
        return new Date(dateString).toISOString().split('T')[0];
    }
};


// ---------------------- Modal Բաղադրիչը ----------------------
const Modal = ({ author, fullText, onClose, role, t, date, langCode, translations }) => {
    if (!author) return null;
    const formattedDate = formatDateByLang(date, langCode, translations);

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>
                    {t('testimonial_close') || 'Փակել'} &times;
                </button>
                <h3>{author}</h3>
                <p className="modal-role">{role}</p>
                <div className="modal-text">
                    <p>{fullText}</p>
                </div>
                {formattedDate && (
                    <p className="modal-date-display">
                        {t('posted_on') || 'Գրված է'}: **{formattedDate}**
                    </p>
                )}

            </div>
        </div>
    );
};


// ---------------------- Ջնջելու Կոճակի Բաղադրիչը ----------------------
const DeleteButton = ({ id, onDelete, isAdmin }) => {
    if (!isAdmin || !id) return null;

    const handleDelete = () => {
        if (window.confirm("Համոզվա՞ծ եք, որ ուզում եք ջնջել այս կարծիքը։")) {
            onDelete(id);
        }
    };

    return (
        <button
            className="delete-button"
            onClick={handleDelete}
            title="Ջնջել կարծիքը"
            style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: '#d32f2f',
                color: 'white',
                border: 'none',
                padding: '5px 8px',
                cursor: 'pointer',
                borderRadius: '5px',
                zIndex: 10,
                fontSize: '0.9em',
                fontWeight: 'bold'
            }}
        >
            Ջնջել &times;
        </button>
    );
};


// ---------------------- Քարտի Բաղադրիչը ----------------------
const TestimonialCard = ({ summary, author, role, onReadMore, index, date, langCode, translations }) => { 
    const { t } = useContext(LanguageContext);
    const animationDelay = `${0.2 * index}s`;

    const displaySummary =
        (summary && typeof summary === 'string' && summary.trim().length > 0)
            ? `"${summary}..."`
            : t('testimonial_default_text') || "Կարծիքը բացակայում է";

    const formattedDate = formatDateByLang(date, langCode, translations);

    return (
        <div className="testimonial-card" style={{ animationDelay: animationDelay }}>
            <p className="quote-icon">❝</p>
            <p className="testimonial-summary">{displaySummary}</p>
            <div className="author-info">
                <h4>{author}</h4>
                <p className="author-role">{role}</p>
                {formattedDate && (
                    <p className="testimonial-date">
                        {t('posted_on') || 'Գրված է'}: {formattedDate}
                    </p>
                )}
            </div>

            {onReadMore && (
                <button className="read-more-button" onClick={onReadMore}>
                    {t('testimonial_read_more') || 'Կարդալ Ավելին'}
                </button>
            )}
        </div>
    );
};


// ---------------------- ՆՈՐ ԿԱՐԾԻՔԻ ՁԵՎԸ (Supabase) ----------------------
const TestimonialForm = ({ t, onSuccess }) => {
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        const formData = new FormData(e.target);
        const fullText = formData.get('fullText_am');
        const newTestimonial = {
            author: formData.get('author'),
            role_am: formData.get('role'),
            fullText_am: fullText,
            summary_am: fullText.substring(0, 100).trim(),
            is_new: true,
        };

        try {
            const { data, error } = await supabase
                .from('testimonials')
                .insert([newTestimonial])
                .select('*'); 

            if (error) {
                console.error("Supabase Error:", error);
                setStatus('error');
            } else {
                setStatus('success');
                e.target.reset();
                onSuccess(data[0]);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            setStatus('error');
        }
    };

    return (
        <section className="testimonial-form-section">
            <h2 className="form-title">{t('form_title') || 'Թողեք Ձեր Կարծիքը'}</h2>

            <form onSubmit={handleSubmit} className="testimonial-form">

                <input type="text" name="author" placeholder={t('form_name') || 'Անուն, Ազգանուն'} required />
                <input type="text" name="role" placeholder={t('form_role') || 'Պաշտոն/Դիրք'} required />
                <textarea name="fullText_am" placeholder={t('form_text') || 'Ձեր կարծիքի ամբողջական տեքստը'} rows="6" required></textarea>

                <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
                    {status === 'loading' ? (t('form_sending') || 'Ուղարկվում է...') : (t('form_submit') || 'Ուղարկել Կարծիքը')}
                </button>
            </form>

            {status === 'success' && <p className="form-message success-message">✅ {t('form_success') || 'Շնորհակալություն, Ձեր կարծիքն ուղարկված է։'}</p>}
            {status === 'error' && <p className="form-message error-message">❌ {t('form_error') || 'Ուղարկելիս սխալ տեղի ունեցավ։'}</p>}
        </section>
    );
};


// ---------------------- ՀԻՄՆԱԿԱՆ ԷՋԸ  ----------------------
const Testimonial = () => {
    const { t, currentLang, translations } = useContext(LanguageContext); 
    const { isAdmin } = useContext(AuthContext);

    const [openModal, setOpenModal] = useState(null);
    const [fetchedTestimonials, setFetchedTestimonials] = useState([]);
    const activeLang = (currentLang || 'AM').toUpperCase();
    const currentTranslations = translations?.[activeLang] || {};


    // ---------------------- ԱԴՄԻՆԻ ՖՈՒՆԿՑԻՈՆԱԼՈՒԹՅՈՒՆ ----------------------

    const deleteTestimonial = async (id) => {
        const { error } = await supabase
            .from('testimonials')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Delete Error:", error);
            alert(`Չհաջողվեց ջնջել կարծիքը: Սխալ: ${error.message}`);
            return false;
        }
        return true;
    };

    const handleTestimonialDelete = async (id) => {
        const success = await deleteTestimonial(id);
        if (success) {
            setFetchedTestimonials(prev => prev.filter(test => test.id !== id));
            alert("Կարծիքը ջնջվեց։");
        }
    };

    // ---------------------- ՏՎՅԱԼՆԵՐԻ ԲԵՌՆՈՒՄ (ՓՈՓՈԽՎԱԾ) ----------------------

    const fetchTestimonials = useCallback(async () => {
        const { data, error } = await supabase
            .from('testimonials')
            .select('*, created_at')
            .eq('is_new', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching testimonials:", error);
            return;
        }

        const formattedData = data.map(item => ({
            id: item.id,
            author: item.author,
            created_at: item.created_at, 
            role: { 'AM': item.role_am || item.role, 'EN': item.role_en, 'RU': item.role_ru },
            summary: { 'AM': item.summary_am || (item.fullText_am ? item.fullText_am.substring(0, 100) : ''), 'EN': item.summary_en, 'RU': item.summary_ru },
            fullText: { 'AM': item.fullText_am, 'EN': item.fullText_en, 'RU': item.fullText_ru },
            is_new: item.is_new,
        }));

        setFetchedTestimonials(formattedData);
    }, []);

    useEffect(() => {
        fetchTestimonials();
    }, [fetchTestimonials]);

    const handleNewTestimonial = (newTestimonial) => {
        const formattedNew = {
            id: newTestimonial.id,
            author: newTestimonial.author,
            created_at: newTestimonial.created_at, 
            role: { 'AM': newTestimonial.role_am },
            summary: { 'AM': newTestimonial.summary_am },
            fullText: { 'AM': newTestimonial.fullText_am },
            is_new: true,
        };
        setFetchedTestimonials(prev => [formattedNew, ...prev]);
    };


    const allTestimonials = fetchedTestimonials;

    const handleReadMore = (testimonialData) => {
        setOpenModal(testimonialData);
    };

    const handleCloseModal = () => {
        setOpenModal(null);
    };

    const showNoTestimonialsMessage = allTestimonials.length === 0;

    return (
        <div className="testimonial-container">

            <header className="testimonial-header">
                <img
                    src="/images/nwes.png"
                    alt="Testimonial Icon"
                    className="test-icon"
                    style={{
                    
                        borderRadius: '50%',
                        marginBottom: '10px',
                        animation: 'spin 4s infinite linear'
                    }}
                />
                <h1> {t('testimonial_title') || "Մեր Հաճախորդների Կարծիքները"}</h1>
                <p>{t('testimonial_subtitle') || "Ինչ են ասում մեզնի մասին"}</p>
            </header>

            {showNoTestimonialsMessage ? (
                <p className="no-testimonials-message">
                    {t('no_testimonials_message') || "Կարծիքներ դեռ չկան։ Եղե՛ք առաջինը։"}
                </p>
            ) : (
                <div className="card-grid">
                    {allTestimonials.map((test, index) => {
                        const fullTextInCurrentLang = test.fullText?.[activeLang];
                        const fallbackFullText = test.fullText?.AM;
                        const finalFullText = fullTextInCurrentLang || fallbackFullText;
                        const shouldShowReadMore = finalFullText && finalFullText.trim().length > 0;

                        // Սահմանում ենք ֆունկցիան, որը կբացի մոդալը
                        const handleOpenModal = shouldShowReadMore ? () => handleReadMore({
                            author: test.author,
                            role: test.role?.[activeLang] || '',
                            fullText: finalFullText,
                            date: test.created_at // <--- ՓՈԽԱՆՑՈՒՄ ԵՆՔ ԱՄՍԱԹԻՎԸ
                        }) : null;

                        return (
                            <div key={test.id || `new-${index}`} style={{ position: 'relative' }}>
                                <TestimonialCard
                                    index={index}
                                    // Summary-ն ցուցադրել ընթացիկ լեզվով (կամ կտրած հայերենը)
                                    summary={test.summary?.[activeLang] || test.fullText?.AM?.substring(0, 100)}
                                    author={test.author}
                                    role={test.role?.[activeLang] || ''}
                                    date={test.created_at} // <--- ՓՈԽԱՆՑՈՒՄ ԵՆՔ ԱՄՍԱԹԻՎԸ ՔԱՐՏԻՆ
                                    onReadMore={handleOpenModal}
                                    langCode={currentLang} // <--- ՓՈԽԱՆՑՈՒՄ ԵՆՔ ԼԵԶՈՒՆ
                                    translations={currentTranslations} // <--- ՓՈԽԱՆՑՈՒՄ ԵՆՔ ԹԱՐԳՄԱՆՈՒԹՅՈՒՆՆԵՐԸ
                                />

                                {/* Ջնջելու կոճակը */}
                                {(test.id && isAdmin) && (
                                    <DeleteButton
                                        id={test.id}
                                        onDelete={handleTestimonialDelete}
                                        isAdmin={isAdmin}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <TestimonialForm t={t} onSuccess={handleNewTestimonial} />

            {/* ՄՈԴԱԼԸ. Կախված է openModal state-ից */}
            {openModal && openModal.fullText && (
                <Modal
                    author={openModal.author}
                    role={openModal.role}
                    fullText={openModal.fullText}
                    date={openModal.date} // <--- ՓՈԽԱՆՑՈՒՄ ԵՆՔ ԱՄՍԱԹԻՎԸ ՄՈԴԱԼԻՆ
                    onClose={handleCloseModal}
                    t={t}
                    langCode={currentLang} // <--- ՓՈԽԱՆՑՈՒՄ ԵՆՔ ԼԵԶՈՒՆ
                    translations={currentTranslations} // <--- ՓՈԽԱՆՑՈՒՄ ԵՆՔ ԹԱՐԳՄԱՆՈՒԹՅՈՒՆՆԵՐԸ
                />
            )}
        </div>
    );
};

export default Testimonial;