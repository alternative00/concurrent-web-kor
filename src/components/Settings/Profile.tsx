import { Box, Typography } from '@mui/material'
import { ProfileEditor } from '../ProfileEditor'
import { useApi } from '../../context/api'
import { useSnackbar } from 'notistack'

export const ProfileSettings = (): JSX.Element => {
    const client = useApi()
    const { enqueueSnackbar } = useSnackbar()

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '30px'
            }}
        >
            <Box>
                <Typography variant="h3">프로필</Typography>
                <Box
                    sx={{
                        width: '100%',
                        borderRadius: 1,
                        overflow: 'hidden'
                    }}
                >
                    <ProfileEditor
                        id={client?.user?.profile?.id}
                        initial={client?.user?.profile}
                        onSubmit={(_profile) => {
                            enqueueSnackbar('변경 완료!', { variant: 'success' })
                        }}
                    />
                </Box>
            </Box>
        </Box>
    )
}
