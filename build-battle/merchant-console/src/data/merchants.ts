import { Merchant } from "./types"

/**
 * Fictional merchants. Nothing here corresponds to a real business.
 * Berlin and London exist so timezone bugs have somewhere to show up.
 */
export const merchants: Merchant[] = [
  {
    id: "mch_01",
    name: "Lumen Coffee Roasters",
    country: "US",
    timezone: "America/New_York",
    currency: "USD",
    riskTier: "low",
  },
  {
    id: "mch_02",
    name: "Kestrel Outdoor Supply",
    country: "US",
    timezone: "America/Denver",
    currency: "USD",
    riskTier: "standard",
  },
  {
    id: "mch_03",
    name: "Marlowe Books",
    country: "US",
    timezone: "America/Chicago",
    currency: "USD",
    riskTier: "low",
  },
  {
    id: "mch_04",
    name: "Halcyon Studio",
    country: "GB",
    timezone: "Europe/London",
    currency: "GBP",
    riskTier: "standard",
  },
  {
    id: "mch_05",
    name: "Brandt & Sohn",
    country: "DE",
    timezone: "Europe/Berlin",
    currency: "EUR",
    riskTier: "standard",
  },
  {
    id: "mch_06",
    name: "Nordwind Fahrrad",
    country: "DE",
    timezone: "Europe/Berlin",
    currency: "EUR",
    riskTier: "elevated",
  },
  {
    id: "mch_07",
    name: "Cascade Fitness",
    country: "US",
    timezone: "America/Los_Angeles",
    currency: "USD",
    riskTier: "standard",
  },
  {
    id: "mch_08",
    name: "Verity Home Goods",
    country: "US",
    timezone: "America/New_York",
    currency: "USD",
    riskTier: "low",
  },
  {
    id: "mch_09",
    name: "Aster Botanicals",
    country: "GB",
    timezone: "Europe/London",
    currency: "GBP",
    riskTier: "elevated",
  },
  {
    id: "mch_10",
    name: "Pelham Tool Co.",
    country: "US",
    timezone: "America/New_York",
    currency: "USD",
    riskTier: "standard",
  },
]

export const merchantById = (id: string) => merchants.find((m) => m.id === id)
