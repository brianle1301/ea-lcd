import { Avatar, Card, Container, Stack, Typography } from '@mui/joy';

const MyProfile = function () {
    return (
        <Container sx={{ py: 4 }}>
            <Typography level="h1" mb={3}>
                My profile
            </Typography>
            <Stack spacing={2} direction="row" mb={3}>
                <Avatar size="lg" color="primary">
                    BL
                </Avatar>

                <div>
                    <Typography>Brian Le</Typography>
                    <Typography level="body-sm">Joined last week</Typography>
                </div>
            </Stack>
            <Typography level="title-lg" mb={2}>
                Today's performance
            </Typography>
            <Stack spacing={2}>
                <Card>
                    <Typography level="body-sm">Sit stand</Typography>
                    <Typography level="title-md">4 reps</Typography>
                </Card>

                <Card>
                    <Typography level="body-sm">Smooth saccades</Typography>
                    <Typography level="title-md">0 reps</Typography>
                </Card>

                <Card>
                    <Typography level="body-sm">Random saccades</Typography>
                    <Typography level="title-md">0 reps</Typography>
                </Card>
            </Stack>
        </Container>
    );
};

export default MyProfile;
