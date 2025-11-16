import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "../pages/Home/Home"
import About from "../pages/About/About"
import Servises from "../pages/Servis/Services"
import TestPages from "../pages/TestPages/TestPages"
import Blog from "../pages/Blog/Blog"
import Timeline from "../pages/Timeline/Timeline"
import Contact from "../components/Contact/Contact"
import Portfolio from "../pages/Portfolio/Portfolio"
import PageLoader from '../components/PageLoader/PageLoader';

const AppRoutes = () => {
    const location = useLocation();
    const [isPageLoading, setIsPageLoading] = useState(false);

    useEffect(() => {
        setIsPageLoading(true);
        const loadTimer = setTimeout(() => {
            setIsPageLoading(false);
        }, 1000);

        return () => clearTimeout(loadTimer);

    }, [location.pathname]); 

    return (
        <div>
            <PageLoader isPageLoading={isPageLoading} />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/About" element={<About />} />
                <Route path="/services" element={<Servises />} />
                <Route path="/testimonial" element={<TestPages />} />
                <Route path="/Blog" element={<Blog />} />
                <Route path="/Timeline" element={<Timeline />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/portfolio" element={<Portfolio />} />
            </Routes>
        </div>
    )
}

export default AppRoutes;