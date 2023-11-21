import { Box, Typography } from '@mui/joy';

const StandUpExplanation = function () {
    return (
        <Typography level="h1" display="flex" alignItems="center">
            Every time you take a stand up you get{' '}
            <Box component="img" mx={2} height={40} src="/assets/StandIcon_blue.png" /> + 1
        </Typography>
    );
};

export default StandUpExplanation;
