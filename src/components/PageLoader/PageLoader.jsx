
import React, { useState, useEffect } from 'react';
import Loader from '../Loader/Loader'; 

const PageLoader = ({ isPageLoading }) => {
    const [showLoader, setShowLoader] = useState(isPageLoading);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        if (isPageLoading) {
            setShowLoader(true);
            setFadeOut(false);
        } else {
            setFadeOut(true);
            const timer = setTimeout(() => {
                setShowLoader(false); 
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [isPageLoading]);

    if (!showLoader) {
        return null;
    }
    return <Loader isExternalFadeOut={fadeOut} />;
};

export default PageLoader;