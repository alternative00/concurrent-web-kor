import { Box, Button, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useApi } from '../../context/api'
import { useSnackbar } from 'notistack'
import { Schemas } from '@concurrent-world/client'
import { usePreference } from '../../context/PreferenceContext'

export const ApSetup = (): JSX.Element => {
    const client = useApi()
    const pref = usePreference()
    const [userID, setUserID] = useState('')
    const { enqueueSnackbar } = useSnackbar()

    const [loading, setLoading] = useState<boolean>(false)
    const [entityFound, setEntityFound] = useState<boolean>(false)

    useEffect(() => {
        setLoading(true)
        const timer = setTimeout(() => {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'content-type': 'application/json'
                }
            }
            client.api
                .fetchWithCredential(client.api.host, `/ap/api/person/${userID}`, requestOptions)
                .then(async (res) => await res.json())
                .then((profile) => {
                    console.log('profile', profile)
                    setEntityFound(true)
                })
                .catch((_e) => {
                    setEntityFound(false)
                })
                .finally(() => {
                    setLoading(false)
                })
        }, 300)

        return () => {
            clearTimeout(timer)
        }
    }, [userID])

    const register = async (): Promise<void> => {
        if (!client) {
            return
        }

        const foll은(는) 사용할 수 있습니다' : ''
                }
            />
            {entityFound && (
                <Typography>
                    이 사용자는 이미 등록되어 있습니다.
                    <br />
                    다른 ID를 사용하세요.
                </Typography>
            )}
            <Button
                variant="contained"
                onClick={() => {
                    register()
                }}
                disabled={userID.length === 0 || !userID.match(/^[a-zA-Z0-9_]+$/) || entityFound || loading}
            >
                {loading ? '확인중중...' : '등록록'}
            </Button>
        </Box>
    )
}
