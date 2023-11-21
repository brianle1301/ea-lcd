import React from 'react';
import { Outlet, RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom';
import { CssVarsProvider, CssBaseline, Box, Stack, Typography, Snackbar } from '@mui/joy';
import { Star, Chair } from '@phosphor-icons/react';

import HowItWorks from './screens/HowItWorks';
import SitDownExplanation from './screens/SitDownExplanation';
import TryItOut from './screens/TryItOut';
import StandUpExplanation from './screens/StandUpExplanation';
import Sleep from './screens/Sleep';
import BonusExplanation from './screens/BonusExplanation';
import WhatIsDoItTwice from './screens/WhatIsDoItTwice';
import DoItTwiceStand from './screens/DoItTwiceStand';
import DoItTwiceSit from './screens/DoItTwiceSit';
import FeetGreen from './screens/FeetGreen';
import HandGreen from './screens/HandGreen';
import Final from './screens/Final';

const screens = {};

const makeScreens = (name) => (screens[name] = name);

makeScreens('HOW_IT_WORKS');
makeScreens('SIT_DOWN_EXPLANATION');
makeScreens('TRY_IT_OUT');
makeScreens('SLEEPING');
makeScreens('STAND_UP_EXPLANATION');
makeScreens('BONUS_EXPLANATION');
makeScreens('WHAT_IS_DO_IT_TWICE');
makeScreens('DO_IT_TWICE_STAND');
makeScreens('DO_IT_TWICE_SIT');
makeScreens('FEET_GREEN');
makeScreens('HAND_GREEN');
makeScreens('FINAL');

const Root = function () {
    const [moveHistory, setMoveHistory] = React.useState([]);
    const [currentScreen, setCurrentScreeen] = React.useState(screens.HOW_IT_WORKS);
    const [initialMove, setInitialMove] = React.useState(null);
    const [event, setEvent] = React.useState({ type: null });
    const [reminderOpen, setReminderOpen] = React.useState(false);
    const ws = React.useRef(null);
    const reminderTimer = React.useRef(null);

    React.useEffect(() => {
        const connect = function () {
            const socket = new WebSocket('ws://localhost:9000');
            ws.current = socket;

            socket.onopen = () => {
                console.log('Connection opened');
                socket.send('INITIAL_STATE');
            };

            socket.onclose = () => {
                setTimeout(connect, 2000);
            };

            return () => {
                socket.close();
            };
        };

        return connect();
    }, []);

    React.useEffect(() => {
        if (!ws.current) {
            return;
        }

        ws.current.onmessage = (message) => {
            const event = JSON.parse(message.data);
            console.log(event);

            if (event.initialState) {
                if (!initialMove) {
                    setInitialMove(event.initialState);
                }

                return;
            }

            setEvent(event);

            setMoveHistory([...moveHistory, { movement: event.type, ts: Date.now() }]);
        };
    }, [moveHistory, initialMove]);

    // Calculate moves count

    const counts = { stands: 0, sits: 0, doubleStands: 0, doubleSits: 0 };
    let lastStand;
    let lastSit;

    for (let i = 0; i < moveHistory.length; i++) {
        const currentMove = moveHistory[i];

        if (currentMove.movement.toLowerCase().startsWith('stand up')) {
            if (lastStand) {
                if (currentMove.ts - lastStand.ts <= 15000) {
                    lastStand = null;
                    counts.doubleStands++;
                } else {
                    lastStand = currentMove;
                }
            } else {
                lastStand = currentMove;
            }

            counts.stands++;
            continue;
        }

        if (currentMove.movement.toLowerCase() === 'sit down') {
            if (lastSit) {
                if (currentMove.ts - lastSit.ts <= 15000) {
                    lastSit = null;
                    counts.doubleSits++;
                } else {
                    lastSit = currentMove;
                }
            } else {
                lastSit = currentMove;
            }

            counts.sits++;
            continue;
        }
    }

    // Calculate power rep count

    /*const powerRepCounts = { standUpFirst: 0, sitDownFirst: 0 };
    console.log(repHistory);

    if (repHistory.length > 1) {
        const powered = { standUpFirst: false, sitDownFirst: false };
        for (let i = 1; i < repHistory.length; i++) {
            const currentRep = repHistory[i];
            const prevRep = repHistory[i - 1];
            if (
                (currentRep.movements[0].startsWith('Stand Up') &&
                    prevRep.movements[0].startsWith('Stand Up')) ||
                currentRep.movements[0] === prevRep.movements[0]
            ) {
                const key =
                    currentRep.movements[0].startsWith('Stand Up') &&
                    prevRep.movements[0].startsWith('Stand Up')
                        ? 'standUpFirst'
                        : 'sitDownFirst';

                console.log(currentRep.ts - prevRep.ts);

                if (currentRep.ts - prevRep.ts <= 10 * 1000) {
                    if (!powered[key]) {
                        powerRepCounts[key]++;
                        powered[key] = true;
                    }
                } else if (powered[key]) {
                    powered[key] = false;
                }
            }
        }
    }*/

    React.useEffect(() => {
        console.log(moveHistory);
    }, [moveHistory]);

    return (
        <Stack height="100dvh">
            <Stack spacing={1}>
                <Stack direction="row" spacing={1}>
                    <Square type="Left Arm" event={event} />
                    <Square type="Right Arm" event={event} />
                </Stack>
                <Stack direction="row" spacing={1}>
                    <Square type="Left Leg" event={event} />
                    <Square type="Right Leg" event={event} />
                </Stack>
                <Stack direction="row" spacing={4}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography level="h1">
                            <Box
                                component="img"
                                mx={2}
                                height={40}
                                src="/assets/StandIcon_black.png"
                            />{' '}
                            {counts.stands}
                        </Typography>
                        <Typography level="h1">
                            <Box
                                component="img"
                                mr={1}
                                ml={2}
                                height={40}
                                src="/assets/StandIcon_black.png"
                            />
                            <Box
                                component="img"
                                ml={1}
                                mr={2}
                                height={40}
                                src="/assets/StandIcon_black.png"
                            />
                            {counts.stands}
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography level="h1">
                            <Box
                                component="img"
                                mx={2}
                                height={40}
                                src="/assets/SitIcon_black.png"
                            />{' '}
                            {counts.sits}
                        </Typography>
                        <Typography level="h1">
                            <Box
                                component="img"
                                mr={1}
                                ml={2}
                                height={40}
                                src="/assets/SitIcon_black.png"
                            />
                            <Box
                                component="img"
                                ml={1}
                                mr={2}
                                height={40}
                                src="/assets/SitIcon_black.png"
                            />
                            {counts.doubleSits}
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                color="primary"
                variant="solid"
                open={reminderOpen}
                size="lg"
            >
                It's been a while since you last do a rep, wanna do one now?
            </Snackbar>
            <Stack alignItems="center" justifyContent="center" flex={1}>
                <HowItWorks />
                <SitDownExplanation />
                <TryItOut />
                <StandUpExplanation />
                <Sleep />
                <BonusExplanation />
                <WhatIsDoItTwice />
                <DoItTwiceStand />
                <DoItTwiceSit />
                <FeetGreen />
                <HandGreen />
                <Final />
            </Stack>
        </Stack>
    );
};

const Square = function ({ type, event }) {
    const [on, setOn] = React.useState(event.type === type);
    const timeout = React.useRef(null);

    React.useEffect(() => {
        const isOn = event.type === type;

        if (isOn) {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }

            setOn(true);

            timeout.current = setTimeout(() => {
                setOn(false);
            }, 1000);
        }
    }, [event]);

    React.useEffect(() => {
        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
        };
    }, []);

    return <Box flex={1} height={60} bgcolor={on ? 'success.solidBg' : 'neutral.solidBg'}></Box>;
};

const App = function () {
    return (
        <CssVarsProvider defaultMode="light">
            <CssBaseline />
            <Root />
        </CssVarsProvider>
    );
};

export default App;
