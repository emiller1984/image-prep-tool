const API_URL = `${import.meta.env.BASE_URL}api/presets.php`

export async function fetchPresets() {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return data.items || []
}

export async function publishPresets(presets) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: presets }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
