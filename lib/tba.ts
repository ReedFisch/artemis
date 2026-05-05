export async function getTeamInfo() {
  const TBA_KEY = process.env.TBA_API_KEY;
  if (!TBA_KEY) return null;
  
  try {
    const res = await fetch(`https://www.thebluealliance.com/api/v3/team/frc6621`, {
      headers: { "X-TBA-Auth-Key": TBA_KEY },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function getTeamEvents() {
  const TBA_KEY = process.env.TBA_API_KEY;
  if (!TBA_KEY) return [];
  
  try {
    const res = await fetch(`https://www.thebluealliance.com/api/v3/team/frc6621/events/2025/simple`, {
      headers: { "X-TBA-Auth-Key": TBA_KEY },
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
}
