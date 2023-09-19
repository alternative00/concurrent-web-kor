import { Box, Slider, TextField, Typography } from '@mui/material'
import { usePreference } from '../../context/PreferenceContext'

export const SoundSettings = (): JSX.Element => {
    const pref = usePreference()

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '30px'
            }}
        >
            <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="h3">소리</Typography>
                <Typography variant="h4">볼륨륨</Typography>
                <Slider
                    aria-label="Volume"
                    value={pref.volume}
                    onChange={(_, value) => {
                        pref.setVolume(value as number)
                    }}
                />
                <Typography variant="h4">Override</Typography>
                <TextField
                    label="내 게시물"
                    placeholder="https://example.com/sound.mp3"
                    value={pref.postSound}
                    onChange={(e) => {
                        pref.setPostSound(e.target.value)
                    }}
                />
                <TextField
                    label="알림림"
                    placeholder="https://example.com/sound.mp3"
                    value={pref.notificationSound}
                    onChange={(e) => {
                        pref.setNotificationSound(e.target.value)
                    }}
                />
            </Box>
        </Box>
    )
}
