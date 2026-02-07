# PHUKHAO ORACLE - Code Snippets

## 1. Project Configuration

### Astro Config (`landing/astro.config.mjs`)
Static output with Cloudflare Workers adapter. Hybrid rendering via `export const prerender = false` in dynamic routes.

```javascript
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  vite: { plugins: [tailwindcss()] },
  integrations: [react()]
});
```

### Wrangler Config (`landing/wrangler.toml`)
```toml
name = "phukhao-landing"
compatibility_date = "2025-06-01"
compatibility_flags = ["nodejs_compat"]
account_id = "a5eabdc2b11aae9bd5af46bd6a88179e"
workers_dev = true

routes = [
  { pattern = "phukhao.buildwithoracle.com", custom_domain = true }
]

[assets]
directory = "./dist"
```

---

## 2. SIWE Authentication (`landing/src/lib/auth.ts`)

### Signature Verification
Uses viem's SIWE utilities for EIP-4361 message parsing and signature verification.

```typescript
import { generateSiweNonce, parseSiweMessage, validateSiweMessage } from 'viem/siwe'
import { verifyMessage } from 'viem'

export async function verifySiweSignature(
  message: string,
  signature: `0x${string}`,
  expectedNonce?: string,
  expectedDomain?: string
): Promise<{ valid: boolean; address?: string; nonce?: string; error?: string }> {
  try {
    const parsed = parseSiweMessage(message)

    const isValidMessage = validateSiweMessage({
      message: parsed,
      nonce: expectedNonce,
      domain: expectedDomain,
      time: new Date()
    })

    if (!isValidMessage) {
      return { valid: false, error: 'Message validation failed (nonce, domain, or time)' }
    }

    const isValidSignature = await verifyMessage({
      address: parsed.address as `0x${string}`,
      message,
      signature
    })

    if (!isValidSignature) {
      return { valid: false, error: 'Signature verification failed' }
    }

    // Additional check: message not too old
    if (parsed.issuedAt) {
      const issuedAt = new Date(parsed.issuedAt).getTime()
      if (Date.now() - issuedAt > 5 * 60 * 1000) {
        return { valid: false, error: 'Message too old' }
      }
    }

    return { valid: true, address: parsed.address, nonce: parsed.nonce }
  } catch (err) {
    return { valid: false, error: err instanceof Error ? err.message : 'Verification failed' }
  }
}
```

### HMAC Signing (Web Crypto API — Cloudflare Workers compatible)
```typescript
async function hmacSign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(data)

  const key = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', key, messageData)

  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
```

### Session Cookie Creation
```typescript
export function createSessionCookie(token: string, secure: boolean = true): string {
  const maxAge = 24 * 60 * 60 // 24 hours in seconds
  const parts = [
    `phukhao_session=${token}`,
    `Max-Age=${maxAge}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict'
  ]
  if (secure) parts.push('Secure')
  return parts.join('; ')
}
```

---

## 3. API Routes

### Nonce Generation (`landing/src/pages/api/auth/nonce.ts`)
```typescript
import type { APIContext } from 'astro'
import { generateSiweNonce } from '../../../lib/auth'

export const prerender = false

export async function GET({ locals }: APIContext) {
  const nonce = generateSiweNonce()
  const runtime = (locals as any).runtime
  const kv = runtime?.env?.NONCE_KV

  if (kv) {
    await kv.put(`nonce:${nonce}`, JSON.stringify({ created: Date.now() }), {
      expirationTtl: 300 // 5 minutes
    })
  }

  return new Response(JSON.stringify({ nonce }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  })
}
```

### Verify Signature (`landing/src/pages/api/auth/verify.ts`)
```typescript
export async function POST({ request, locals, url }: APIContext) {
  const { message, signature } = await request.json()
  const runtime = (locals as any).runtime
  const kv = runtime?.env?.NONCE_KV
  const jwtSecret = runtime?.env?.JWT_SECRET || 'dev-secret-change-in-production'

  const result = await verifySiweSignature(message, signature, undefined, url.hostname)

  if (!result.valid || !result.address) {
    return new Response(JSON.stringify({ error: result.error }), { status: 401 })
  }

  // Verify nonce exists + delete (single-use)
  if (kv && result.nonce) {
    const nonceData = await kv.get(`nonce:${result.nonce}`)
    if (!nonceData) return new Response(JSON.stringify({ error: 'Invalid nonce' }), { status: 401 })
    await kv.delete(`nonce:${result.nonce}`)
  }

  const token = await createSessionToken(result.address, jwtSecret)
  const isProduction = url.protocol === 'https:'

  return new Response(JSON.stringify({ authenticated: true, address: result.address }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': createSessionCookie(token, isProduction)
    }
  })
}
```

---

## 4. State Management (`landing/src/stores/auth.ts`)

### Nanostores Atoms + Computed
```typescript
import { atom, computed } from 'nanostores'

export const $userAddress = atom<string | null>(null)
export const $isConnecting = atom(false)
export const $authError = atom<string | null>(null)

