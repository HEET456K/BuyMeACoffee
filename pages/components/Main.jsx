import React from 'react';
import { useTypewriter, Cursor } from 'react-simple-typewriter';

const Main = () => {
    const [text] = useTypewriter({
        words: ["Coffee", "ETH"],
        loop: true,
    });

    return (
        <div className="main">
            <h1 className="wanted-text">
                <span>{text}</span>
                <Cursor cursorStyle='<' cursorBlinking={0} />
            </h1>
            <p className="inner-text">Your Decentralized Coffee Shop</p>
        </div>
    );
};

export default Main;
