# Financial APIs Setup Guide

This guide will help you set up the financial APIs required for Aperio.fin, as specified in the PRD.

## Required APIs

### 1. Alpha Vantage (Market Data)
**Purpose:** Real-time stock prices, market indices, company information, and financial news
**Cost:** Standard Plan - $49.99/month (as per PRD)
**Free Tier:** 500 API requests per day

**Setup:**
1. Visit: https://www.alphavantage.co/support/#api-key
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add to `.env.local`: `REACT_APP_ALPHA_VANTAGE_KEY=your_key_here`

**Features Used:**
- Real-time stock quotes (`GLOBAL_QUOTE`)
- Company overviews (`OVERVIEW`)
- News & sentiment (`NEWS_SENTIMENT`)
- Search functionality (`SYMBOL_SEARCH`)

### 2. FRED API (Economic Data)
**Purpose:** Federal Reserve Economic Data - GDP, inflation, unemployment, interest rates
**Cost:** Free (unlimited requests with API key)
**Alternative:** Works without API key (limited requests)

**Setup:**
1. Visit: https://fred.stlouisfed.org/docs/api/api_key.html
2. Create free account with Federal Reserve Bank of St. Louis
3. Request API key (approval is instant)
4. Add to `.env.local`: `REACT_APP_FRED_KEY=your_key_here`

**Economic Indicators:**
- GDP (`GDP`)
- Consumer Price Index (`CPIAUCSL`)
- Unemployment Rate (`UNRATE`)
- Federal Funds Rate (`FEDFUNDS`)
- Consumer Sentiment (`UMCSENT`)
- Housing Starts (`HOUST`)
- Industrial Production (`INDPRO`)
- Retail Sales (`RSAFS`)
- Personal Income (`PI`)
- Personal Savings Rate (`PSAVERT`)

## Future APIs (Phase 2)

### 3. ElevenLabs (Voice Generation)
**Purpose:** AI voice generation for multi-character audio content
**Cost:** Starter Plan - $5/month (as per PRD)
**Free Tier:** 10,000 characters/month

**Setup:**
1. Visit: https://elevenlabs.io
2. Sign up and get API key
3. Add to `.env.local`: `REACT_APP_ELEVENLABS_KEY=your_key_here`

### 4. Perplexity (News & Context)
**Purpose:** AI-powered news analysis and contextual information
**Cost:** Pro Plan - $20/month (as per PRD)
**Free Tier:** Limited requests

**Setup:**
1. Visit: https://www.perplexity.ai
2. Get API access (may require waitlist)
3. Add to `.env.local`: `REACT_APP_PERPLEXITY_KEY=your_key_here`

## Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example frontend/.env.local
   ```

2. Fill in your API keys in `frontend/.env.local`

3. Restart your development server to load new environment variables

## Testing Your Setup

1. **Alpha Vantage Test:**
   - Go to `/market` in your app
   - Check if stock prices load correctly
   - Search for stocks using the search feature

2. **FRED Test:**
   - Go to `/market` in your app
   - Check the "Economic Data" section
   - Verify economic indicators are loading

3. **Error Handling:**
   - The app includes fallback mock data if APIs fail
   - Check browser console for any API errors
   - All APIs have rate limiting and error handling built-in

## API Rate Limits & Best Practices

### Alpha Vantage
- Free: 500 requests/day, 5 requests/minute
- Standard: 1200 requests/minute
- Use caching to minimize requests

### FRED
- No rate limits with API key
- 120 requests/hour without API key
- Data updates once daily (no need for frequent requests)

### Cost Optimization
- Enable caching for financial data
- Batch API requests when possible
- Use mock data for development to save API calls
- Monitor usage in API provider dashboards

## Troubleshooting

### Common Issues:
1. **"demo" API responses**: You're using demo keys, get real API keys
2. **CORS errors**: APIs may not work in development mode, this is normal
3. **Rate limiting**: Wait before making more requests
4. **Invalid API key**: Double-check your environment variables

### Support:
- Alpha Vantage: https://www.alphavantage.co/support/
- FRED: https://fred.stlouisfed.org/docs/api/
- Check API provider status pages for outages

## Development vs Production

### Development:
- Use free tiers and demo keys for testing
- Mock data fallbacks prevent development blocking
- Rate limits are more restrictive

### Production:
- Upgrade to paid API plans as per PRD specifications
- Implement proper caching and error handling
- Monitor API costs and usage

This setup provides the financial data foundation needed for Aperio.fin's AI-powered financial journalism platform.