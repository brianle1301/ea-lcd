import { Typography } from '@mui/joy';
import Particles from 'react-particles';
import { loadFull } from 'tsparticles';

import Body from '../components/Body';

const FullRepDone = function () {
    const initialiseParticles = function (engine) {
        loadFull(engine);
    };

    return (
        <Body>
            <Typography level="h1">Great! You did 2 sets!! Go again?</Typography>

            <Particles
                init={initialiseParticles}
                options={{
                    fullScreen: {
                        zIndex: 1,
                    },
                    emitters: {
                        position: {
                            x: 50,
                            y: 100,
                        },
                        rate: {
                            quantity: 5,
                            delay: 0.15,
                        },
                    },
                    particles: {
                        color: {
                            value: ['#1E00FF', '#FF0061', '#E1FF00', '#00FF9E'],
                        },
                        move: {
                            decay: 0.05,
                            direction: 'top',
                            enable: true,
                            gravity: {
                                enable: true,
                            },
                            outModes: {
                                top: 'none',
                                default: 'destroy',
                            },
                            speed: {
                                min: 50,
                                max: 100,
                            },
                        },
                        number: {
                            value: 0,
                        },
                        opacity: {
                            value: 1,
                        },
                        rotate: {
                            value: {
                                min: 0,
                                max: 360,
                            },
                            direction: 'random',
                            animation: {
                                enable: true,
                                speed: 30,
                            },
                        },
                        tilt: {
                            direction: 'random',
                            enable: true,
                            value: {
                                min: 0,
                                max: 360,
                            },
                            animation: {
                                enable: true,
                                speed: 30,
                            },
                        },
                        size: {
                            value: 3,
                            animation: {
                                enable: true,
                                startValue: 'min',
                                count: 1,
                                speed: 16,
                                sync: true,
                            },
                        },
                        roll: {
                            darken: {
                                enable: true,
                                value: 25,
                            },
                            enlighten: {
                                enable: true,
                                value: 25,
                            },
                            enable: true,
                            speed: {
                                min: 5,
                                max: 15,
                            },
                        },
                        wobble: {
                            distance: 30,
                            enable: true,
                            speed: {
                                min: -7,
                                max: 7,
                            },
                        },
                        shape: {
                            type: ['circle', 'square'],
                            options: {},
                        },
                    },
                }}
            />
        </Body>
    );
};

export default FullRepDone;
