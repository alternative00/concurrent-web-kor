import { type FallbackProps } from 'react-error-boundary'

export function EmergencyKit({ error }: FallbackProps): JSX.Element {
    const gracefulResetLocalStorage = (): void => {
        for (const key in localStorage) {
            if (['PrivateKey', 'PublicKey', 'ServerAddress'].includes(key)) continue
            localStorage.removeItem(key)
        }
    }

    const resetAllLocalstorage = (): void => {
        for (const key in localStorage) {
            localStorage.removeItem(key)
        }
    }

    return (
        <>
            <h1>Emergency!</h1>
            알 수 없는 오류가 발생하였습니다.
            <br />
            {error?.message}
            <button
                style={{ height: '100px', width: '100%' }}
                onClick={(): void => {
                    window.location.reload()
                }}
            >
                우선 새로고침하기
            </button>
            <h2>Medical Kit</h2>
            <div>3回새로고침으로도 해결이 되지 않는다면↓</div>
            <div>
                <button onClick={gracefulResetLocalStorage}>
                    계정 정보 이외의 localstorage 모두 초기화하기
                </button>
            </div>
            <div>
                <button onClick={resetAllLocalstorage}>localStorage 전체 초기화</button>
            </div>
            <h2>Debug Info</h2>
            <pre>{error ? error.stack : '존재하지 않습니다.'}</pre>
        </>
    )
}
