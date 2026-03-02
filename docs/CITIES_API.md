# Open Source Cities API Setup

This document explains the cities API integration with open-source data sources.

## API Endpoint

**URL:** `/api/cities-list`

**Method:** `GET`

**Query Parameters:**
- `source` (optional): `all` | `openstreetmap` | `github`
  - `all` (default): Try all sources in order
  - `openstreetmap`: Use OpenStreetMap/Nominatim API only
  - `github`: Use GitHub repository data only

## Response Format

```json
{
  "success": true,
  "source": "api",
  "count": 234,
  "data": [
    {
      "city": "Mumbai",
      "pincode": "400001",
      "label": "Mumbai (400001)"
    },
    ...
  ]
}
```

## Data Sources

### 1. **OpenStreetMap/Nominatim** (Recommended)
- **Status:** Free, no authentication required
- **Rate Limit:** 1 request/second
- **Coverage:** Comprehensive global city data including India
- **License:** ODbL (Open Data Commons)
- **Website:** https://nominatim.org/

**Advantages:**
- Completely free
- No API key needed
- Real-time data
- Accurate postal codes

### 2. **GitHub Repository**
- **Source:** https://github.com/saurabhdaware/indian-cities
- **Status:** Free, open-source
- **License:** MIT
- **Coverage:** Indian cities with postal codes

**Advantages:**
- Reliable fallback
- MIT license
- Well-maintained

### 3. **Local Fallback**
- Hardcoded 80+ major Indian cities
- Instant response
- No external API calls

## Usage Examples

### Option 1: Use Frontend Utility (Recommended)

```typescript
import { fetchCitiesWithCache } from '@/lib/fetch-cities'

// In your component or server action
const cities = await fetchCitiesWithCache()
```

### Option 2: Direct API Call

```typescript
// Client-side
const response = await fetch('/api/cities-list')
const { data } = await response.json()

// Server-side (API route)
const response = await fetch('http://localhost:3000/api/cities-list')
const { data } = await response.json()
```

### Option 3: Use Local Constant (Current)

```typescript
import { CITY_OPTIONS_WITH_PINCODES } from '@/lib/discover-options'

// Already includes 80+ cities
console.log(CITY_OPTIONS_WITH_PINCODES)
```

## Performance Notes

- **SSR:** API calls on server are cached per request
- **Client:** Results are cached for 24 hours in memory
- **Fallback Chain:** OpenStreetMap → GitHub → Local data
- **Response Time:** ~500ms-2s on first call, instant on cache hit

## Adding More Cities

To add more cities to the local fallback:

1. Edit `lib/discover-options.ts`
2. Add entries to `CITY_PINCODE_MAP`:
   ```typescript
   "YourCity": "123456"
   ```

## Troubleshooting

### API Returns Empty

Check in this order:
1. Network connectivity
2. Browser console for CORS errors
3. Check `/api/cities-list` endpoint directly
4. The API will automatically fall back to local data

### Rate Limiting

OpenStreetMap has a 1 request/second limit:
- Frontend caching helps (24-hour cache)
- Server-side caching prevents repeated calls
- GitHub source acts as fallback

## Future Enhancements

Potential improvements:
- [ ] Add state-wise filtering
- [ ] Add region/area codes
- [ ] Integrate with Google Places API
- [ ] Add search functionality
- [ ] Implement Redis caching for production

## License

The API endpoint uses:
- OpenStreetMap data (ODbL license)
- GitHub repository data (MIT license)
- Local data (custom mapping)

All sources are open-source and free to use.
