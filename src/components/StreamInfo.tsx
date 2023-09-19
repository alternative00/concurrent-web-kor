import { Box, Button, Divider, FormControlLabel, FormGroup, Paper, Switch, TextField, Typography } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useApi } from '../context/api'
import { type Commonstream, type CoreStream } from '@concurrent-world/client'
import Background from '../resources/defaultbg.png'
import { CCEditor } from './ui/cceditor'
import { useSnackbar } from 'notistack'
import { AddListButton } from './AddListButton'

export interface StreamInfoProps {
    id: string
}

export function StreamInfo(props: StreamInfoProps): JSX.Element {
    const client = useApi()
    const { enqueueSnackbar } = useSnackbar()
    const [stream, setStream] = useState<CoreStream<Commonstream>>()
    const isAuthor = stream?.author === client.ccid

    const [visible, setVisible] = useState(false)
    const [writerDraft, setWriterDraft] = useState('')
    const [readerDraft, setReaderDraft] = useState('')

    const [schemaDraft, setSchemaDraft] = useState('')

    useEffect(() => {
        if (!props.id) return
        client.api.readStream(props.id).then((e) => {
            if (!e) return
            setStream(e)
            setVisible(e.visible)
            setWriterDraft(e.writer.join('\n'))
            setReaderDraft(e.reader.join('\n'))
            setSchemaDraft(e.schema)
        })
    }, [props.id])

    const updateStream = useCallback(
        (body: Commonstream) => {
            if (!stream) return
            client.api
                .updateStream(props.id, {
                    schema: schemaDraft,
                    body,
                    maintainer: stream.maintainer,
                    writer: writerDraft.split('\n').filter((e) => e),
                    reader: readerDraft.split('\n').filter((e) => e),
                    visible
                })
                .then((_) => {
                    enqueueSnackbar('업데이트', { variant: 'success' })
                })
                .catch((_) => {
                    enqueueSnackbar('업데이트 실패', { variant: 'error' })
                })
        },
        [client.api, stream, writerDraft, readerDraft, schemaDraft, props.id, visible, enqueueSnackbar]
    )

    if (!stream) {
        return <>stream information not found</>
    }

    return (
        <>
            <Box
                sx={{
                    padding: '20px',
                    display: 'flex',
                    backgroundImage: `url(${stream.payload.body.banner || Background})`,
                    backgroundPosition: 'center',
                    objectFit: 'cover',
                    gap: '10px'
                }}
            >
                <Paper sx={{ flex: 2, padding: '20px' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <Typography variant="h1">{stream.payload.body.name}</Typography>
                        <AddListButton stream={props.id} />
                    </Box>
                    <Typography variant="caption">{props.id}</Typography>
                    <Divider />
                    <Typography>{stream.payload.body.description || '아직 설명이 없습니다.'}</Typography>
                </Paper>
            </Box>
            {isAuthor && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        p: 1
                    }}
                >
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={visible}
                                    onChange={(e) => {
                                        setVisible(e.target.checked)
                                    }}
                                />
                            }
                            label="검색 가능"
                        />
                    </FormGroup>
                    <Typography variant="h3">권한</Typography>
                    <Box>
                        <Typography>비워두면 퍼블릭 모드로 자동설정됩니다.</Typography>
                        <Typography>줄바꿈을 통해 여러명 지정이 가능합니다.</Typography>
                    </Box>
                    <TextField
                        label="writer"
                        multiline
                        value={writerDraft}
                        onChange={(e) => {
                            setWriterDraft(e.target.value)
                        }}
                    />
                    <TextField
                        label="reader"
                        multiline
                        value={readerDraft}
                        onChange={(e) => {
                            setReaderDraft(e.target.value)
                        }}
                    />
                    <Typography variant="h3">스키마</Typography>
                    ※기본적으로 변경하실 필요는 없습니다.
                    <TextField
                        label="Schema"
                        value={schemaDraft}
                        onChange={(e) => {
                            setSchemaDraft(e.target.value)
                        }}
                    />
                    <Box>
                        <Typography variant="h3">속성</Typography>
                        <CCEditor schemaURL={schemaDraft} init={stream.payload.body} onSubmit={updateStream} />
                    </Box>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            client.api.deleteStream(props.id).then((_) => {
                                enqueueSnackbar('삭제되었습니다.', { variant: 'success' })
                            })
                        }}
                    >
                        삭제
                    </Button>
                </Box>
            )}
        </>
    )
}
