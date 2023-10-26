import React from 'react';
import { Outlet, RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom';
import { CssVarsProvider, CssBaseline, Box, Stack, Typography } from '@mui/joy';
import { Star, Chair } from '@phosphor-icons/react';

import Welcome from './screens/Welcome';
import FirstSitting from './screens/FirstSitting';
import StandAnimation from './screens/StandAnimation';
import SitAnimation from './screens/SitAnimation';
import HaveARest from './screens/HaveARest';
import SubsequentSets from './screens/SubsequentSets';
import PartialRepDone from './screens/PartialRepDone';
import FullRepDone from './screens/FullRepDone';

const INITIAL_STATES = {
    SITTED: 0,
    STOOD_UP: 1,
};

const Root = function () {
    const [trailingMove, setTrailingMove] = React.useState();
    const [leadingMove, setLeadingMove] = React.useState();
    const [repHistory, setRepHistory] = React.useState([]);
    const [event, setEvent] = React.useState({ type: null });
    const ws = React.useRef(null);

    const navigate = useNavigate();

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

            if (!trailingMove) {
                if (event.initialState) {
                    setTrailingMove(event.initialState);
                }

                return;
            }

            if (event.initialState) {
                return;
            }

            setEvent(event);

            if (!leadingMove) {
                if (
                    (event.type.startsWith('Stand Up') || event.type === 'Sitted') &&
                    event.type !== trailingMove
                ) {
                    setLeadingMove(event.type);
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
                    { type: leadingMove + '/' + event.type, ts: Date.now() },
                ]);
            }
        };
    }, [trailingMove, leadingMove, repHistory]);

    // Calculate power rep count

    let powerRepCount = 0;

    if (repHistory.length > 1) {
        let powered = false;
        for (let i = 1; i < repHistory.length; i++) {
            if (repHistory[i].ts - repHistory[i - 1].ts <= 30 * 1000) {
                if (!powered) {
                    powerRepCount++;
                    powered = true;
                }
            } else if (powered) {
                powered = false;
            }
        }
    }

    React.useEffect(() => {
        console.log(repHistory);
    }, [repHistory]);

    /*React.useEffect(() => {
        if (!ws.current) {
            return;
        }

        ws.current.onmessage = (message) => {
            const event = JSON.parse(message.data);
            console.log(event);

            setEvent(event);

            if (!currentState) {
                setCurrentState();
            }

            if (event.event === 'Stand Up') {
                if (!prevMove) {
                    setPrevMove('Stand');
                    navigate('/sit-anim');
                    return;
                }

                if (prevMove === 'Sit') {
                    setPrevMove('Stand');
                    setRepCount(repCount + 1);

                    if (repCount === 0) {
                        navigate('/partial-rep-done');
                    } else {
                        navigate(`/full-rep-done?repCount=${repCount + 1}`);
                    }

                    return;
                }
            }

            if (event.event === 'Stand Down') {
                if (!prevMove) {
                    setPrevMove('Sit');
                    navigate('/stand-anim');
                    return;
                }

                if (prevMove === 'Stand') {
                    setPrevMove('Sit');
                    setRepCount(repCount + 1);

                    if (repCount === 0) {
                        navigate('/partial-rep-done');
                    } else {
                        navigate(`/full-rep-done?repCount=${repCount + 1}`);
                    }

                    return;
                }
            }
        };
    }, [prevMove, repCount]);*/

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
                        <Typography level="h1">{powerRepCount}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Chair size={40} />
                        <Typography level="h1">{repHistory.length}</Typography>
                    </Stack>
                </Stack>
            </Stack>
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
