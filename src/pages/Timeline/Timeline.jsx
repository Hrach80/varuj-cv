import React, { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext.jsx';
import './Timeline.css';
import { FaGraduationCap, FaBriefcase, FaLaptopCode, FaHeartbeat } from 'react-icons/fa';

const getCategoryIcon = (category) => {
    switch (category) {
        case 'education':
            return <FaGraduationCap className="timeline-icon education-icon" />;
        case 'clinical':
            return <FaHeartbeat className="timeline-icon clinical-icon" />;
        case 'professional':
            return <FaBriefcase className="timeline-icon professional-icon" />;
        case 'project':
            return <FaLaptopCode className="timeline-icon project-icon" />;
        default:
            return <div className="timeline-dot" />;
    }
};

// ---------------------- Ժամանակագրության Կետի Բաղադրիչը ----------------------
const TimelineItem = ({ year, title, description, isLeft, index, category, images }) => {
    const alignmentClass = isLeft ? 'left' : 'right';
    const Icon = getCategoryIcon(category);
    const animationDelay = `${0.1 + 0.2 * index}s`;

    return (
        <div
            className={`timeline-item ${alignmentClass}`}
            style={{ animationDelay: animationDelay }}
        >
            <div className="timeline-pin">{Icon}</div>

            <div className="timeline-content">
                <span className="timeline-year">{year}</span>
                <h3>{title}</h3>
                {images && (
                    <div className="timeline-image-container">
                        <img src={images} alt={`${title} image`} className="timeline-image" />
                    </div>
                )}

                <p>{description}</p>
            </div>
        </div>
    );
};

// ---------------------- ՀԻՄՆԱԿԱՆ ԷՋԸ ----------------------
const Timeline = () => {
    const { t } = useContext(LanguageContext);
    const timelineData = [
        {
            yearKey: 'tl_1_year',
            imagesKey: "https://воронеж-многонациональный.рф/upload/resize_cache/iblock/f2c/960_540_2/3mp7m4vvt2dfbuzj5o6uqmcxefdtkz1g.jpg",
            titleKey: 'tl_1_title',
            descKey: 'tl_1_desc',
            category: 'education'
        },
        {
            yearKey: 'tl_2_year',
            imagesKey: 'https://www.1tv.am/images/news/6/27058/29571016_632398397100992_7311567124856400796_n_2.jpeg',
            titleKey: 'tl_2_title',
            descKey: 'tl_2_desc',
            category: 'clinical'
        },
        {
            yearKey: 'tl_3_year',
            imagesKey: 'https://i.ytimg.com/vi/fMhPVGQwvFo/maxresdefault.jpg',
            titleKey: 'tl_3_title',
            descKey: 'tl_3_desc',
            category: 'clinical'
        },


        {
            yearKey: 'tl_4_year',
            imagesKey: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Haematology_center_after_professor_R.Yeolyan.jpg', 
            titleKey: 'tl_4_title',
            descKey: 'tl_4_desc',
            category: 'clinical'
        },

    ];

    return (
        <div className="timeline-wrapper">
            <div className="timeline-container">
                <header className="timeline-header">
                    <img
                        src="/images/time.png"
                        alt="Testimonial Icon"
                        className="time-icon"
                        style={{
                            borderRadius: '50%',
                            animation: 'spin 4s infinite linear'
                        }}
                    />
                    <h1>{t('timeline_title')}</h1>
                    <p>{t('timeline_subtitle')}</p>
                </header>

                <div className="timeline">
                    {timelineData.map((item, index) => (
                        <TimelineItem
                            key={index}
                            index={index}
                            images={item.imagesKey}
                            year={t(item.yearKey)}
                            title={t(item.titleKey)}
                            description={t(item.descKey)}
                            category={item.category}
                            isLeft={index % 2 === 0}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Timeline;