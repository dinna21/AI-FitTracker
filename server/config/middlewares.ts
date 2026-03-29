import type { Core } from '@strapi/strapi';

export default ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => {
  const configuredOrigins = env('CORS_ORIGIN', '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const defaultOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://ai-fit-tracker-omega.vercel.app',
  ];

  const allowedOrigins = Array.from(new Set([...defaultOrigins, ...configuredOrigins]));
  const vercelPreviewPattern = /^https:\/\/ai-fit-tracker-[a-z0-9-]+\.vercel\.app$/i;

  return [
    'strapi::logger',
    'strapi::errors',
    'strapi::security',
    {
      name: 'strapi::cors',
      config: {
        origin: (requestOrigin: string) => {
          if (!requestOrigin) return requestOrigin;
          if (allowedOrigins.includes(requestOrigin)) return requestOrigin;
          if (vercelPreviewPattern.test(requestOrigin)) return requestOrigin;
          return false;
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
        headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
        keepHeaderOnError: true,
      },
    },
    'strapi::poweredBy',
    'strapi::query',
    {
      name: 'strapi::body',
      config: {
        formLimit: '20mb',
        jsonLimit: '20mb',
        textLimit: '20mb',
        multipart: true,
      },
    },
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};
