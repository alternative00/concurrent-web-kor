import { Box, IconButton, ListItem, Paper, Tooltip } from '@mui/material'
import { Link as routerLink } from 'react-router-dom'
import { CCAvatar } from '../ui/CCAvatar'
import { SimpleNote } from './SimpleNote'
import { MessageHeader } from './MessageHeader'
import { MessageActions } from './MessageActions'
import { MessageReactions } from './MessageReactions'
import { MessageUrlPreview } from './MessageUrlPreview'
import { UserProfileCard } from '../UserProfileCard'
import { type Message, type ReplyMessageSchema, type SimpleNoteSchema } from '@concurrent-world/client'
import { PostedStreams } from './PostedStreams'

export interface MessageViewProps {
    message: Message<SimpleNoteSchema | ReplyMessageSchema>
    userCCID: string
    beforeMessage?: JSX.Element
    lastUpdated?: number
}

export const MessageView = (props: MessageViewProps): JSX.Element => {
    return (
        <ListItem
            sx={{
                wordBreak: 'break-word',
                alignItems: 'flex-start',
                flex: 1,
                gap: { xs: 1, sm: 2 }
            }}
            disablePadding
        >
            {props.message && (
                <>
                    <Tooltip
                        enterDelay={500}
                        enterNextDelay={500}
                        leaveDelay={300}
                        placement="top"
                        components={{
                            Tooltip: Paper
                        }}
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    p: 1,
                                    m: 1,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    minWidth: '300px'
                                }
                            }
                        }}
                        title={<UserProfileCard user={props.message.authorUser} />}
                    >
                        <IconButton
                            sx={{
                                width: { xs: '38px', sm: '48px' },
                                height: { xs: '38px', sm: '48px' },
                                mt: { xs: '3px', sm: '5px' }
                            }}
                            component={routerLink}
                            to={props.message.payload.body.profileOverride?.link ?? '/entity/' + props.message.author}
                            target={props.message.payload.body.profileOverride?.link ? '_blank' : undefined}
                            rel={props.message.payload.body.profileOverride?.link ? 'noopener noreferrer' : undefined}
                        >
                            <CCAvatar
                                alt={props.message.authorUser?.profile?.payload.body.username}
                                avatarURL={props.message.authorUser?.profile?.payload.body.avatar}
                                avatarOverride={props.message.payload.body.profileOverride?.avatar}
                                identiconSource={props.message.author}
                                sx={{
                                    width: { xs: '38px', sm: '48px' },
                                    height: { xs: '38px', sm: '48px' }
                                }}
                            />
                        </IconButton>
                    </Tooltip>
                    <Box
                        sx={{
                            display: 'flex',
                            flex: 1,
                            flexDirection: 'column',
                            width: '100%',
                            overflow: 'auto'
                        }}
                    >
                        <MessageHeader message={props.message} />
                        {props.beforeMessage}
                        <SimpleNote message={props.message} />
                        <MessageUrlPreview messageBody={props.message.payload.body.body} />
                        <MessageReactions message={props.message} />
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row-reverse',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: 1,
                                flexWrap: 'wrap'
                            }}
                        >
                            <PostedStreams message={props.message} />
                            <MessageActions message={props.message} userCCID={props.userCCID} />
                        </Box>
                    </Box>
                </>
            )}
        </ListItem>
    )
}
