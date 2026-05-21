import { NextResponse } from "next/server";

// Fallback data matching the exact gemini.md schema for 2025 achievements
const FALLBACK_COMPETITIONS = [
  {
    eventName: "New York Tech Valley Regional",
    startDate: "2025-03-26",
    endDate: "2025-03-29",
    location: "Albany, NY",
    status: "completed",
    teamRecord: {
      wins: 13, // 7 quals + 6 playoffs
      losses: 3,  // 2 quals + 1 playoff
      ties: 0,
    },
    allianceStatus: "1st Pick of Alliance 1 (Event Champions! 🏆)",
    rank: "Rank 2/56",
  },
  {
    eventName: "FIRST Championship - Hopper Division",
    startDate: "2025-04-16",
    endDate: "2025-04-19",
    location: "Houston, TX",
    status: "completed",
    teamRecord: {
      wins: 9,  // 8 quals + 1 playoff
      losses: 4,  // 2 quals + 2 playoffs
      ties: 0,
    },
    allianceStatus: "Captain of Alliance 4",
    rank: "Rank 5/75",
  },
  {
    eventName: "Finger Lakes Regional",
    startDate: "2025-03-12",
    endDate: "2025-03-15",
    location: "Rochester, NY",
    status: "completed",
    teamRecord: {
      wins: 5,
      losses: 6,
      ties: 0,
    },
    allianceStatus: "2nd Pick of Alliance 6",
    rank: "Rank 15/54",
  },
  {
    eventName: "NY Tech Valley Robot Rumble",
    startDate: "2025-10-24",
    endDate: "2025-10-25",
    location: "Ballston Spa, NY",
    status: "completed",
    teamRecord: {
      wins: 7, // 3 quals + 4 playoffs
      losses: 7, // 4 quals + 3 playoffs
      ties: 0,
    },
    allianceStatus: "Event Finalists 🥈",
    rank: "Rank N/A",
  },
];

export async function GET() {
  const TBA_KEY = process.env.TBA_API_KEY;

  if (!TBA_KEY) {
    console.warn("TBA_API_KEY is missing in server environment. Serving fallback data.");
    return NextResponse.json(FALLBACK_COMPETITIONS);
  }

  try {
    // 1. Fetch simplified events list for 2025
    const eventsRes = await fetch(
      "https://www.thebluealliance.com/api/v3/team/frc6621/events/2025/simple",
      {
        headers: { "X-TBA-Auth-Key": TBA_KEY },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!eventsRes.ok) {
      throw new Error(`Events fetch failed: ${eventsRes.status}`);
    }

    const eventsData = await eventsRes.json();

    // 2. Fetch event statuses for the team in 2025
    const statusesRes = await fetch(
      "https://www.thebluealliance.com/api/v3/team/frc6621/events/2025/statuses",
      {
        headers: { "X-TBA-Auth-Key": TBA_KEY },
        next: { revalidate: 3600 },
      }
    );

    const statusesData = statusesRes.ok ? await statusesRes.json() : {};

    // 3. Map to the gemini.md schema
    const mappedCompetitions = eventsData.map((event: any) => {
      const statusInfo = statusesData[event.key] || {};
      const qualRecord = statusInfo.qual?.ranking?.record || { wins: 0, losses: 0, ties: 0 };
      const playoffRecord = statusInfo.playoff?.record || { wins: 0, losses: 0, ties: 0 };

      // Calculate total wins/losses/ties combining quals and playoffs
      const wins = qualRecord.wins + playoffRecord.wins;
      const losses = qualRecord.losses + playoffRecord.losses;
      const ties = qualRecord.ties + playoffRecord.ties;

      // Extract custom ranking/alliance stats for enriched front-end display
      const rank = statusInfo.qual?.ranking?.rank
        ? `Rank ${statusInfo.qual.ranking.rank}/${statusInfo.qual.num_teams}`
        : "Rank N/A";
      const allianceStatus = statusInfo.alliance_status_str
        ? statusInfo.alliance_status_str.replace(/<\/?[^>]+(>|$)/g, "") // Strip HTML tags
        : "--";

      return {
        eventName: event.name,
        startDate: event.start_date,
        endDate: event.end_date,
        location: `${event.city}, ${event.state_prov}`,
        status: wins + losses + ties > 0 ? "completed" : "upcoming",
        teamRecord: {
          wins,
          losses,
          ties,
        },
        allianceStatus,
        rank,
      };
    });

    // Sort chronologically by start date
    mappedCompetitions.sort(
      (a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    return NextResponse.json(mappedCompetitions);
  } catch (error) {
    console.error("Error fetching TBA data, using fallback:", error);
    return NextResponse.json(FALLBACK_COMPETITIONS);
  }
}
