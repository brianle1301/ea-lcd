import { Box, Stack, Typography } from '@mui/joy';

const BonusExplanation = function () {
    return (
        <Stack alignItems="center">
            <Typography level="h1" color="primary">
                BONUS
            </Typography>
            <Typography level="h1" display="flex" alignItems="center">
                Every time you "Do it Twice" you get
                <Box component="img" mr={1} ml={2} height={40} src="/assets/SitIcon_blue.png" />
                <Box component="img" ml={1} mr={2} height={40} src="/assets/SitIcon_blue.png" />
                + 1 or
                <Box component="img" mr={1} ml={2} height={40} src="/assets/StandIcon_blue.png" />
                <Box component="img" ml={1} mr={2} height={40} src="/assets/StandIcon_blue.png" />+
                1
            </Typography>
        </Stack>
    );
};

export default BonusExplanation;
