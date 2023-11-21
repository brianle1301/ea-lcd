import { Box, Stack, Typography } from '@mui/joy';
import dayjs from 'dayjs';

const Sleep = function () {
    return (
        <Stack spacing={2} alignItems="center">
            <Box component="img" mx={2} height={240} src="/assets/SheepIcon.png" />
            <Typography level="h1">{dayjs().format('hh:MM A')}</Typography>
        </Stack>
    );
};

export default Sleep;
