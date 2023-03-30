import { useEffect, useState } from 'react'
import { BaseDirectory, readTextFile, writeTextFile } from '@tauri-apps/api/fs'

export type Config = {
  accessToken: string
  appliances: Appliance[]
}

type Appliance = {
  id: string
  device: object
  model: object
  type: string
  nickname: string
  image: string
  settings: object
  aircon: object
  signals: object[]
  light: {
    buttons: {
      name: string
      image: string
      label: string
    }[]
    state: object
  }
}

export async function getConfig(): Promise<Config> {
  try {
    const content = await readTextFile('config.json', { dir: BaseDirectory.AppConfig })
    return JSON.parse(content)
  } catch (_) {
    return { accessToken: '', appliances: [] }
  }
}

export async function saveConfig(accessToken: string, appliances: Appliance[]) {
  let config = await getConfig()
  config.accessToken = accessToken
  config.appliances = appliances
  await writeTextFile('config.json', JSON.stringify(config), { dir: BaseDirectory.AppConfig })
}
