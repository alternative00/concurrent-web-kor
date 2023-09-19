import { Box, Divider, List, Paper, Tab, Tabs } from '@mui/material'
import { TimelineHeader } from '../TimelineHeader'

import ListIcon from '@mui/icons-material/List'
import { MessageView } from '../Message/MessageView'
import { Schemas } from '@concurrent-world/client'
import { useEffect, useState } from 'react'

const basicMessage = {
    id: '0',
    schema: Schemas.simpleNote,
    author: {
        ccid: '',
        tag: '',
        domain: '',
        cdate: '',
        certs: [],
        score: 0
    },
    cdate: new Date(),
    streams: [],
    favorites: [],
    reactions: [],
    replies: [],
    reroutes: [],
    body: 'Hello, World!'
}

export default function AppMock(): JSX.Element {
    const [tab, setTab] = useState(0)
    const data = mockData[tab]

    useEffect(() => {
        const interval = setInterval(() => {
            setTab((tab) => (tab + 1) % mockData.length)
        }, 5000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <Paper
            sx={{
                flexGrow: '1',
                margin: { xs: 0.5, sm: 1 },
                mb: { xs: 0, sm: '10px' },
                display: 'flex',
                flexFlow: 'column',
                borderRadius: 2,
                overflow: 'hidden',
                background: 'none',
                backgroundColor: 'background.paper'
            }}
        >
            <TimelineHeader title={data.listTitle} titleIcon={<ListIcon />} />

            <Tabs value={tab} textColor="secondary" indicatorColor="secondary">
                {mockData.map((e) => (
                    <Tab key={e.listTitle} label={e.listTitle} />
                ))}
            </Tabs>
            <Box
                sx={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    py: { xs: 1, sm: 1 },
                    px: { xs: 1, sm: 2 }
                }}
            >
                <List sx={{ flex: 1, width: '100%' }}>
                    {data.timeline.map((message, i) => (
                        <>
                            <MessageView key={i} message={message} userCCID="" />
                            <Divider />
                        </>
                    ))}
                </List>
            </Box>
        </Paper>
    )
}

const mockData = [
    {
        listTitle: '홈',
        timeline: [
            {
                ...basicMessage,
                author: {
                    ccid: 'solitudeSam',
                    tag: '',
                    domain: '',
                    cdate: '',
                    certs: [],
                    score: 0
                },
                profileOverride: {
                    username: 'solitudeSam'
                },
                body: '지금의 적막감이 정말 좋다. 휴일엔 혼자가 역시 최고지!'
            },
            {
                ...basicMessage,
                author: {
                    ccid: 'geekyTom',
                    tag: '',
                    domain: '',
                    cdate: '',
                    certs: [],
                    score: 0
                },
                profileOverride: {
                    username: 'geekyTom'
                },
                body: '음악하면 요즘 애니송이 머리 속에서 떠나질 않아. 들으면 뭔가 신남!',
           },
            {
                ...basicMessage,
                author: {
                    ccid: 'cozyCara',
                    tag: '',
                    domain: '',
                    cdate: '',
                    certs: [],
                    score: 0
                },
                profileOverride: {
                    username: 'cozyCara'
                },
                body: '낮 12시 음악 선택, 오늘은 뭘 듣지? 고민하지말자!'
            },
            {
                ...basicMessage,
                author: {
                    ccid: 'bookwormLiz',
                    tag: '',
                    domain: '',
                    cdate: '',
                    certs: [],
                    score: 0
                },
                profileOverride: {
                    username: 'bookwormLiz'
                },
                body: '새 책 도착! 커피 한잔과 주말에 독서, 최고의 순간.'
            },
            {
                ...basicMessage,
                author: {
                    ccid: 'geekyTom',
                    tag: '',
                    domain: '',
                    cdate: '',
                    certs: [],
                    score: 0
                },
                profileOverride: {
                    username: 'geekyTom'
                },
                body: '드라마 첫방이네, 본방 사수각 떳다!'
            }
        ]
    },
    {
        listTitle: '겜커런트트',
        timeline: [
            {
                ...basicMessage,
                author: {
                    ccid: 'MechaMaster88',
                    tag: '',
                    domain: '',
                    cdate: '',
                    certs: [],
                    score: 0
                },
                profileOverride: {
                    username: 'MechaMaster88'
                },
                body: '<용의 전설> 세이브 파일 날라감...'
            },
            {
                ...basicMessage,
                author: {
                    ccid: 'CtrlAltDefeat_',
                    tag: '',
                    domain: '',
                    cdate: '',
                    certs: [],
                    score: 0
                },
                profileOverride: {
                    username: 'CtrlAltDefeat_'
                },
                body: '새로 나온 VR게임 몰입감 쩌네 ㄷㄷ'
            },
            {
                ...basicMessage,
                author: {
                    ccid: 'GamerGalaxy_',
                    tag: '',
                    domain: '',
                    cdate: '',
                    certs: [],
                    score: 0
                },
                profileOverride: {
                    username: 'GamerGalaxy_'
                },
                body: '아까 연계 좋았다, 다음 판도 이렇게 가자!'
            },
            {
                ...basicMessage,
                author: {
                    ccid: 'retroReveler',
                    tag: '',
                    domain: '',
                    cdate: '',
                    certs: [],
                    score: 0
                },
                profileOverride: {
                    username: 'retroReveler'
                },
                body: '古いアーケードゲームを発見。コイン入れてプレイする感覚、懐かしい。'
            },
            {
                ...basicMessage,
                author: {
                    ccid: 'bitBard',
                    tag: '',
                    domain: '',
                    cdate: '',
                    certs: [],
                    score: 0
                },
                profileOverride: {
                    username: 'bitBard'
                },
                body: 'ゲームのOST集めるのが趣味。今日は新しい1枚ゲット！'
            }
        ]
    },
    {
        listTitle: 'ごはん',
        timeline: [
            {
                ...basicMessage,
                author: {
                    ccid: 'TofuTribe',
                    tag: '',
                    domain: '',
                    cdate: '',
                    certs: [],
                    score: 0
                },
                profileOverride: {
                    username: 'TofuTribe'
                },
                body: '手作りのビーガン料理に挑戦中。今日はトマトとキヌアのサラダ。'
            },
            {
                ...basicMessage,
                author: {
                    ccid: 'SpiceSeeker_',
                    tag: '',
                    domain: '',
                    cdate: '',
                    certs: [],
                    score: 0
                },
                profileOverride: {
                    username: 'SpiceSeeker_'
                },
                body: '新しいスパイスショップを発見！エキゾチックな味で実験開始。'
            },
            {
                ...basicMessage,
                author: {
                    ccid: 'NoodleNomad',
                    tag: '',
                    domain: '',
                    cdate: '',
                    certs: [],
                    score: 0
                },
                profileOverride: {
                    username: 'NoodleNomad'
                },
                body: '今日のラーメン、絶品だった。辛さがちょうど良い。'
            },
            {
                ...basicMessage,
                author: {
                    ccid: 'BrewedLife',
                    tag: '',
                    domain: '',
                    cdate: '',
                    certs: [],
                    score: 0
                },
                profileOverride: {
                    username: 'BrewedLife'
                },
                body: '自家製のコールドブリュー、夏の定番。コーヒー豆の選び方が鍵。'
            },
            {
                ...basicMessage,
                author: {
                    ccid: 'CrispyCritic_',
                    tag: '',
                    domain: '',
                    cdate: '',
                    certs: [],
                    score: 0
                },
                profileOverride: {
                    username: 'CrispyCritic_'
                },
                body: 'お店で食べた焼き鳥、外はサクサク、中はジューシー。次は友達を連れて行く！'
            }
        ]
    }
]
