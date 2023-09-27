import { Typography } from '@mui/joy';

import Body from '../components/Body';

const HaveARest = function () {
    return (
        <Body>
            <Typography level="h2" mb={2}>
                It's okay, have a rest!
            </Typography>
            <img src="/assets/rest.jpg" width={480} />
        </Body>
    );
};

export default HaveARest;
