import { Typography } from '@mui/joy';

import Body from '../components/Body';

const StandAnimation = function () {
    return (
        <Body>
            <Typography level="h2" mb={2}>
                Give it a try!
            </Typography>
            <video src="/assets/stand.mov" autoPlay muted loop width={480} />
        </Body>
    );
};

export default StandAnimation;
