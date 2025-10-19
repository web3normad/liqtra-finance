# Next.js Image Configuration

## Configured External Image Domains

The following CDN domains are configured to work with Next.js `<Image>` component:

### CoinGecko (Cryptocurrency Logos)

```
https://assets.coingecko.com/coins/images/**
```

- Used for: Token logos (ETH, BTC, USDC, etc.)
- Examples:
  - ETH: `https://assets.coingecko.com/coins/images/279/small/ethereum.png`
  - BTC: `https://assets.coingecko.com/coins/images/1/small/bitcoin.png`

### DeFi Llama (Protocol & Chain Logos)

```
https://icons.llamao.fi/icons/**
```

- Used for: Protocol and chain logos
- Examples:
  - Lido: `https://icons.llamao.fi/icons/protocols/lido`
  - Aave: `https://icons.llamao.fi/icons/protocols/aave`

### CryptoLogos (Additional Logos)

```
https://cryptologos.cc/logos/**
```

- Used for: Alternative logo sources
- Backup for some protocols

### Trust Wallet (GitHub Assets)

```
https://raw.githubusercontent.com/trustwallet/assets/**
```

- Used for: Additional token assets
- Community-maintained logo repository

## Usage in Components

```tsx
import Image from "next/image";
import { getTokenLogo } from "@/lib/utils/logos";

function TokenIcon({ symbol }: { symbol: string }) {
  return (
    <Image
      src={getTokenLogo(symbol)}
      alt={symbol}
      width={32}
      height={32}
      className="rounded-full"
    />
  );
}
```

## Adding New Domains

If you need to add more external image domains, update `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ... existing patterns
      {
        protocol: "https",
        hostname: "new-cdn.com",
        pathname: "/path/**",
      },
    ],
  },
};
```

## Important Notes

⚠️ **Restart Required**: After changing `next.config.ts`, you must restart the dev server:

```bash
# Stop current server (Ctrl+C)
npm run dev
```

✅ **Security**: Only add trusted domains to prevent malicious image sources

✅ **Performance**: Next.js automatically optimizes images from these domains

## Troubleshooting

### Error: "hostname is not configured"

**Solution**: Add the hostname to `remotePatterns` in `next.config.ts` and restart

### Images Not Loading

1. Check the URL is correct
2. Verify the domain is in `remotePatterns`
3. Restart the dev server
4. Clear browser cache

### Slow Image Loading

- Next.js optimizes images on first load
- Subsequent loads are cached and fast
- Consider adding `priority` prop for above-the-fold images

```tsx
<Image
  src={logo}
  alt="Logo"
  width={48}
  height={48}
  priority // Loads immediately
/>
```
