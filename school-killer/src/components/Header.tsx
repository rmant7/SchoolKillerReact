import React, { useEffect, useState } from 'react'; //
//
const Header: React.FC = () => {
    const [visible, setVisible] = useState(true);

    const handleScroll = () => {
        if (window.scrollY > 50) {
            setVisible(false);
        } else {
            setVisible(true);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <h1 style={{ transition: 'opacity 0.5s', opacity: visible ? 1 : 0 }}>
            School Killer
        </h1>
    );
};

export default Header;