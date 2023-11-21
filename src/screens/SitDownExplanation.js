import { Box, Typography } from '@mui/joy';

const SitDownExplanation = function () {
    return (
        <Typography level="h1" display="flex" alignItems="center">
            Every time you take a seat you get{' '}
            <Box component="img" mx={2} height={40} src="/assets/SitIcon_blue.png" /> + 1
        </Typography>
    );
};

export default SitDownExplanation;