export const $isAuthenticated = computed($userAddress, (address) => !!address)
export const $shortAddress = computed($userAddress, (address) => {
  if (!address) return null
  return `${address.slice(0, 6)}...${address.slice(-4)}`
})
```

### Wallet Connection Flow
```typescript
export async function connectWallet(): Promise<void> {
  const ethereum = (window as any).ethereum
  if (!ethereum) {
    $authError.set('No Ethereum wallet found. Please install MetaMask.')
    return
  }

  $isConnecting.set(true)
  $authError.set(null)

  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    const address = accounts[0] as string

    const { nonce } = await (await fetch('/api/auth/nonce')).json()

    // EIP-4361 formatted message
    const message = [
      `${window.location.host} wants you to sign in with your Ethereum account:`,
      address, '', 'Sign in to Phukhao Oracle', '',
      `URI: ${window.location.origin}`,
      `Version: 1`, `Chain ID: 1`,
      `Nonce: ${nonce}`,
      `Issued At: ${new Date().toISOString()}`
    ].join('\n')

    const signature = await ethereum.request({
      method: 'personal_sign', params: [message, address]
    })

    const result = await (await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ message, signature })
    })).json()

    if (result.authenticated) $userAddress.set(result.address)
    else throw new Error(result.error || 'Authentication failed')
  } catch (error) {
    $authError.set(error instanceof Error ? error.message : 'Connection failed')
  } finally {
    $isConnecting.set(false)
  }
}
```

---

## 5. React Components

### ConnectWallet (`landing/src/components/ConnectWallet.tsx`)
```tsx
import { useStore } from '@nanostores/react'
import { useEffect } from 'react'
import { $userAddress, $isConnecting, $authError, $shortAddress,
         checkSession, connectWallet, disconnectWallet } from '../stores/auth'

export default function ConnectWallet() {
  const address = useStore($userAddress)
  const isConnecting = useStore($isConnecting)
  const error = useStore($authError)
  const shortAddress = useStore($shortAddress)

  useEffect(() => { checkSession() }, [])

  if (address) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-lg bg-cyan-500/10 px-3 py-1.5 text-xs font-mono text-cyan-400 ring-1 ring-cyan-500/30">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          {shortAddress}
        </span>
        <button onClick={disconnectWallet}
          className="rounded-lg px-3 py-1.5 text-xs font-mono text-gray-400 ring-1 ring-gray-700 transition hover:bg-gray-800 hover:text-gray-200 cursor-pointer">
          EXIT
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={connectWallet} disabled={isConnecting}
        className="rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-1.5 text-xs font-mono text-black font-bold transition hover:scale-105 disabled:opacity-50 cursor-pointer">
        {isConnecting ? 'CONNECTING...' : 'CONNECT'}
      </button>
      {error && <p className="text-xs text-red-400 max-w-[150px] truncate">{error}</p>}
    </div>
  )
}
```

---

## 6. Styling & Theme (`landing/src/styles/global.css`)

### Cyber Theme Variables
```css
@import "tailwindcss";

@theme {
  --color-neon-cyan: #00fff2;
  --color-neon-purple: #bf00ff;
  --color-neon-pink: #ff00ea;
  --color-neon-blue: #00a8ff;
  --color-cyber-dark: #0a0a0f;
  --color-cyber-darker: #050508;
}
```

### Glass Morphism + Glow Effects
```css
.glass {
  background: rgba(10, 10, 15, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 255, 242, 0.1);
}

.glow-text {
  text-shadow: 0 0 10px rgba(0, 255, 242, 0.5), 0 0 40px rgba(0, 255, 242, 0.3);
}

.text-gradient-flow {
  background: linear-gradient(90deg, #00fff2, #bf00ff, #ff00ea, #00fff2);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-flow 5s linear infinite;
}
```

### Accessibility
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. Audio Player (`landing/src/components/AudioPlayer.astro`)

### Word-by-Word Thai Subtitle Sync
```typescript
function showWordsSequentially(duration: number) {
  if (!subtitleContainer || words.length === 0) return
  subtitleContainer.classList.remove('hidden')
  currentWordIndex = 0

  words.forEach(w => {
    w.classList.remove('opacity-100')
    w.classList.add('opacity-0')
  })

  const wordDelay = (duration * 1000 * 0.6) / words.length

  wordInterval = window.setInterval(() => {
    if (currentWordIndex < words.length) {
      words[currentWordIndex].classList.remove('opacity-0')
      words[currentWordIndex].classList.add('opacity-100')
      currentWordIndex++
    } else {
      if (wordInterval) clearInterval(wordInterval)
    }
  }, wordDelay)
}
```

---

## 8. Key Patterns

| Pattern | Implementation |
|---------|---------------|
| Hybrid Rendering | Static by default, `export const prerender = false` for dynamic routes |
| State Management | Nanostores atoms + computed for lightweight reactive state |
| Auth Security | SIWE + single-use nonces in KV + HMAC-SHA256 JWT + HttpOnly cookies |
| CF Workers Compat | Web Crypto API instead of Node.js crypto |
| TTS Generation | `edge-tts` with `th-TH-PremwadeeNeural` voice |
