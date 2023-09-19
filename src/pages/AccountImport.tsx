import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HDNodeWallet } from 'ethers'
import { LangJa } from '../utils/lang-ja'
import { Client, LoadKey, type CoreDomain, CommputeCCID } from '@concurrent-world/client'
import type { ConcurrentTheme } from '../model'
import { usePersistent } from '../hooks/usePersistent'
import { Themes, createConcurrentTheme } from '../themes'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline, darken } from '@mui/material'
import { ConcurrentWordmark } from '../components/theming/ConcurrentWordmark'
import { IsValid256k1PrivateKey } from '@concurrent-world/client'

export function AccountImport(): JSX.Element {
    const [themeName, setThemeName] = usePersistent<string>('Theme', 'blue2')
    const [theme, setTheme] = useState<ConcurrentTheme>(createConcurrentTheme(themeName))

    const themes: string[] = Object.keys(Themes)
    const randomTheme = (): void => {
        const box = themes.filter((e) => e !== themeName)
        const newThemeName = box[Math.floor(Math.random() * box.length)]
        setThemeName(newThemeName)
        setTheme(createConcurrentTheme(newThemeName))
    }

    const [mnemonic, setMnemonic] = useState<string>('')
    const [secret, setSecret] = useState<string>('')
    const [server, setServer] = useState<string>('')
    const [host, setHost] = useState<CoreDomain>()
    const [entityFound, setEntityFound] = useState<boolean>(false)
    const [client, initializeClient] = useState<Client>()
    const [errorMessage, setErrorMessage] = useState<string>('')

    const [privatekey, setPrivatekey] = useState<string>('')

    useEffect(() => {
        let privatekey = ''
        let ccid = ''
        setServer('')
        setErrorMessage('')
        setEntityFound(false)
        if (mnemonic === '') {
            if (!IsValid256k1PrivateKey(secret)) {
                setErrorMessage('개인키 조건에 부합하지 않습니다. 개인키가 아니거나 입력에 오류가 있습니다.')
                return
            }
            const key = LoadKey(secret)
            console.log(key)
            if (!key) return
            privatekey = key.privatekey
            ccid = CommputeCCID(key.publickey)
        } else {
            try {
                const wallet = HDNodeWallet.fromPhrase(mnemonic.trim(), undefined, undefined, LangJa.wordlist()) // TODO: move to utils
                privatekey = wallet.privateKey.slice(2)
                ccid = 'CC' + wallet.address.slice(2)
            } catch (e) {
                console.log(e)
                setErrorMessage('시크릿 코드 오류류')
                return
            }
        }

        setPrivatekey(privatekey)

        try {
            const hubClient = new Client(privatekey, 'hub.concurrent.world', 'stab-client')
            hubClient.api.readEntity(ccid).then((entity) => {
                console.log(entity)
                if (entity && entity.ccid === ccid) {
                    setServer(entity.domain || 'hub.concurrent.world')
                    setEntityFound(true)
                } else {
                    setErrorMessage('서버를 찾을 수 없습니다. 수동 입력으로 계속 진행 가능합니다.')
                }
            })
        } catch (e) {
            console.log(e)
        }
    }, [mnemonic, secret])

    useEffect(() => {
        let unmounted = false
        const fqdn = server.replace('https://', '').replace('/', '')
        try {
            const client = new Client(privatekey, fqdn)
            client.api
                .readDomain(fqdn)
                .then((e: any) => {
                    if (unmounted) return
                    setHost(e)
                    client.api
                        .readEntity(client.ccid)
                        .then((entity) => {
                            if (unmounted) return
                            console.log(entity)
                            if (!entity || entity.ccid !== client.ccid) {
                                setErrorMessage('해당 서버에서 당신의 ID를 찾을 수 없었습니다.')
                                return
                            }
                            setErrorMessage('')
                            setEntityFound(entity.ccid === client.ccid)
                            initializeClient(client)
                        })
                        .catch((_) => {
                            if (unmounted) return
                            setErrorMessage('해당 서버에서 당신의 ID를 찾을 수 없었습니다.')
                        })
                    console.log(fqdn)
                })
                .catch((_) => {
                    if (unmounted) return
                    setErrorMessage('해당 서버에 접속할 수 없었습니다.')
                })
        } catch (e) {
            console.log(e)
            return
        }
        return () => {
            unmounted = true
        }
    }, [server])

    const accountImport = (): void => {
        if (!client) return
        if (!host) return
        localStorage.setItem('Domain', JSON.stringify(host.fqdn))
        localStorage.setItem('PrivateKey', JSON.stringify(client.api.privatekey))
        localStorage.setItem('Mnemonic', JSON.stringify(mnemonic))
        window.location.href = '/'
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
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
                        flexDirection: 'column',
                        width: '100%',
                        padding: '20px',
                        flex: 1,
                        gap: '20px'
                    }}
                >
                    <Typography variant="h3">시크릿 코드</Typography>
                    <TextField
                        placeholder="12개 단어로 이루어진 비밀 문구"
                        value={mnemonic}
                        onChange={(e) => {
                            setMnemonic(e.target.value)
                        }}
                    />
                    <Box>
                        <Divider>또는</Divider>
                    </Box>
                    <Typography variant="h3">개인키를 직접 입력력</Typography>
                    <TextField
                        placeholder="0x..."
                        value={secret}
                        onChange={(e) => {
                            setSecret(e.target.value)
                        }}
                    />
                    <Divider sx={{ my: '30px' }} />
                    <Typography variant="h3">주소소</Typography>
                    <TextField
                        placeholder="https://example.tld/"
                        value={server}
                        onChange={(e) => {
                            setServer(e.target.value)
                        }}
                    />
                    {errorMessage}
                    <Button disabled={!entityFound} variant="contained" onClick={accountImport}>
                        インポート
                    </Button>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            gap: '10px',
                            alignItems: 'center'
                        }}
                    >
                        <Typography>아직 회원가입 하지 않으셨나요?</Typography>
                        <Button variant="contained" component={Link} to="/register">
                            회원 가입
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </ThemeProvider>
    )
}
