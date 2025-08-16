"use client";
import React, { useState, useEffect } from 'react';

export default function InteractiveHeroSection() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [hueRotation, setHueRotation] = useState(0);
    const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

    // Track mouse movement and container size
    useEffect(() => {
        const handleMouseMove = (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setMousePosition({ x, y });
        };

        const handleResize = () => {
            const heroSection = document.querySelector('.hero-section');
            if (heroSection) {
                const rect = heroSection.getBoundingClientRect();
                setContainerSize({ width: rect.width, height: rect.height });
            }
        };

        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.addEventListener('mousemove', handleMouseMove);
            
            // Initial size calculation
            const rect = heroSection.getBoundingClientRect();
            setContainerSize({ width: rect.width, height: rect.height });
        }

        window.addEventListener('resize', handleResize);
        
        return () => {
            if (heroSection) {
                heroSection.removeEventListener('mousemove', handleMouseMove);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Animate hue rotation
    useEffect(() => {
        const interval = setInterval(() => {
            setHueRotation(prev => (prev + 1) % 360);
        }, 50); // Change every 50ms for smooth animation

        return () => clearInterval(interval);
    }, []);

    // Calculate responsive movement based on mouse position for hand-phone
    const calculateHandTransform = () => {
        const centerX = containerSize.width / 2;
        const centerY = containerSize.height / 2;
        const moveX = (mousePosition.x - centerX) / 40; // Divide by larger number for subtle movement
        const moveY = (mousePosition.y - centerY) / 40;
        
        // Responsive offset based on screen size
        const offsetX = containerSize.width * 0.18; // 18% of container width
        const offsetY = containerSize.height * 0.16; // 16% of container height
        
        return `translate(${moveX + offsetX}px, ${moveY + offsetY}px)`;
    };

    // Calculate responsive movement based on mouse position for flash
    const calculateFlashTransform = () => {
        const centerX = containerSize.width / 2;
        const centerY = containerSize.height / 2;
        const moveX = (mousePosition.x - centerX) / 40; // Divide by larger number for subtle movement
        const moveY = (mousePosition.y - centerY) / 40;
        
        // Responsive offset based on screen size
        const offsetX = containerSize.width * 0.04; // 4% of container width
        const offsetY = containerSize.height * 0.13; // 13% of container height
        
        return `translate(${moveX + offsetX}px, ${moveY + offsetY}px)`;
    };

    return (
        <div
            className="hero-section"
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
            }}
        >
            {/* 1. Hero Banner Background - Bottom Layer (z-index: 1) */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "url(/images/hero-banner.avif)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    filter: `hue-rotate(${hueRotation}deg)`,
                    transition: "filter 0.05s linear",
                    zIndex: 1,
                }}
            />

            {/* 2. Grain Hardlight Texture - Second Layer (z-index: 2) */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "url(/images/grain-hardlight.avif)",
                    backgroundSize: "cover",
                    backgroundPosition: "0 0",
                    mixBlendMode: "hard-light",
                    zIndex: 2,
                    pointerEvents: "none",
                }}
            />

            {/* 3. Hand Phone - Third Layer (z-index: 3) */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "url(/images/hand-phone.avif)",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    transform: calculateHandTransform(),
                    transition: "transform 0.1s ease-out",
                    zIndex: 3,
                    pointerEvents: "none",
                }}
            />

            {/* 4. Flash - Top Layer (z-index: 4) */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "url(/images/flash.avif)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    mixBlendMode: "screen",
                    transform: calculateFlashTransform(),
                    transition: "transform 0.1s ease-out",
                    zIndex: 4,
                    pointerEvents: "none",
                }}
            />
        </div>
    );
}