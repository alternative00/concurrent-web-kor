import { Box, Button, IconButton, List, ListItem, Switch, Tab, Tabs, TextField, Typography } from '@mui/material'
import { StreamPicker } from './ui/StreamPicker'
import { useEffect, useState } from 'react'
import { usePreference } from '../context/PreferenceContext'
import { type Stream } from '@concurrent-world/client'
import { useApi } from '../context/api'
import { StreamLink, UserStreamLink } from './StreamList/StreamLink'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'

export interface ListSettingsProps {
    id: string
}

export function ListSettings(props: ListSettingsProps): JSX.Element {
    const client = useApi()
    const pref = usePreference()
    const [listName, setListName] = useState<string>('')

    const list = pref.lists[props.id]

    const [options, setOptions] = useState<Stream[]>([])
    const [postStreams, setPostStreams] = useState<Stream[]>([])

    const [tab, setTab] = useState<'stream' | 'user'>('stream')

    useEffect(() => {
        if (props.id) {
            const list = pref.lists[props.id]
            if (list) {
                setListName(list.label)
            }
        }
    }, [props.id])

    useEffect(() => {
        Promise.all(list.streams.map((streamID) => client.getStream(streamID))).then((streams) => {
            setOptions(streams.filter((e) => e !== null) as Stream[])
        })

        Promise.all(list.defaultPostStreams.map((streamID) => client.getStream(streamID))).then((streams) => {
            setPostStreams(streams.filter((stream) => stream !== null) as Stream[])
        })
    }, [props.id])

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                p: 1
            }}
        >
            <Typography variant="h2">리스트 설정</Typography>
            <Typography variant="h3">리스트 이름</Typography>
            <Box display="flex" flexDirection="row">
                <TextField
                    label="list name"
                    variant="outlined"
                    value={listName}
                    sx={{
                        flexGrow: 1
                    }}
                    onChange={(e) => {
                        setListName(e.target.value)
                    }}
                />
                <Button
                    variant="contained"
                    onClick={(_) => {
                        pref.updateList(props.id, {
                            ...list,
                            label: listName
                        })
                    }}
                >
                    Update
                </Button>
            </Box>
            <Typography variant="h3">기본 게시</Typography>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flex: 1
                }}
            >
                <StreamPicker
                    options={options}
                    selected={postStreams}
                    setSelected={(value) => {
                        pref.updateList(props.id, {
                            ...list,
                            defaultPostStreams: value.map((e) => e.id)
                        })
                        setPostStreams(value)
                    }}
                />
            </Box>
            {props.id !== 'home' && (
                <>
                    <Typography variant="h3">리스트 핀</Typography>
                    <Switch
                        checked={list.pinned}
                        onChange={(_) => {
                            pref.updateList(props.id, {
                                ...list,
                                pinned: !list.pinned
                            })
                        }}
                    />
                    <Button
                        variant="contained"
                        color="error"
                        onClick={(_) => {
                            const old = pref.lists
                            delete old[props.id]
                            pref.setLists(JSON.parse(JSON.stringify(old)))
                        }}
                    >
                        리스트 삭제
                    </Button>
                </>
            )}
            <Tabs
                value={tab}
                onChange={(_, value) => {
                    setTab(value)
                }}
                textColor="secondary"
                indicatorColor="secondary"
            >
                <Tab label="스트림" value="stream" />
                <Tab label="사용자자" value="user" />
            </Tabs>
            <List>
                {tab === 'stream' &&
                    list.streams.map((streamID) => (
                        <ListItem
                            key={streamID}
                            disablePadding
                            secondaryAction={
                                <IconButton
                                    onClick={(_) => {
                                        pref.updateList(props.id, {
                                            ...list,
                                            streams: list.streams.filter((e) => e !== streamID)
                                        })
                                    }}
                                >
                                    <PlaylistRemoveIcon />
                                </IconButton>
                            }
                        >
                            <StreamLink streamID={streamID} />
                        </ListItem>
                    ))}
                {tab === 'user' &&
                    list.userStreams.map((userstream) => (
                        <ListItem
                            key={userstream.streamID}
                            disablePadding
                            secondaryAction={
                                <IconButton
                                    onClick={(_) => {
                                        pref.updateList(props.id, {
                                            ...list,
                                            userStreams: list.userStreams.filter(
                                                (e) => e.streamID !== userstream.streamID
                                            )
                                        })
                                    }}
                                >
                                    <PlaylistRemoveIcon />
                                </IconButton>
                            }
                        >
                            <UserStreamLink userHomeStream={userstream} />
                        </ListItem>
                    ))}
            </List>
        </Box>
    )
}
