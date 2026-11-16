const corsHeaders = {
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Accept',
  'Cache-Control': 'private, no-store, max-age=0',
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff'
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

export async function onRequestOptions({ request }) {
  const origin = request.headers.get('Origin');
  const ownOrigin = new URL(request.url).origin;
  if (origin && origin !== ownOrigin) return json({ state: 'unavailable' }, 403);
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function onRequestGet({ request, env }) {
  const origin = request.headers.get('Origin');
  const ownOrigin = new URL(request.url).origin;
  if (origin && origin !== ownOrigin) return json({ state: 'unavailable' }, 403);

  const apiKey = env.GOOGLE_PLACES_API_KEY;
  const placeId = env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return json({ state: 'pending' });
  if (!/^[A-Za-z0-9_-]{10,}$/.test(placeId)) return json({ state: 'unavailable' }, 503);

  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=it`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,reviews,googleMapsUri'
      }
    });
    if (!response.ok) return json({ state: 'unavailable' }, 503);

    const place = await response.json();
    if (!Number.isFinite(Number(place.rating)) || !Number(place.userRatingCount)) {
      return json({ state: 'empty', reviewUrl: env.GOOGLE_REVIEW_URL || '' });
    }
    return json({
      state: 'ready',
      rating: place.rating,
      userRatingCount: place.userRatingCount,
      googleMapsUri: place.googleMapsUri,
      reviewUrl: env.GOOGLE_REVIEW_URL || '',
      reviews: (place.reviews || []).slice(0, 5)
    });
  } catch {
    return json({ state: 'unavailable' }, 503);
  }
}
