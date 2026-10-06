# BitTrix Technologies

Website for BitTrix Technologies, Theni: technology training in
cybersecurity, AI, blockchain, networking, web engineering and game
development.

React 19 + Vite + Tailwind 4, with a three.js hero. Every page is
prerendered to static HTML at build time, so the output in `dist/` is plain
files any web server can serve.

## Develop

```sh
npm install
cp .env.example .env    # then set VITE_CONTACT_ENDPOINT
npm run dev             # http://localhost:5173
```

`npm run build` writes the site to `dist/`; `npm run preview` serves it.

## Settings

| Variable                | Used for                                        |
| ----------------------- | ----------------------------------------------- |
| `VITE_CONTACT_ENDPOINT` | Where the contact form posts enquiries (JSON).  |

It is read at build time, so rebuild after changing it. Left empty, the
contact form tells visitors online enquiries are not connected yet.

## Deploy (VPS, Docker)

The image builds the site and serves it with nginx (`nginx.conf`), as the
`bittrix-web` container. It doesn't face the internet itself: the server's
shared reverse proxy (`/var/www/proxy`, container `proxy`) handles ports
80/443 and HTTPS for every site on the server, and passes
bittrixtechnologies.com to `http://bittrix-web` on the shared Docker network
`web` (see `compose.yaml`). The proxy's settings for this site are in
`/var/www/proxy/conf.d/bittrix.conf`.

The container is also on `127.0.0.1:8080` for checking it with `curl`.

First time:

```sh
cd /var/www
git clone https://github.com/Yogesh190602/Bittrix.git bittrix-technologies
cd bittrix-technologies
cp .env.example .env    # set VITE_CONTACT_ENDPOINT
docker network create web    # if the proxy hasn't already
docker compose up -d --build
```

Every update after that:

```sh
cd /var/www/bittrix-technologies
git pull
docker compose up -d --build
```

## Hero robot stills

While three.js loads, the hero shows a still of the robot
(`src/assets/hero/robot-light.webp` and `robot-dark.webp`). If the robot's
model, colours or camera change, regenerate them with
`scripts/render-hero-poster.mjs` (instructions at the top of the file), or
the live robot will jump when it fades in over the still.
