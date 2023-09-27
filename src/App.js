import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { CssVarsProvider, CssBaseline } from '@mui/joy';

import Welcome from './screens/Welcome';
import FirstSitting from './screens/FirstSitting';
import StandAnimation from './screens/StandAnimation';
import SitAnimation from './screens/SitAnimation';
import HaveARest from './screens/HaveARest';
import SubsequentSets from './screens/SubsequentSets';
import PartialRepDone from './screens/PartialRepDone';
import FullRepDone from './screens/FullRepDone';
import MyProfile from './screens/MyProfile';
import Friends from './screens/Friends';

const router = createBrowserRouter([
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
    {
        path: '/app/profile',
        element: <MyProfile />,
    },
    {
        path: '/app/friends',
        element: <Friends />,
    },
    {
        path: '/',
        element: <Navigate to="/app/profile" replace />,
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
