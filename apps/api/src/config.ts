import { z } from 'zod';

const EnvSchema = z.object({
  PORT: z.coerce.number().default(4000),
  APP_BASE_URL: z.string().url().default('http://localhost:4000'),
  WEB_BASE_URL: z.string().url().default('http://localhost:5173'),
  JWT_SECRET: z.string().min(10).default('dev-secret-please-change'),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),
  MS_CLIENT_ID: z.string().optional(),
  MS_CLIENT_SECRET: z.string().optional(),
  MS_TENANT_ID: z.string().optional(),
  MS_REDIRECT_URI: z.string().optional(),
  VIDEO_PROVIDER: z.enum(['meet', 'teams', 'zoom', 'none']).default('meet')
});

export type AppConfig = ReturnType<typeof loadConfig>;

export function loadConfig() {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const formatted = parsed.error.format();
    throw new Error(`Invalid environment configuration: ${JSON.stringify(formatted)}`);
  }
  const env = parsed.data;
  return {
    port: env.PORT,
    appBaseUrl: env.APP_BASE_URL,
    webBaseUrl: env.WEB_BASE_URL,
    jwtSecret: env.JWT_SECRET,
    databaseUrl: env.DATABASE_URL,
    redisUrl: env.REDIS_URL,
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      redirectUri: env.GOOGLE_REDIRECT_URI
    },
    microsoft: {
      clientId: env.MS_CLIENT_ID,
      clientSecret: env.MS_CLIENT_SECRET,
      tenantId: env.MS_TENANT_ID,
      redirectUri: env.MS_REDIRECT_URI
    },
    videoProvider: env.VIDEO_PROVIDER
  } as const;
}


