import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import muiLink from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import { ProfileEditor } from '../components/ProfileEditor'
import ApiProvider from '../context/api'
import type { ConcurrentTheme } from '../model'
import { IssueJWT } from '@concurrent-world/client'
import {
    Alert,
    AlertTitle,
    Avatar,
    CssBaseline,
    Fade,
    Grid,
    IconButton,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    ThemeProvider,
    darken
} from '@mui/material'
import { usePersistent } from '../hooks/usePersistent'
import { Themes, createConcurrentTheme } from '../themes'
import Tilt from 'react-parallax-tilt'
import { PassportRenderer } from '../components/theming/Passport'
import { CCAvatar } from '../components/ui/CCAvatar'
import { generateIdentity } from '../util'
import { ConcurrentWordmark } from '../components/theming/ConcurrentWordmark'

import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import {
    Client,
    type RawDomainProfile,
    type Profile,
    Schemas,
    type CoreCharacter,
    type CoreDomain
} from '@concurrent-world/client'

export function Registration(): JSX.Element {
    const [themeName, setThemeName] = usePersistent<string>('Theme', 'blue')
    const [theme, setTheme] = useState<ConcurrentTheme>(createConcurrentTheme(themeName))

    const themes: string[] = Object.keys(Themes)
    const randomTheme = (): void => {
        const box = themes.filter((e) => e !== themeName)
        const newThemeName = box[Math.floor(Math.random() * box.length)]
        setThemeName(newThemeName)
        setTheme(createConcurrentTheme(newThemeName))
    }

    const [activeStep, setActiveStep] = useState(0)
    const [mnemonicTest, setMnemonicTest] = useState<string>('')
    const [profile, setProfile] = useState<Profile>()

    const [mnemonic, setMnemonic] = useState<string>('')
    const [CCID, setCCID] = useState<string>('')
    const [privateKey, setPrivateKey] = useState<string>('')
    const [client, initializeClient] = useState<Client>()

    useEffect(() => {
        const identity = generateIdentity()
        setMnemonic(identity.mnemonic)
        setCCID(identity.CCID)
        setPrivateKey(identity.privateKey)
        initializeClient(new Client(identity.privateKey, 'hub.concurrent.world'))
    }, [])

    const [server, setServer] = useState<string>('')
    const [host, setHost] = useState<CoreDomain | null | undefined>()
    const [entityFound, setEntityFound] = useState<boolean>(false)

    useEffect(() => {
        if (!CCID || !privateKey || !host) return
        const api = new Client(privateKey, host.fqdn)
        initializeClient(api)
    }, [host, CCID, privateKey])

    useEffect(() => {
        let unmounted = false
        if (!client) return
        const fqdn = server.replace('https://', '').replace('/', '')
        client.api.readDomain(fqdn).then((e) => {
            if (unmounted) return
            setHost(e)
        })
        console.log(fqdn)
        return () => {
            unmounted = true
        }
    }, [server])

    const setupAccount = (): void => {
        if (!client) return
        if (!host) return
        localStorage.setItem('Domain', JSON.stringify(host.fqdn))
        localStorage.setItem('PrivateKey', JSON.stringify(privateKey))
        localStorage.setItem('Mnemonic', JSON.stringify(mnemonic))

        console.log('hostAddr', host.ccid)

        client?.api
            .readCharacter(host.ccid, Schemas.domainProfile)
            .then((profile: CoreCharacter<RawDomainProfile> | null | undefined) => {
                console.log('domainprofile:', profile)
                const list = {
                    home: {
                        label: 'Home',
                        pinned: true,
                        streams: profile?.payload.body.defaultFollowingStreams
                            ? profile.payload.body.defaultFollowingStreams
                            : [],
                        userStreams: [],
                        expanded: false,
                        defaultPostStreams: profile?.payload.body.defaultPostStreams
                            ? profile.payload.body.defaultPostStreams
                            : []
                    }
                }
                console.log(list)
                localStorage.setItem('lists', JSON.stringify(list))
                window.location.href = '/'
            })
            .catch((_) => {
                const list = {
                    home: {
                        label: 'Home',
                        pinned: true,
                        streams: [],
                        userStreams: [],
                        expanded: false,
                        defaultPostStreams: []
                    }
                }
                localStorage.setItem('lists', JSON.stringify(list))
                window.location.href = '/'
            })
    }

    const checkRegistration = async (): Promise<void> => {
        console.log('check!!!')
        client?.api.invalidateEntity(CCID)
        const entity = await client?.api.readEntity(CCID)
        console.log(entity)
        setEntityFound(!!entity && entity.ccid != null)
    }

    const steps = [
        {
            title: 'Concurrent계정을 생성하세요！',
            component: (
                <>
                    <Alert severity="info">
                        <AlertTitle>Concurrent는 현재 개발 중에 있습니다.</AlertTitle>
                        우리는 새로운 기능을 추가하는 중이며 아직 설명이 부족합니다. 적당히 즐겨주시길 부탁드립니다!
                    </Alert>

                    <Box
                        sx={{
                            padding: '30px',
                            maxWidth: '600px',
                            margin: 'auto'
                        }}
                    >
                        <Tilt glareEnable={true} glareBorderRadius="5%">
                            <PassportRenderer
                                theme={theme}
                                ccid={CCID}
                                name={''}
                                avatar={''}
                                host={''}
                                cdate={''}
                                trust={0}
                            />
                        </Tilt>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={(): void => {
                                setActiveStep(1)
                            }}
                        >
                            ID카드 만들기
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '10px',
                            alignItems: 'center',
                            position: 'absolute',
                            right: '10px',
                            bottom: '10px'
                        }}
                    >
                        <Typography>이미 계정이 있으신가요?</Typography>
                        <Button variant="contained" component={Link} to="/import">
                            계정 가져오기
                        </Button>
                    </Box>
                </>
            )
        },
        {
            title: '사용자자ID',
            component: (
                <Box
                    sx={{
                        width: '100%'
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '20px'
                        }}
                    >
                        <Paper
                            variant="outlined"
                            sx={{
                                padding: '10px',
                                fontWeight: 'bold',
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            <CCAvatar identiconSource={CCID} />
                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: '0.9rem',
                                        sm: '1rem'
                                    }
                                }}
                            >
                                {CCID}
                            </Typography>
                        </Paper>
                        <Typography>이것은 Concurrent 세계에서 당신을 특정하는 문자열입니다. </Typography>
                        <Divider />
                        <Typography>
                            그런 다음 당신이 이 ID의 소유자임을 증명하기 위한 시크릿 코드를 작성합니다.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={(): void => {
                                setActiveStep(2)
                            }}
                        >
                            Next: ID의 시크릿 코드 작성
                        </Button>
                    </Box>
                </Box>
            )
        },
        {
            title: '시크릿 코드',
            component: (
                <Box
                    sx={{
                        display: 'flex',
                        gap: '15px',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Paper
                        variant="outlined"
                        component={Grid}
                        style={{
                            width: '100%',
                            margin: 1
                        }}
                        spacing={1}
                        columns={4}
                        container
                    >
                        {mnemonic.split('　').map((e, i) => (
                            <Grid
                                key={i}
                                item
                                xs={2}
                                sm={1}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '5px',
                                    padding: '5px'
                                }}
                            >
                                {i + 1}:
                                <Paper
                                    variant="outlined"
                                    sx={{ display: 'inline-block', padding: '5px', width: '100%', textAlign: 'center' }}
                                >
                                    {e}
                                </Paper>
                            </Grid>
                        ))}
                    </Paper>
                    <Button
                        variant="contained"
                        onClick={() => {
                            navigator.clipboard.writeText(mnemonic)
                        }}
                        startIcon={<ContentPasteIcon />}
                    >
                        시크릿 코드 복사하기
                    </Button>
                    <Typography>
                       시크릿 코드는 재로그인 혹은 다른 기기에서 로그인 할때 필요한 코드입니다.
                    </Typography>
                    <Typography>
                        <b>절대 분실하면 안됩니다</b>그리고、
                        <b>절대 계정을 공유하지</b>않습니다.
                    </Typography>
                    <Typography>
                        분실시 두 번 다시 계정에 접속할 수 없습니다.
                        또한 계정이 공개되면 당신의 계정이 해커와 공유될 수 있습니다.
                    </Typography>
                    <Typography>안전한 곳에 기록하셨나요?</Typography>
                    <Button
                        variant="contained"
                        onClick={(): void => {
                            setActiveStep(3)
                        }}
                    >
                        Next: 시크릿 코드 확인
                    </Button>
                </Box>
            )
        },
        {
            title: '시크릿 코드 확인',
            component: (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px'
                    }}
                >
                    <TextField
                        placeholder="12개의 단어로 이루어진 코드"
                        value={mnemonicTest}
                        onChange={(e) => {
                            setMnemonicTest(e.target.value)
                        }}
                        sx={{
                            width: '100%'
                        }}
                    />
                    {mnemonic === mnemonicTest ? '일치합니다.' : '일치하지 않습니다.'}
                    <Button
                        variant="contained"
                        disabled={mnemonic !== mnemonicTest}
                        onClick={(): void => {
                            setActiveStep(4)
                        }}
                    >
                        Next: 주소 선택
                    </Button>
                </Box>
            )
        },
        {
            title: '주소 선택',
            component: (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px'
                    }}
                >
                    <Typography>
                        여러분의 작성글을 저장 및 전송할 주소를 선택하세요.
                        <br />
                        어떤 주소를 선택해도 모두와 연결할 수 있습니다.
                        <br />
                        또한、(서버 관리자)언제든지 다른 주소로 이행할 수 있습니다.
                    </Typography>
                    <Alert severity="info">
                        <AlertTitle>여기서 한번 concurrent.world에서 주소 관할 사이트로 이동합니다.</AlertTitle>
                        주소에서 계정을 생성한 후 이 페이지로 다시 돌아와야 합니다. 이 탭을 닫지 마십시오.
                    </Alert>
                    <Box width="100%" display="flex" flexDirection="column">
                        <Typography variant="h3">리스트에서 선택</Typography>
                        <List>
                            <ListItemButton
                                component={Link}
                                to={`https://hub.concurrent.world/web/register?token=${
                                    IssueJWT(privateKey, { iss: CCID, aud: 'hub.concurrent.world' }) ?? ''
                                }`}
                                target="_blank"
                                onClick={() => {
                                    setServer('hub.concurrent.world')
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar></Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="hub.concurrent.world" />
                                <ListItemIcon>
                                    <OpenInNewIcon />
                                </ListItemIcon>
                            </ListItemButton>
                        </List>
                        <Divider>또는</Divider>
                        <Typography variant="h3">URL에서 직접 입력력</Typography>
                        <Typography
                            color="text.primary"
                            component={muiLink}
                            variant="caption"
                            href="https://github.com/totegamma/concurrent"
                            target="_blank"
                        >
                            Tips: 직접 서버를 구축하려면 여기로
                        </Typography>
                        <Box flex="1" />
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <TextField
                                placeholder="concurrent.example.tld"
                                value={server}
                                onChange={(e) => {
                                    setServer(e.target.value)
                                }}
                                sx={{
                                    flex: 1
                                }}
                            />
                            <Button
                                variant="contained"
                                component={Link}
                                to={
                                    'http://' +
                                    (host?.fqdn ?? '') +
                                    '/web/register?token=' +
                                    (IssueJWT(privateKey, { iss: CCID, aud: host?.fqdn }) ?? '')
                                }
                                target="_blank"
                                disabled={!host}
                            >
                                등록 페이지로
                            </Button>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        disabled={!host}
                        onClick={() => {
                            checkRegistration()
                        }}
                    >
                        주소 등록 현황 확인
                    </Button>
                    <Button
                        variant="contained"
                        disabled={!entityFound}
                        onClick={(): void => {
                            setActiveStep(5)
                        }}
                    >
                        Next: 프로필 작성
                    </Button>
                </Box>
            )
        },
        {
            title: '프로필 작성',
            component: (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px'
                    }}
                >
                    이 곳에서 이름, 아이콘, 자기소개를 설정합니다.。
                    <Box
                        sx={{
                            width: '100%',
                            borderRadius: 1,
                            overflow: 'hidden'
                        }}
                    >
                        <ProfileEditor
                            onSubmit={(newprofile) => {
                                setProfile(newprofile)
                                client?.setupUserstreams().then(() => {
                                    setActiveStep(6)
                                })
                            }}
                        />
                    </Box>
                </Box>
            )
        },
        {
            title: '준비 완료!',
            component: (
                <>
                    <Box
                        sx={{
                            padding: '30px',
                            maxWidth: '600px',
                            margin: 'auto'
                        }}
                    >
                        <Tilt glareEnable={true} glareBorderRadius="5%">
                            <PassportRenderer
                                theme={theme}
                                ccid={CCID}
                                name={profile?.username ?? ''}
                                avatar={profile?.avatar ?? ''}
                                host={host?.fqdn ?? ''}
                                cdate={new Date().toLocaleDateString()}
                                trust={0}
                            />
                        </Tilt>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '20px'
                        }}
                    >
                        <Button variant="contained" onClick={setupAccount}>
                            시작하다.
                        </Button>
                    </Box>
                </>
            )
        }
    ]

    if (!client) return <>api constructing...</>

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ApiProvider client={client}>
                <Box
                    sx={{
                        padding: '20px',
                        gap: '20px',
                        display: 'flex',
                        width: '100vw',
                        minHeight: '100dvh',
                        flexDirection: 'column',
                        background: [
                            theme.palette.background.default,
                            `linear-gradient(${theme.palette.background.default}, ${darken(
                                theme.palette.background.default,
                                0.1
                            )})`
                        ]
                    }}
                >
                    <Button
                        disableRipple
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            textTransform: 'none',
                            '&:hover': {
                                background: 'none'
                            }
                        }}
                        onClick={randomTheme}
                    >
                        <ConcurrentWordmark color={theme.palette.background.contrastText} />
                    </Button>
                    <Paper
                        sx={{
                            display: 'flex',
                            position: 'relative',
                            overflow: 'hidden',
                            width: '100%',
                            flex: 1
                        }}
                    >
                        {steps.map((step, index) => (
                            <Fade key={index} in={activeStep === index}>
                                <Box
                                    sx={{
                                        padding: '20px',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        flex: 1
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            mb: '30px'
                                        }}
                                    >
                                        {activeStep !== 0 && (
                                            <IconButton
                                                sx={{
                                                    width: '50px'
                                                }}
                                                onClick={() => {
                                                    setActiveStep((prevActiveStep) => prevActiveStep - 1)
                                                }}
                                            >
                                                <ArrowBackIosNewIcon />
                                            </IconButton>
                                        )}
                                        <Typography
                                            variant="h1"
                                            sx={{
                                                display: 'flex',
                                                flex: 1,
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {step.title}
                                        </Typography>
                                        {activeStep !== 0 && <Box sx={{ width: '50px' }} />}
                                    </Box>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            flex: 1,
                                            overflowY: 'auto'
                                        }}
                                    >
                                        {step.component}
                                    </Box>
                                </Box>
                            </Fade>
                        ))}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '100%'
                            }}
                        ></Box>
                    </Paper>
                </Box>
            </ApiProvider>
        </ThemeProvider>
    )
}
