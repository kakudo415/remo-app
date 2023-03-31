import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from '@/styles/Home.module.css'

import { Config, getConfig } from '../libs/config'

export default function Home() {
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
          <Link href='/configuration' className={styles.config}><img src="/images/icons/gear.png" alt="Gear" /></Link>
        </div>
      </header>
      <main>
        <ul className={styles.controllers}>
          {
            config.appliances.map((appliance) => {
              switch (appliance.type) {
                case 'AC':
                  if (appliance.aircon) {
                    return (
                      <li>
                        <h2>🌡️ {appliance.nickname}</h2>
                        <div className={styles.controller}>
                          <input type="range" name="temp" id="temp" />
                        </div>
                      </li>
                    )
                  }
                case 'LIGHT':
                  if (appliance.light) {
                    return (
                      <li>
                        <h2>💡 {appliance.nickname}</h2>
                        <div className={styles.controller}>
                          <div className={styles.buttons}>
                            {
                              appliance.light.buttons.map((button) => {
                                return (
                                  <div className={styles.button} key={button.name}>
                                    <button onClick={() => sendLightSignal(config.accessToken, appliance.id, button.name)}>
                                      <img src={`/images/icons/${button.image}.png`} alt={button.image} />
                                    </button>
                                    <span>{tidyName(button.name)}</span>
                                  </div>
                                )
                              })
                            }
                          </div>
                        </div>
                      </li>
                    )
                  }
              }
            })
          }
        </ul>
      </main>
    </>
  )
}

function sendLightSignal(accessToken: string, applianceID: string, buttonName: string) {
  fetch(`https://api.nature.global/1/appliances/${applianceID}/light`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `button=${buttonName}`,
  }).then((res) => {
    console.log(res);
  });
}

function tidyName(name: string): string {
  switch (name) {
    case 'on': return 'ON'
    case 'off': return 'OFF'
    case 'on-100': return '全灯'
    case 'on-favorite': return 'お気に入り'
    case 'night': return '常夜灯'
    case 'bright-up': return '明るく'
    case 'bright-down': return '暗く'
    case 'colortemp-up': return '色を温かく'
    case 'colortemp-down': return '色を冷たく'
    default: return name
  }
}
