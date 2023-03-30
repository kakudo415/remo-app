import Link from 'next/link'
import { BaseDirectory, readTextFile, writeTextFile } from '@tauri-apps/api/fs'

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
        <Link href='/'>戻る</Link>
      </header>
      <main>
        <h1>設定</h1>
        <form onSubmit={updateConfig}>
          <input type="text" name="accessToken" id="accessToken" defaultValue={config.accessToken} />
          <button type="submit">読み込む</button>
        </form>
      </main>
    </>
  )
}
