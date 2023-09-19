import { Box, Button, Divider, FormControlLabel, FormGroup, IconButton, Switch, Typography } from '@mui/material'
import { usePreference } from '../../context/PreferenceContext'
import { Passport } from '../../components/theming/Passport'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import Tilt from 'react-parallax-tilt'
import { useApi } from '../../context/api'
import { useState } from 'react'
import { useSnackbar } from 'notistack'
import { IssueJWT } from '@concurrent-world/client'

export const GeneralSettings = (): JSX.Element => {
    const pref = usePreference()
    const client = useApi()
    const [showPrivateKey, setShowPrivateKey] = useState(false)
    const [invitationCode, setInvitationCode] = useState<string>('')

    const tags = client?.api?.getTokenClaims()?.tag?.split(',') ?? []
    const { enqueueSnackbar } = useSnackbar()

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1
            }}
        >
            <Box
                sx={{
                    padding: { xs: '10px', sm: '10px 50px' }
                }}
            >
                <Tilt glareEnable={true} glareBorderRadius="5%">
                    <Passport />
                </Tilt>
            </Box>
            <Divider />

            <Box>
                <Typography variant="h3">기본 설정</Typography>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={pref.showEditorOnTop}
                                onChange={(e) => {
                                    pref.setShowEditorOnTop(e.target.checked)
                                }}
                            />
                        }
                        label="포스팅 에디터를 상단에 표시"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={pref.showEditorOnTopMobile}
                                onChange={(e) => {
                                    pref.setShowEditorOnTopMobile(e.target.checked)
                                }}
                            />
                        }
                        label="포스팅 에디터를 상단에 표시(모바일)"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={pref.devMode}
                                onChange={(e) => {
                                    pref.setDevMode(e.target.checked)
                                }}
                            />
                        }
                        label="개발자 모드"
                    />
                </FormGroup>
            </Box>

            <Divider />

            <Typography variant="h3" gutterBottom>
                CCID
            </Typography>
            <Typography>{client.ccid}</Typography>

            <Typography variant="h3" gutterBottom>
                Host
            </Typography>
            <Typography>{client.api.host}</Typography>

            <Typography variant="h3" gutterBottom>
                Privatekey
            </Typography>
            <Typography
                sx={{
                    wordBreak: 'break-all',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {showPrivateKey ? client.api.privatekey : '•••••••••••••••••••••••••••••••••••••••••••••••••'}
                <IconButton
                    sx={{ ml: 'auto' }}
                    onClick={() => {
                        setShowPrivateKey(!showPrivateKey)
                    }}
                >
                    {!showPrivateKey ? (
                        <VisibilityIcon sx={{ color: 'text.primary' }} />
                    ) : (
                        <VisibilityOffIcon sx={{ color: 'text.primary' }} />
                    )}
                </IconButton>
            </Typography>

            <Typography variant="h3" gutterBottom>
                HomeStream
            </Typography>
            <Typography gutterBottom>{client.user?.userstreams?.homeStream}</Typography>

            <Typography variant="h3" gutterBottom>
                NotificationStream
            </Typography>
            <Typography gutterBottom>{client.user?.userstreams?.notificationStream}</Typography>

            <Typography variant="h3" gutterBottom>
                AssociationStream
            </Typography>
            <Typography gutterBottom>{client.user?.userstreams?.associationStream}</Typography>

            <Divider />

            {tags.includes('_invite') && (
                <>
                    {invitationCode === '' ? (
                        <Button
                            variant="contained"
                            onClick={(_) => {
                                if (client.api.host === undefined) {
                                    return
                                }
                                const jwt = IssueJWT(client.keyPair.privatekey, {
                                    iss: client.ccid,
                                    aud: client.host,
                                    sub: 'CONCURRENT_INVITE',
                                    exp: Math.floor((new Date().getTime() + 24 * 60 * 60 * 1000) / 1000).toString()
                                }) // 24h validity
                                setInvitationCode(jwt)
                            }}
                        >
                            초대코드 생성
                        </Button>
                    ) : (
                        <>
                            <Typography variant="body1">초대코드(24시간동안 유효합니다.)</Typography>
                            <pre
                                style={{
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all',
                                    backgroundColor: '#333',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    color: '#fff'
                                }}
                            >
                                {invitationCode}
                            </pre>
                            <Button
                                variant="contained"
                                onClick={(_) => {
                                    navigator.clipboard.writeText(invitationCode)
                                    enqueueSnackbar('복사되었습니다.', { variant: 'success' })
                                }}
                            >
                                초대코드 복사
                            </Button>
                        </>
                    )}
                </>
            )}
        </Box>
    )
}
