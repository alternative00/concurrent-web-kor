import { Schemas } from '../../schemas'
import type { Message as CCMessage, StreamElement } from '../../model'
import { useApi } from '../../context/api'
import { createContext, memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { MessageFrame } from './Message/MessageFrame'
import { ReplyMessageFrame } from './Message/ReplyMessageFrame'
import type { SimpleNote } from '../../schemas/simpleNote'
import type { ReplyMessage } from '../../schemas/replyMessage'
import type { ReRouteMessage } from '../../schemas/reRouteMessage'
import { ReRouteMessageFrame } from './Message/ReRouteMessageFrame'
import { MessageSkeleton } from '../MessageSkeleton'
import { Typography } from '@mui/material'

export interface MessageServiceState {
    addFavorite: () => void
    removeFavorite: () => void
    addReaction: (shortcode: string, img: string) => void
    removeReaction: (id: string) => void
    deleteMessage: () => void
}

const MessageServiceContext = createContext<MessageServiceState | undefined>(undefined)

export function useMessageService(): MessageServiceState {
    return useContext(MessageServiceContext) as MessageServiceState
}

interface MultiplexerProps {
    message: StreamElement
    lastUpdated: number
    after: JSX.Element | undefined
}

export const MessageMultiplexer = memo<MultiplexerProps>((props: MultiplexerProps): JSX.Element | null => {
    const api = useApi()
    const [message, setMessage] = useState<CCMessage<SimpleNote | ReplyMessage | ReRouteMessage> | undefined>()
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const loadMessage = useCallback((): void => {
        api.fetchMessage(props.message.id, props.message.currenthost)
            .then((msg) => {
                if (!msg) return
                setMessage(msg)
            })
            .catch((_e) => {
                setMessage(undefined)
            })
            .finally(() => {
                setIsFetching(false)
            })
    }, [props.message.id, props.message.currenthost])

    const reloadMessage = useCallback((): void => {
        api.invalidateMessage(props.message.id)
        loadMessage()
    }, [api, props.message.id])

    const addFavorite = useCallback(async () => {
        if (!message) return
        await api.favoriteMessage(message.id, message.author)
        reloadMessage()
    }, [api, message])

    const removeFavorite = useCallback(async () => {
        const target = message?.associations.find((e) => e.author === api.userAddress && e.schema === Schemas.like)?.id
        if (!message || !target) return
        await api.unFavoriteMessage(target, message.author)
        reloadMessage()
    }, [api, message])

    const deleteMessage = useCallback((): void => {
        if (!message) return
        api.deleteMessage(message.id).then(() => {
            reloadMessage()
        })
    }, [api, message])

    const addReaction = useCallback(
        (shortcode: string, img: string) => {
            if (!message) return
            api.addMessageReaction(message.id, message.author, shortcode, img).then(() => {
                reloadMessage()
            })
        },
        [api, message]
    )

    const removeReaction = useCallback(
        (id: string) => {
            if (!message) return
            api.unFavoriteMessage(id, message.author).then(() => {
                reloadMessage()
            })
        },
        [api, message]
    )

    useEffect(() => {
        loadMessage()
    }, [props.message, props.lastUpdated])

    const services = useMemo(() => {
        return {
            addFavorite,
            removeFavorite,
            addReaction,
            removeReaction,
            deleteMessage
        }
    }, [addFavorite, removeFavorite, addReaction, removeReaction, deleteMessage])

    if (isFetching) {
        return (
            <>
                <MessageSkeleton />
                {props.after}
            </>
        )
    }

    if (!message) return null

    let body
    switch (message?.schema) {
        case Schemas.simpleNote:
            body = <MessageFrame message={message} lastUpdated={props.lastUpdated} reloadMessage={reloadMessage} />
            break
        case Schemas.replyMessage:
            body = <ReplyMessageFrame message={message} lastUpdated={props.lastUpdated} reloadMessage={reloadMessage} />
            break
        case Schemas.reRouteMessage:
            body = (
                <ReRouteMessageFrame message={message} lastUpdated={props.lastUpdated} reloadMessage={reloadMessage} />
            )
            break
        default:
            body = <Typography>unknown schema: {message?.schema}</Typography>
            break
    }

    return (
        <MessageServiceContext.Provider value={services}>
            {body}
            {props.after}
        </MessageServiceContext.Provider>
    )
})

MessageMultiplexer.displayName = 'MessageMultiplexer'
