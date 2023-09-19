import { Box, Button, Divider, TextField, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import { usePreference } from '../../context/PreferenceContext'

export const MediaSettings = (): JSX.Element => {
    const pref = usePreference()

    const clientIdRef = useRef<HTMLInputElement>(null)
    // const mediaProxyRef = useRef<HTMLInputElement>(null)

    const [buttonText, setButtonText] = useState<string>('Save')

    const handleSave = (): void => {
        if (clientIdRef.current) {
            pref.setImgurClientID(clientIdRef.current.value)
            setButtonText('OK!')
            setTimeout(() => {
                setButtonText('Save')
            }, 2000)
        }
    }
    /*
    const handleMediaProxySave = (): void => {
        if (mediaProxyRef.current) {
            pref.setMediaProxy(mediaProxyRef.current.value)
            setButtonText('OK!')
            setTimeout(() => {
                setButtonText('Save')
            }, 2000)
        }
    }
    */
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}
        >
            <Typography variant="h3">이미지 업로드 설정</Typography>
            <Typography>
                Imgur를 통해서 업로드、<a href={'https://api.imgur.com/oauth2/addclient'}>페이지</a>
                앱을 통해 업로드&quot;OAuth 2 authorization without a callback URL&quot;로 작성해주세요。
            </Typography>
            <Box>
                <TextField
                    label="ClientId"
                    variant="outlined"
                    fullWidth={true}
                    defaultValue={pref.imgurClientID}
                    inputRef={clientIdRef}
                    type="password"
                />
            </Box>
            <Button variant="contained" onClick={handleSave}>
                {buttonText}
            </Button>
            <Divider />

            {/*
            <Typography variant="h3">URL미리보기 설정</Typography>
            <Typography>
                URL 미리보기에 사용할 API의 URL을 설정합니다.기본적으로는 언젠가 계정의 host로 이전될 예정입니다.
            </Typography>
            <Box>
                <TextField
                    label="MediaProxyUrl"
                    variant="outlined"
                    fullWidth={true}
                    defaultValue={pref.mediaProxy}
                    inputRef={mediaProxyRef}
                    type="text"
                />
            </Box>
            <Button variant="contained" onClick={handleMediaProxySave}>
                {buttonText}
            </Button>
            */}
        </Box>
    )
}
