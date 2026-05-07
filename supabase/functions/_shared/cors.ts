export const ALLOWED_ORIGINS = [
  "https://ivethcollrealtor.com",
  "https://www.ivethcollrealtor.com",
  "http://localhost:5173",
  "http://localhost:8080",
];

export const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get("Origin") ?? "";

  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
};
