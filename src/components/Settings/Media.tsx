import { Box, Button, Divider, TextField, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import { usePreference } from '../../context/PreferenceContext'

import { useTranslation } from 'react-i18next'

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

    const { t } = useTranslation('', { keyPrefix: 'settings.media' })

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}
        >
            <Typography variant="h3">{t('imagePostSettings')}</Typography>
            <Typography>
                {t('afterRegisteringImgur')}
                <a href={'https://api.imgur.com/oauth2/addclient'}>{t('thisPage')}</a>
                {t('oauth2')}
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
                URL 미리보기에 사용할 API의 URL을 설정합니다.기본값은 언젠가 계정의 host로 전환될 예정입니다.
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
