import React from 'react';
import { Outlet, RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom';
import { CssVarsProvider, CssBaseline, Box, Stack, Typography, Snackbar } from '@mui/joy';
import { Star, Chair } from '@phosphor-icons/react';

import Welcome from './screens/Welcome';
import FirstSitting from './screens/FirstSitting';
import StandAnimation from './screens/StandAnimation';
import SitAnimation from './screens/SitAnimation';
import HaveARest from './screens/HaveARest';
import SubsequentSets from './screens/SubsequentSets';
import PartialRepDone from './screens/PartialRepDone';
import FullRepDone from './screens/FullRepDone';

const Root = function () {
    const [trailingMove, setTrailingMove] = React.useState();
    const [leadingMove, setLeadingMove] = React.useState();
    const [repHistory, setRepHistory] = React.useState([]);
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
                if (!trailingMove) {
                    setTrailingMove(event.initialState);
                }

                return;
            }

            setEvent(event);

            if (!leadingMove) {
                if (
                    (event.type.startsWith('Stand Up') || event.type === 'Sitted') &&
                    event.type !== trailingMove
                ) {
                    setLeadingMove(event.type);
                    setReminderOpen(false);
                    clearTimeout(reminderTimer.current);
                }

                return;
            }

            if (
                (leadingMove.startsWith('Stand Up') && event.type === 'Sitted') ||
                (leadingMove === 'Sitted' && event.type.startsWith('Stand Up'))
            ) {
                setLeadingMove(null);
                setTrailingMove(event.type);
                setRepHistory([
                    ...repHistory,
                    { movements: [leadingMove, event.type], ts: Date.now() },
                ]);

                reminderTimer.current = setTimeout(() => {
                    setReminderOpen(true);
                }, 20000);
            }
        };
    }, [trailingMove, leadingMove, repHistory]);

    const standFirstReps = repHistory.filter((rep) =>
        rep.movements[0].startsWith('Stand Up')
    ).length;

    // Calculate power rep count

    const powerRepCounts = { standUpFirst: 0, sitDownFirst: 0 };
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
    }

    React.useEffect(() => {
        console.log(repHistory);
    }, [repHistory]);

    return (
        <React.Fragment>
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
                        <Star size={40} />
                        <Typography level="h1">
                            {powerRepCounts.standUpFirst + powerRepCounts.sitDownFirst} (Stand Up
                            first: {powerRepCounts.standUpFirst}, Sit Down first:{' '}
                            {powerRepCounts.sitDownFirst})
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Chair size={40} />
                        <Typography level="h1">
                            {repHistory.length} (Stand Up first: {standFirstReps}, Sit down first:{' '}
                            {repHistory.length - standFirstReps})
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
            <Outlet />
        </React.Fragment>
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

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '/welcome',
                element: <Welcome />,
            },
            {
                path: '/first-sitting',
                element: <FirstSitting />,
            },
            {
                path: '/stand-anim',
                element: <StandAnimation />,
            },
            {
                path: '/sit-anim',
                element: <SitAnimation />,
            },
            {
                path: '/have-a-rest',
                element: <HaveARest />,
            },
            {
                path: '/subsequent-sets',
                element: <SubsequentSets />,
            },
            {
                path: '/partial-rep-done',
                element: <PartialRepDone />,
            },
            {
                path: '/full-rep-done',
                element: <FullRepDone />,
            },
        ],
    },
]);

const App = function () {
    return (
        <CssVarsProvider defaultMode="system">
            <CssBaseline />
            <RouterProvider router={router} />
        </CssVarsProvider>
    );
};

export default App;
