import { Box } from '@mui/joy';

const Body = function ({ children }) {
    return (
        <Box
            sx={{
                width: '100dvw',
                height: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {children}
        </Box>
    );
};

export default Body;
