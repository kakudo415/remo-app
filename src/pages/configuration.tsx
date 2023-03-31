import Link from 'next/link'
import { BaseDirectory, readTextFile, writeTextFile } from '@tauri-apps/api/fs'
import styles from '@/styles/Configuration.module.css'

import { getConfig, saveConfig, Config } from '../libs/config'
import { useEffect, useState } from 'react'

export default function Configuration() {
  async function updateConfig(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const accessToken = event.currentTarget.accessToken.value
    const appliances = await fetch('https://api.nature.global/1/appliances', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).then(res => res.json())
    saveConfig(accessToken, appliances)
  }

  const [config, setConfig] = useState<Config>({ accessToken: "", appliances: [] })
  useEffect(() => {
    getConfig()
      .then((conf) => {
        setConfig(conf);
      })
  }, [])

  return (
    <>
      <header>
        <div>
          <Link href='/' className={styles.home}><img src="/images/icons/home.png" alt="Home" /></Link>
        </div>
      </header>
      <main>
        <form onSubmit={updateConfig} className={styles.updateConfigForm}>
          <label htmlFor="accessToken">Access Token</label>
          <input type="text" name="accessToken" id="accessToken" defaultValue={config.accessToken} />
          <p>Access Tokenは<a href="https://home.nature.global/">home.nature.global</a>から取得してください</p>
          <button type="submit">読み込む</button>
        </form>
      </main>
    </>
  )
}
