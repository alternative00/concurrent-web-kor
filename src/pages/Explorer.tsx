import { Box, Button, Checkbox, Divider, IconButton, Paper, TextField, Typography, useTheme } from '@mui/material'
import { type Commonstream, Schemas } from '@concurrent-world/client'
import { useApi } from '../context/api'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Fuzzysort from 'fuzzysort'

import { CCDrawer } from '../components/ui/CCDrawer'

import { CCEditor } from '../components/ui/cceditor'
import { useSnackbar } from 'notistack'

import DoneAllIcon from '@mui/icons-material/DoneAll'
import RemoveDoneIcon from '@mui/icons-material/RemoveDone'
import { type StreamWithDomain } from '../model'
import { StreamCard } from '../components/Stream/Card'

export function Explorer(): JSX.Element {
    const client = useApi()
    const theme = useTheme()
    const navigate = useNavigate()

    const [domains, setDomains] = useState<string[]>([])
    const [selectedDomains, setSelectedDomains] = useState<string[]>([client.api.host])

    const [streams, setStreams] = useState<StreamWithDomain[]>([])
    const [searchResult, setSearchResult] = useState<StreamWithDomain[]>([])
    const [search, setSearch] = useState<string>('')

    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

    const { enqueueSnackbar } = useSnackbar()

    const load = (): void => {
        client.api.getDomains().then((e) => {
            if (!client.api.host) return
            const domains = [client.host, ...e.filter((e) => e.fqdn !== client.host).map((e) => e.fqdn)]
            setDomains(domains)
        })
    }

    useEffect(() => {
        if (selectedDomains.length === 0) {
            setStreams([])
            setSearchResult([])
            return
        }
        Promise.all(
            selectedDomains.map(async (e) => {
                const streams = await client.getCommonStreams(e)
                return streams.map((stream) => {
                    return {
                        domain: e,
                        stream
                    }
                })
            })
        ).then((e) => {
            const streams = e.flat()
            setStreams(streams)
            setSearchResult(streams)
        })
    }, [selectedDomains])

    const createNewStream = (stream: Commonstream): void => {
        client.api
            .createStream(Schemas.commonstream, stream)
            .then((e: any) => {
                const id: string = e.id
                if (id) navigate('/stream#' + id)
                else enqueueSnackbar('스트림 생성에 실패했습니다.', { variant: 'error' })
            })
            .catch((e) => {
                console.error(e)
                enqueueSnackbar('스트림 생성에 실패했습니다.', { variant: 'error' })
            })
    }

    useEffect(() => {
        load()
    }, [])

    useEffect(() => {
        if (search === '') {
            setSearchResult(streams)
            return
        }
        setSearchResult(
            Fuzzysort.go(search, streams, {
                keys: ['stream.name', 'stream.description']
            }).map((e) => e.obj)
        )
    }, [search])

    if (!client.api.host) return <>loading...</>

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                padding: '20px',
                background: theme.palette.background.paper,
                minHeight: '100%',
                overflowY: 'scroll'
            }}
        >
            <Typography variant="h2" gutterBottom>
                Explorer
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1
                }}
            >
                <Typography variant="h3" gutterBottom>
                    Domains
                </Typography>
                <Box>
                    <IconButton
                        onClick={() => {
                            setSelectedDomains([])
                        }}
                    >
                        <RemoveDoneIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            setSelectedDomains(domains)
                        }}
                    >
                        <DoneAllIcon />
                    </IconButton>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 2
                }}
            >
                {domains.map((e) => {
                    return (
                        <Paper
                            key={e}
                            variant="outlined"
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px',
                                gap: 1,
                                outline: selectedDomains.includes(e)
                                    ? '2px solid ' + theme.palette.primary.main
                                    : 'none'
                            }}
                        >
                            <Typography variant="h4" gutterBottom>
                                {e}
                            </Typography>
                            <Checkbox
                                checked={selectedDomains.includes(e)}
                                onChange={(event) => {
                                    if (event.target.checked) setSelectedDomains([...selectedDomains, e])
                                    else setSelectedDomains(selectedDomains.filter((f) => f !== e))
                                }}
                            />
                        </Paper>
                    )
                })}
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Typography variant="h3" gutterBottom>
                    스트림
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => {
                        setDrawerOpen(true)
                    }}
                >
                    신규 생성
                </Button>
            </Box>
            <TextField
                label="search"
                variant="outlined"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value)
                }}
            />
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 2
                }}
            >
                {searchResult.map((value) => {
                    return (
                        <StreamCard
                            key={value.stream.id}
                            stream={value}
                            isOwner={value.stream.author === client.ccid}
                        />
                    )
                })}
            </Box>
            <CCDrawer
                open={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false)
                }}
            >
                <Box p={1}>
                    <Typography variant="h3" gutterBottom>
                        새로운 스트림 생성
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        당신의 주소{client.api.host}에 새로운 스트림을 생성합니다.
                    </Typography>
                    <Divider />
                    <CCEditor schemaURL={Schemas.commonstream} onSubmit={createNewStream} />
                </Box>
            </CCDrawer>
        </Box>
    )
}
