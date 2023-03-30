import Link from 'next/link'

export default function Home() {  
  return (
    <>
      <header>
        <Link href='/config'>設定</Link>
      </header>
      <main>
        <ul>
          {
            appliances.map((appliance) => {
              switch (appliance.type) {
                case 'AC':
                  if (appliance.aircon) {
                    return (
                      <li>
                        <h2>{appliance.nickname}</h2>
                        <input type="range" name="temp" id="temp" />
                      </li>
                    )
                  }
                case 'LIGHT':
                  if (appliance.light) {
                    return (
                      <li>
                        <h2>{appliance.nickname}</h2>
                        {
                          appliance.light.buttons.map((button) => {
                            return (
                              <button onClick={() => sendLightSignal(accessToken, appliance.id, button.name)}>{button.label}</button>
                            )
                          })
                        }
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
