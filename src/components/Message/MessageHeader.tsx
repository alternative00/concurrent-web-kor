import { Box, Typography, Link, Tooltip } from '@mui/material'
import { TimeDiff } from '../ui/TimeDiff'
import { Link as RouterLink } from 'react-router-dom'
import { useContext, useMemo } from 'react'
import { ApplicationContext } from '../../App'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export interface MessageHeaderProps {
    username?: string
    messageID: string
    authorID: string
    cdate: Date
}

export const MessageHeader = (props: MessageHeaderProps): JSX.Element => {
    const appData = useContext(ApplicationContext)

    const myAck = useMemo(() => {
        return appData.acklist.find((ack) => ack.payload.ccid === props.authorID)
    }, [props.authorID, appData.acklist])

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <Typography
                    component="span"
                    sx={{
                        fontWeight: '700',
                        fontSize: { xs: '0.9rem', sm: '0.95rem' }
                    }}
                >
                    {props.username || 'anonymous'}
                </Typography>
                {myAck && (
                    <Tooltip arrow title="Ackしています" placement="top">
                        <CheckCircleIcon
                            sx={{
                                fontSize: '1rem',
                                color: 'primary.main',
                                marginLeft: '0.25rem'
                            }}
                        />
                    </Tooltip>
                )}
            </Box>
            <Link
                component={RouterLink}
                underline="hover"
                color="inherit"
                fontSize="0.75rem"
                to={`/message/${props.messageID}@${props.authorID}`}
            >
                <TimeDiff date={new Date(props.cdate)} />
            </Link>
        </Box>
    )
}
