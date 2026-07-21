import { NextResponse } from 'next/server';

export async function GET() {
  const realRightsAvailsMatrix = [
    {
      filmTitle: "Jananam 1947 Pranayam Thudarunnu",
      rightsCategory: "Linear Satellite Television",
      territoryScope: "India (IND Territory)",
      exclusivity: "EXCLUSIVE",
      availabilityStatus: "AVAILABLE_FOR_LICENSING",
      askingPrice: "₹50,00,000",
      licensingTerm: "5 Years (2026 - 2031)",
      holdbackNotice: "No TV broadcast holdbacks in effect",
      censorCertificate: "CBFC Certificate No. DIL/1/102/2024-KER (Censor U)"
    },
    {
      filmTitle: "Jananam 1947 Pranayam Thudarunnu",
      rightsCategory: "Subscription Video-on-Demand (SVOD)",
      territoryScope: "Worldwide NRI & Global (WLD)",
      exclusivity: "NON_EXCLUSIVE",
      availabilityStatus: "ACTIVE_CONTRACT (JioHotstar)",
      askingPrice: "₹40,00,000",
      licensingTerm: "3 Years (2025 - 2028)",
      holdbackNotice: "30-day theatrical window cleared",
      censorCertificate: "CBFC Certificate No. DIL/1/102/2024-KER (Censor U)"
    },
    {
      filmTitle: "Jananam 1947 Pranayam Thudarunnu",
      rightsCategory: "Ad-Supported Video-on-Demand (AVOD)",
      territoryScope: "North America & Europe (NAM/EUR)",
      exclusivity: "NON_EXCLUSIVE",
      availabilityStatus: "ACTIVE_DISPATCH (Tubi & YouTube Movies)",
      askingPrice: "80% Revenue Share",
      licensingTerm: "Perpetual (Cancel with 60-day notice)",
      holdbackNotice: "None",
      censorCertificate: "Self-certified TV-PG"
    },
    {
      filmTitle: "Jananam 1947 Pranayam Thudarunnu",
      rightsCategory: "24/7 FAST Playout Channel",
      territoryScope: "Global Smart TV OEM (Samsung TV / LG Channels)",
      exclusivity: "NON_EXCLUSIVE",
      availabilityStatus: "LIVE_SYNDICATED (Crayons Loop FAST)",
      askingPrice: "50/50 SSAI Ad Fill Split",
      licensingTerm: "Continuous Playout",
      holdbackNotice: "SCTE-35 Ad Insertion Markers Enabled",
      censorCertificate: "Universal TV-PG"
    }
  ];

  return NextResponse.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    totalAvails: realRightsAvailsMatrix.length,
    rightsMatrix: realRightsAvailsMatrix
  });
}
