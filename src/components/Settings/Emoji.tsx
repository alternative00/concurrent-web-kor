import { Box, IconButton, Paper, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import { usePreference } from '../../context/PreferenceContext'
import { type EmojiPackage, type RawEmojiPackage } from '../../model'

import AddCircleIcon from '@mui/icons-material/AddCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useSnackbar } from 'notistack'
import { useLocation } from 'react-router-dom'

export const EmojiSettings = (): JSX.Element => {
    const pref = usePreference()
    const path = useLocation()
    const { enqueueSnackbar } = useSnackbar()

    const [addingPackageURL, setAddingPackageURL] = useState<string>('')
    const [packages, setPackages] = useState<EmojiPackage[]>([])
    const [preview, setPreview] = useState<EmojiPackage | null>(null)

    useEffect(() => {
        const emojiURL = path.hash.slice(1)
        if (emojiURL?.startsWith('http')) {
            setAddingPackageURL(emojiURL)
        }
    }, [path.hash])

    useEffect(() => {
        Promise.all(
            pref.emojiPackages.map((url) =>
                fetch(url)
                    .then((j) => j.json())
                    .then((p: RawEmojiPackage) => ({ ...p, packageURL: url }))
            )
        ).then((packages: EmojiPackage[]) => {
            setPackages(packages)
        })
    }, [pref.emojiPackages])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (addingPackageURL) {
                fetch(addingPackageURL)
                    .then((j) => j.json())
                    .then((p: RawEmojiPackage) => {
                        setPreview({ ...p, packageURL: addingPackageURL })
                    })
                    .catch(() => {
                        setPreview(null)
                        enqueueSnackbar('패키지를 찾을 수 없습니다.', { variant: 'error' })
                    })
            } else {
                setPreview(null)
            }
        }, 500)
        return () => {
            clearTimeout(timer)
        }
    }, [addingPackageURL])

    return (
        <>
            <Typography variant="h3">이모지 팩</Typography>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 2
                }}
            >
                {packages.map((e) => {
                    return (
                        <Paper
                            key={e.iconURL}
                            variant="outlined"
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: '10px',
                                ga지 팩URL"
                placeholder="https://example.com/emoji.zip"
                value={addingPackageURL}
                onChange={(e) => {
                    setAddingPackageURL(e.target.value)
                }}
            />
        </>
    )
}
