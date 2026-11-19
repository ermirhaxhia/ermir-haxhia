# Aktivizimi i panelit `/admin` (Cloudflare Access)

Paneli është i mbyllur si parazgjedhje. Sa kohë Access nuk është konfiguruar, **çdo adresë `/admin` kthen 503**. Kjo është e qëllimshme.

## Si funksionon mbrojtja

1. **Cloudflare Access** qëndron para `/admin`. Kush hyn duhet të vërtetohet (email + kod një-përdorimësh).
2. Access i shton çdo kërkese një token (`Cf-Access-Jwt-Assertion`).
3. **Kodi i faqes e verifikon vetë tokenin** (`src/lib/access.ts`): nënshkrimin RS256 me çelësat e Cloudflare, lëshuesin, audiencën (AUD), skadimin dhe, opsionalisht, emailin. Pa token të vlefshëm: 403. Pa konfigurim: 503.
4. Çdo kërkesë që ndryshon diçka (POST) duhet të ketë `Origin` të njëjtë me faqen (mbrojtje nga CSRF).
5. Në `astro dev` (vetëm `localhost`) paneli hapet pa Access, për punë lokale. Ky kalim nuk ekziston në build-in e prodhimit.

## Çfarë konfigurohet (një herë)

**A. Te paneli i Cloudflare (e bën Ermiri)**

1. Hap **Zero Trust** (nëse kërkon emër ekipi, zgjidh një; do të jetë `<emri>.cloudflareaccess.com`). Kontrollo nëse kërkon metodë pagese për planin falas.
2. **Access → Applications → Add an application → Self-hosted**.
3. Domeni: `www.ermirhaxhia.com`, shtegu: `admin` (mbulon edhe `admin/*`). **Mos përdor** butonin "Enable Cloudflare Access" te cilësimet e Worker-it: ai mbron gjithë Worker-in, pra edhe faqen publike.
4. Politikë **Allow**, me rregull "Emails" = email-i i Ermirit. Askush tjetër.
5. Ruaj dhe kopjo **Application Audience (AUD) Tag** nga detajet e aplikacionit.

Shënim: ndërfaqja e Cloudflare ndryshon; emrat e menyve mund të jenë pak ndryshe.

**B. Sekretet e Worker-it (komandë, një herë)**

```
npx wrangler secret put ACCESS_TEAM_DOMAIN   # p.sh. emri.cloudflareaccess.com
npx wrangler secret put ACCESS_AUD           # AUD Tag nga hapi A.5
npx wrangler secret put ADMIN_EMAIL          # opsionale, por e rekomanduar
```

Sekretet ruhen te Cloudflare, jo te repo, dhe mbeten pas çdo publikimi të ri.

## Si ta provosh

1. Hap `/admin` në shfletues: duhet të të çojë te faqja e hyrjes së Access.
2. Pas hyrjes, duhet të shohësh panelin.
3. Hap `/admin` nga një shfletues tjetër ose dritare private pa hyrë: duhet të të bllokojë.

## Kufizime

- Një përdorues (Ermiri). Pa role.
- Pa kthim prapa: një fshirje është përfundimtare.
- Skedarët e ngarkuar te paneli janë **publikë** (`/f/public/...`).
