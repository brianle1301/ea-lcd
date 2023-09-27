import React from 'react';
import { animated, useTransition } from '@react-spring/web';
import { Typography } from '@mui/joy';

import Body from '../components/Body';

const AnimatedTypography = animated(Typography);

const texts = ['Welcome, Athlete!', 'Please take a seat'];

const Welcome = function () {
    const [index, setIndex] = React.useState(0);

    const renderTextTransition = useTransition(index, {
        from: { y: -75, opacity: 0 },
        enter: { y: 0, opacity: 1 },
        leave: { y: 75, opacity: 0 },
        exitBeforeEnter: true,
        onRest: (_0, _1, i) => {
            if (i === 0) {
                setTimeout(() => {
                    setIndex(1);
                }, 1000);
            }
        },
    });

    return (
        <Body>
            {renderTextTransition((transition, i) => (
                <AnimatedTypography
                    level="h1"
                    style={{
                        transform: transition.y.to((value) => `translateY(${value}%)`),
                        opacity: transition.opacity,
                    }}
                >
                    {texts[i]}
                </AnimatedTypography>
            ))}
        </Body>
    );
};

export default Welcome;
