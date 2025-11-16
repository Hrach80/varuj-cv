import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../../context/LanguageContext.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import { supabase } from '../../supabaseClient.js';
import PageLoader from '../../components/PageLoader/PageLoader';
import './Blog.css';

// ====================================================================
// ԲԱՂԱԴՐԻՉ 1: ԱՎԵԼԱՑՆԵԼ ՄԻՋՈՑԱՌՈՒՄ (ՏԵՍԱՆԵԼԻ ՄԻԱՅՆ ԱԴՄԻՆԻՆ)
// ====================================================================

const AddEventForm = ({ onAddEvent, t }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        participants: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedFiles.length === 0) {
            alert(t('error_no_images') || "Խնդրում ենք ընտրել առնվազն մեկ նկար։");
            return;
        }

        setIsLoading(true);

        try {
            const fileUrls = [];

            // 1. Նկարները բեռնել Supabase Storage-ում
            for (const file of selectedFiles) {
                const filePath = `event_images/${Date.now()}_${file.name.replace(/\s/g, '_')}`;

                const { error: uploadError } = await supabase.storage
                    .from('events_bucket')
                    .upload(filePath, file);

                if (uploadError) {
                    console.error("Storage upload error:", uploadError);
                    throw new Error(uploadError.message || "Ֆայլի բեռնման սխալ");
                }
                const { data: urlData } = supabase.storage
                    .from('events_bucket')
                    .getPublicUrl(filePath);

                if (urlData.publicUrl) {
                    fileUrls.push(urlData.publicUrl);
                }
            }
            const newEventPayload = {
                title: formData.title,
                description: formData.description,
                participants: formData.participants,
                image_urls: fileUrls,
            };

            const { data: insertData, error: insertError } = await supabase
                .from('events')
                .insert([newEventPayload])
                .select('*');

            if (insertError) {
                console.error("Supabase INSERT failed (RLS issue possible):", insertError);
                throw new Error(insertError.message || "Տվյալների բազայի սխալ։");
            }

            const newEvent = {
                ...insertData[0],
                images: insertData[0].image_urls
            };

            onAddEvent(newEvent);
            setFormData({ title: '', description: '', participants: '' });
            setSelectedFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = "";

            alert(t('event_add_success') || 'Միջոցառումը հաջողությամբ ավելացվեց։');

        } catch (error) {
            console.error("Error during event submission:", error);
            alert(t('event_add_fail') || `Միջոցառումն ավելացնելիս սխալ տեղի ունեցավ: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="add-event-form" onSubmit={handleSubmit}>
            <h2>{t('add_event_title') || 'Ավելացնել Նոր Միջոցառում'}</h2>
            <input type="text" name="title" placeholder={t('form_event_title') || "Միջոցառման Անվանումը"} value={formData.title} onChange={handleChange} required />
            <textarea name="description" placeholder={t('form_event_description') || "Համառոտ Նկարագրություն"} value={formData.description} onChange={handleChange} required />
            <input type="text" name="participants" placeholder={t('form_event_participants') || "Մասնակիցներ"} value={formData.participants} onChange={handleChange} required />
            <div className="file-input-group">
                <label>{t('form_select_images') || 'Ընտրել նկարներ (մինչև 5):'}</label>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    required
                />
                {selectedFiles.length > 0 && (
                    <p className="file-count">{t('files_selected') || 'Ընտրված է'} {selectedFiles.length} {t('files') || 'ֆայլ'}</p>
                )}
            </div>
            <button type="submit" disabled={isLoading || selectedFiles.length === 0}>
                {isLoading ? (t('form_sending') || 'Ուղարկվում է...') : (t('form_submit') || 'Ավելացնել Միջոցառումը')}
            </button>
        </form>
    );
};

// ====================================================================
// ԲԱՂԱԴՐԻՉ 2: ՍԼԱՅԴԵՐԸ
// ====================================================================

const ImageSlider = ({ images, interval = 4000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, interval);

        return () => clearInterval(timer);
    }, [images.length, interval]);

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };

    if (images.length === 0) return <div className="slide-image no-image">No Image</div>;

    return (
        <div className="slider-container">
            <div
                className="image-wrapper"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((imgUrl, index) => (
                    <div
                        key={index}
                        className="slide-image"
                        style={{ backgroundImage: `url(${imgUrl})` }}
                        aria-label={`Slide ${index + 1}`}
                    ></div>
                ))}
            </div>

            <div className="slider-dots">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    ></span>
                ))}
            </div>
        </div>
    );
};


// ====================================================================
// ԲԱՂԱԴՐԻՉ 3: ՄԻՋՈՑԱՌՄԱՆ ՔԱՐՏ
// ====================================================================

const EventCard = ({ event, isAdmin, onDelete, t, index, onViewDetails }) => {
    const animationDelay = `${0.2 * index}s`;

    const handleDeleteClick = () => {
        if (window.confirm(t('confirm_delete') || `Իսկապե՞ս ցանկանում եք ջնջել ${event.title} միջոցառումը։`)) {
            onDelete(event.id);
        }
    };

    const handleViewDetails = () => {
        onViewDetails(event);
    };

    return (
        <div className="event-card-wrapper" style={{ animationDelay: animationDelay }}>
            <div className="event-card">
                <div className="event-card-media">
                    <ImageSlider images={event.images} />
                </div>
                <div className="event-card-content">
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-description">{event.description}</p>
                    <div className="event-participants">
                        <h4>{t('form_event_participants') || 'Մասնակիցներ:'}</h4>
                        <p>{event.participants}</p>
                    </div>
                    <div className="card-action">
                        <button onClick={handleViewDetails} className="view-details-button">
                            {t('view_details') || 'Դիտել Ամբողջությամբ'}
                        </button>
                        {isAdmin && (
                            <button className="delete-button" onClick={handleDeleteClick}>
                                {t('delete_button') || 'Ջնջել'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ====================================================================
// ԲԱՂԱԴՐԻՉ 4: ՄԻՋՈՑԱՌՄԱՆ ԴԵՏԱԼՆԵՐԻ ՄՈԴԱԼ
// ====================================================================

const EventDetailsModal = ({ event, onClose, t }) => {
    if (!event) return null;

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-modal-button" onClick={onClose}>&times;</button>

                <div className="modal-media">
                    <ImageSlider images={event.images} interval={3000} />
                </div>

                <div className="modal-details">
                    <h2 className="modal-title">{event.title}</h2>
                    <p className="modal-description">{event.description}</p>

                    <div className="modal-participants">
                        <h4>{t('form_event_participants') || 'Մասնակիցներ:'}</h4>
                        <p>{event.participants}</p>
                    </div>

                    <div className="modal-date">
                        <h4>{t('event_date') || 'Ամսաթիվ:'}</h4>
                        <p>{new Date(event.created_at).toLocaleDateString('hy-AM', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


// ====================================================================
// ՀԻՄՆԱԿԱՆ ԷՋԸ (BLOG)
// ====================================================================

const Blog = () => {
    const { t } = useContext(LanguageContext);
    const { isAdmin } = useContext(AuthContext);

    const [events, setEvents] = useState([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const fetchEvents = useCallback(async () => {
        setIsLoadingEvents(true);

        const { data, error } = await supabase
            .from('events')
            .select('id, title, description, participants, image_urls, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase fetch error:", error);
            alert(t('fetch_error') || `Միջոցառումները բեռնելիս սխալ տեղի ունեցավ: ${error.message}`);
            setEvents([]);
        } else if (data) {
            const formattedData = data.map(event => ({
                ...event,
                images: event.image_urls || [],
            }));
            setEvents(formattedData);
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        setIsLoadingEvents(false);
    }, [t]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleAddEvent = (newEvent) => {
        setEvents(prevEvents => [newEvent, ...prevEvents]);
    };

    const handleDeleteEvent = async (idToDelete) => {
        try {
            const { data: eventData } = await supabase
                .from('events')
                .select('image_urls')
                .eq('id', idToDelete)
                .single();

            const { error: deleteError } = await supabase
                .from('events')
                .delete()
                .eq('id', idToDelete);

            if (deleteError) throw new Error(deleteError.message || "Տվյալների բազայից ջնջելու սխալ");
            if (eventData && eventData.image_urls && eventData.image_urls.length > 0) {
                const pathsToDelete = eventData.image_urls.map(url => {
                    const bucketName = 'events_bucket/';
                    const pathPart = url.substring(url.indexOf(bucketName) + bucketName.length);
                    return pathPart;
                });

                const { error: storageError } = await supabase.storage
                    .from('events_bucket')
                    .remove(pathsToDelete);

                if (storageError) console.warn("Storage cleanup failed:", storageError);
            }
            setEvents(prevEvents => prevEvents.filter(event => event.id !== idToDelete));
            alert(t('delete_success') || "Միջոցառումը հաջողությամբ ջնջվեց։");

        } catch (error) {
            console.error("Delete error:", error);
            alert(t('delete_fail') || `Ջնջելիս սխալ տեղի ունեցավ: ${error.message}`);
        }
    };
    const handleOpenDetails = (event) => {
        setSelectedEvent(event);
    };
    const handleCloseDetails = () => {
        setSelectedEvent(null);
    };

    return (
        <div className="blog-wrapper">
            <PageLoader isPageLoading={isLoadingEvents} />

            <div className="blog-container">
                <header className="events-header">
                    <img
                        src="/images/blog.png"
                        alt="Testimonial Icon"
                        className="test-icon"
                        style={{
                            borderRadius: '50%',
                            animation: 'spin 4s infinite linear'
                        }}
                    />
                    <h1>{t('events_page_title') || "Բժշկական Միջոցառումներ"}</h1>
                    <p>{t('events_page_subtitle') || "Մեր մասնակցությունը և կազմակերպած միջազգային համաժողովները"}</p>
                </header>

                {isAdmin && (
                    <div className="admin-section">
                        <AddEventForm onAddEvent={handleAddEvent} t={t} />
                    </div>
                )}

                <div className="events-grid">
                    {events.map((event, index) => (
                        <EventCard
                            key={event.id}
                            index={index}
                            event={event}
                            isAdmin={isAdmin}
                            onDelete={handleDeleteEvent}
                            onViewDetails={handleOpenDetails}
                            t={t}
                        />
                    ))}
                </div>

                <EventDetailsModal
                    event={selectedEvent}
                    onClose={handleCloseDetails}
                    t={t}
                />
            </div>
        </div>
    );
};

export default Blog;