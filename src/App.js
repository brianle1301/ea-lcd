import React from 'react';
import { Outlet, RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom';
import { CssVarsProvider, CssBaseline, Box, Stack } from '@mui/joy';

import Welcome from './screens/Welcome';
import FirstSitting from './screens/FirstSitting';
import StandAnimation from './screens/StandAnimation';
import SitAnimation from './screens/SitAnimation';
import HaveARest from './screens/HaveARest';
import SubsequentSets from './screens/SubsequentSets';
import PartialRepDone from './screens/PartialRepDone';
import FullRepDone from './screens/FullRepDone';

const Root = function () {
    const [prevMove, setPrevMove] = React.useState();
    const [repCount, setRepCount] = React.useState(0);
    const [event, setEvent] = React.useState();
    const ws = React.useRef(null);

    const navigate = useNavigate();

    React.useEffect(() => {
        const connect = function () {
            const socket = new WebSocket('ws://localhost:9000');
            ws.current = socket;

            socket.onopen = () => {
                console.log('Connection opened');
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
            const event = JSON.parse(message.data).event;
            console.log(event);

            setEvent({ event });

            if (event === 'Stand Up') {
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

            if (event === 'Stand Down') {
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
    }, [prevMove, repCount]);

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
            </Stack>
            <Outlet />
        </React.Fragment>
    );
};

const Square = function ({ type, event }) {
    const [on, setOn] = React.useState(event.event === type);
    const timeout = React.useRef(null);

    React.useEffect(() => {
        const isOn = event.event === type;

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
