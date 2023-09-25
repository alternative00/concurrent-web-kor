import { Mnemonic, randomBytes, HDNodeWallet } from 'ethers'
import { LangJa } from './utils/lang-ja'

import { useTranslation } from 'react-i18next'

export interface Identity {
    mnemonic: string
    privateKey: string
    publicKey: string
    CCID: string
}

export const generateIdentity = (): Identity => {
    const entrophy = randomBytes(16)
    const mnemonic = Mnemonic.fromEntropy(entrophy, null, LangJa.wordlist())
    const wallet = HDNodeWallet.fromPhrase(mnemonic.phrase, undefined, undefined, LangJa.wordlist())
    const CCID = 'CC' + wallet.address.slice(2)
    const privateKey = wallet.privateKey.slice(2)
    const publicKey = wallet.publicKey.slice(2)

    return {
        mnemonic: mnemonic.phrase,
        privateKey,
        publicKey,
        CCID
    }
}

export const fetchWithTimeout = async (
    url: RequestInfo,
    init: RequestInit,
    timeoutMs = 15 * 1000
): Promise<Response> => {
    const controller = new AbortController()
    const clientTimeout = setTimeout(() => {
        controller.abort()
    }, timeoutMs)

    try {
        const reqConfig: RequestInit = { ...init, signal: controller.signal }
        const res = await fetch(url, reqConfig)
        if (!res.ok) {
            const description = `${res.status}: ${url as string} traceID: ${res.headers.get('trace-id') ?? 'N/A'}`
            return await Promise.reject(new Error(description))
        }

        return res
    } catch (e: unknown) {
        if (e instanceof Error) {
            return await Promise.reject(new Error(`${e.name}: ${e.message}`))
        } else {
            return await Promise.reject(new Error('fetch failed with unknown error'))
        }
    } finally {
        clearTimeout(clientTimeout)
    }
}

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export const humanReadableTimeDiff = (time: Date): string => {
    const current = new Date()
    const msPerMinute = 60 * 1000
    const msPerHour = msPerMinute * 60
    const msPerDay = msPerHour * 24

    const elapsed = current.getTime() - time.getTime()

    const { t } = useTranslation('', { keyPrefix: 'time' })

    if (elapsed < msPerMinute) {
        return `${Math.round(elapsed / 1000)}${t('secondsBefore')}`
    } else if (elapsed < msPerHour) {
        return `${Math.round(elapsed / msPerMinute)}${t('minutesBefore')}`
    } else if (elapsed < msPerDay) {
        return `${Math.round(elapsed / msPerHour)}${t('hoursBefore')}`
    } else {
        return (
            (current.getFullYear() === time.getFullYear() ? '' : `${time.getFullYear()}년`) +
            `${String(time.getMonth() + 1).padStart(2, '0')}월` +
            `${String(time.getDate()).padStart(2, '0')}일` +
            `${String(time.getHours()).padStart(2, '0')}시` +
            `${String(time.getMinutes()).padStart(2, '0')}분`
        )
    }
}
