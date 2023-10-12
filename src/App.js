import React from 'react';
import { Outlet, RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom';
import { CssVarsProvider, CssBaseline } from '@mui/joy';

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
            if (event === 'StandUp/Down') {
                if (!prevMove) {
                    setPrevMove('Sit');
                    navigate('/stand-anim');
                    return;
                }

                if (prevMove === 'Sit') {
                    setPrevMove('Stand');
                    navigate('/sit-anim');
                    return;
                }

                if (prevMove === 'Stand') {
                    setPrevMove('Sit');
                    setRepCount(repCount + 1);

                    if (repCount === 0) {
                        navigate('/partial-rep-done');
                    } else {
                        navigate('/full-rep-done');
                    }

                    return;
                }
            }
        };
    }, [prevMove, repCount]);

    return <Outlet />;
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
