'use client'

import styles from './page.module.css'
import MessageFetcher from '../components/MessageFetcher'

export default function Home() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <MessageFetcher />
            </main>
        </div>
    )
}