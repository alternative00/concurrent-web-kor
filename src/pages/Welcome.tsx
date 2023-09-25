import Box from '@mui/material/Box'
import { Themes, createConcurrentTheme } from '../themes'
import { Button, CssBaseline, IconButton, Link, ThemeProvider, Typography } from '@mui/material'
import { useState } from 'react'
import { usePersistent } from '../hooks/usePersistent'
import type { ConcurrentTheme } from '../model'
import { NavLink } from 'react-router-dom'
import GitHubIcon from '@mui/icons-material/GitHub'
import AppMock from '../components/welcome/AppMock'
import { PassportRenderer } from '../components/theming/Passport'
import Tilt from 'react-parallax-tilt'
import { StreamCard } from '../components/Stream/Card'
import { ConcurrentWordmark } from '../components/theming/ConcurrentWordmark'

export default function Welcome(): JSX.Element {
    const [themeName, setThemeName] = usePersistent<string>('Theme', 'blue')
    const [theme, setTheme] = useState<ConcurrentTheme>(createConcurrentTheme(themeName))

    const themes: string[] = Object.keys(Themes)

    const randomTheme = (): void => {
        const box = themes.filter((e) => e !== themeName)
        const newThemeName = box[Math.floor(Math.random() * box.length)]
        setThemeName(newThemeName)
        setTheme(createConcurrentTheme(newThemeName))
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    gap: 4,
                    width: '100vw',
                    maxWidth: '1024px',
                    margin: 'auto',
                    minHeight: '100dvh',
                    flexDirection: 'column',
                    padding: '20px',
                    color: 'background.contrastText'
                }}
            >
                <Box /* header */ sx={{ display: 'flex', gap: '30px', justifyContent: 'space-between' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <ConcurrentWordmark color={theme.palette.background.contrastText} />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '10px'
                        }}
                    >
                        <Button variant="contained" onClick={randomTheme}>
                            ✨
                        </Button>

                        <Button variant="contained" component={NavLink} to="/import">
                            インポート
                        </Button>
                    </Box>
                </Box>
                <Box /* top */ display="flex" flexDirection={{ xs: 'column', sm: 'column', md: 'row' }} gap={2}>
                    <Box flex={1}>
                        <Typography variant="h1" fontSize="50px">
                            하나의 세계!
                        </Typography>
                        <Typography variant="h1" fontSize="50px" gutterBottom>
                            무한한 환경!
                        </Typography>
                        <Typography>
                            Concurrent하나의 계정으로 수많은 서버와 연결되는 새로운 탈중앙화화 SNS입니다.
                        </Typography>
                        <Button
                            variant="contained"
                            component={NavLink}
                            to="/register"
                            sx={{
                                marginTop: '20px',
                                width: '100%'
                            }}
                        >
                            계정 생성
                        </Button>
                        <Box pt={2}>
                            <Typography gutterBottom variant="h3">
                                Concurrent은 현재 개발 중인 소프트웨어입니다.
                            </Typography>
                            <Typography>
                                기능 추가 중으로 현재는 아직 많은 기능을 사용할 수는 없습니다. 가볍게 즐겨주세요!
                            </Typography>
                            <Typography>
                                버그 발견 혹은 건의 사항
                                <Link href="https://github.com/totegamma/concurrent-web/issues/new/choose">
                                    Github에서Issue
                                </Link>
                                를 구축하여 지금 바로 개발에 참여하세요!
                            </Typography>

                            <Typography gutterBottom variant="h3" mt={1}>
                                개발 예정 기능
                            </Typography>
                            <Typography>- 멘션</Typography>
                            <Typography>- Activitypub계정 팔로우</Typography>
                            <Typography>- 미디어 전용 게시글 및 사용자 미디어 목록</Typography>
                            <Typography>- 뮤트 등의 각종 필터링</Typography>
                            <Typography>- 네이티브 미디어 서버 옵션</Typography>
                            <Typography>- URL미리보기 카드 표시</Typography>
                            <Typography>- 다른 사용자의 활동 타임라인</Typography>
                            <Typography>- etc...</Typography>
                        </Box>
                    </Box>

                    <Box flex={1}>
                        <AppMock />
                    </Box>
                </Box>
                <Box /* column */
                    display="flex"
                    flexDirection={{ xs: 'column-reverse', sm: 'column-reverse', md: 'row' }}
                    gap={2}
                >
                    <Box
                        sx={{
                            flex: 1,
                            width: '300px',
                            margin: 'auto'
                        }}
                    >
                        <Tilt glareEnable={true} glareBorderRadius="5%">
                            <PassportRenderer
                                theme={theme}
                                ccid={'CCE919C85E695AdA4acE5d3ae56310435EE0b522a3'}
                                name={'Anonymous'}
                                avatar={''}
                                host={'dev.concurrent.world'}
                                cdate={'2023/02/04'}
                                trust={255}
                            />
                        </Tilt>
                    </Box>

                    <Box flex={1}>
                        <Typography gutterBottom variant="h1">
                           이제 서버마다 계정을 만들 필요가 없습니다!
                        </Typography>
                        <Typography>
                            기존의 탈중앙화 SNS는 서버마다 계정을 만들어야 했습니다.
                            Concurrent는 개인키를 사용하여 하나의 계정으로 수 많은 서버에 가입할 수 있습니다.
                        </Typography>
                    </Box>
                </Box>

                <Box /* column */ display="flex" flexDirection={{ xs: 'column', sm: 'column', md: 'row' }} gap={2}>
                    <Box flex={1}>
                        <Typography gutterBottom variant="h1">
                           주제별 타임라인인
                        </Typography>
                        <Typography>
                            Concurrentは'스트림'이라고 부르는 커뮤니티 타임라인을 자유롭게 생성할 수 있습니다!
                            기존 SNS에서 '이 계정의 팔로워에게 이런 이야기를 하는 것은 좀...'이라는 생각에 계정을 바꿔가며 이야기해야했던 것에서 벗어날 수 있습니다.
                           좋아하는 주제를 가지고 관심있는 사람들끼리 모여 스트림에서 즐거운 시간을 보내봐요!
                        </Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" flex={1} gap={1}>
                        <StreamCard
                            stream={{
                                stream: {
                                    name: 'Arrival Lounge',
                                    shortname: 'concurrent',
                                    description:
                                        'hub.concurrent.world서버에 오신 것을 환영합니다. 모르는 것은 이 곳에서서 물어보세요.
                                    banner: 'https://cdn.discordapp.com/attachments/812107435833294868/1138120758493708348/image.png',
                                    id: 'ci8qvhep9dcpltmfq3fg@hub.concurrent.world',
                                    schema: '',
                                    author: '',
                                    maintainer: [],
                                    writer: [],
                                    reader: [],
                                    cdate: new Date()
                                },
                                domain: 'hub.concurrent.world'
                            }}
                        />
                        <StreamCard
                            stream={{
                                stream: {
                                    name: 'Dev Central',
                                    shortname: 'dev',
                                    description: '개발자 쉼터',
                                    banner: 'https://cdn.discordapp.com/attachments/812107435833294868/1138082112646418463/IMG_1983.jpg',
                                    id: 'chrmsgep9dcl7anfkgcg@dev.concurrent.world',
                                    schema: '',
                                    author: '',
                                    maintainer: [],
                                    writer: [],
                                    reader: [],
                                    cdate: new Date()
                                },
                                domain: 'dev.concurrent.world'
                            }}
                        />
                    </Box>
                </Box>

                <Box display="flex" flexDirection="column" alignItems="center">
                    <Typography gutterBottom variant="h1">
                        자, 시작하자!
                    </Typography>
                    <Button
                        variant="contained"
                        component={NavLink}
                        to="/register"
                        sx={{
                            marginTop: '20px',
                            width: '100%'
                        }}
                    >
                        계정 생성
                    </Button>
                </Box>

                <Box /* footer */ display="flex" justifyContent="flex-end" alignItems="center" gap="10px">
                    <Typography>You can contribute ;)</Typography>
                    <IconButton
                        color="primary"
                        href="https://github.com/totegamma/concurrent-web"
                        target="_blank"
                        sx={{
                            padding: '0px'
                        }}
                    >
                        <GitHubIcon fontSize="large" />
                    </IconButton>
                </Box>
            </Box>
        </ThemeProvider>
    )
}
