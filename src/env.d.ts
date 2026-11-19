/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    /** I vendosur nga middleware për çdo adresë /admin pasi Access verifikohet. */
    admin?: { email: string };
  }
}

// Sekretet e Worker-it (vendosen me `wrangler secret put`, jo në repo).
declare namespace Cloudflare {
  interface Env {
    ACCESS_TEAM_DOMAIN?: string;
    ACCESS_AUD?: string;
    ADMIN_EMAIL?: string;
  }
}
