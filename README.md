# Sepro Bestratingen — demo
Een onafhankelijk websitevoorstel van Bloxflow. Statische HTML/CSS/JavaScript; geen installatie of build nodig.

Lokaal: `python3 -m http.server 8770 --directory dist`

Open http://localhost:8770. Het formulier valideert uitsluitend lokaal; geen gegevens worden verstuurd of opgeslagen. Beelden en contactgegevens afkomstig van Sepro's bestaande website; zie asset-sources.json en PRODUCT.md. Geen WordPress/CMS gekoppeld.


## Online demo
https://sepro-bestratingen-demo.office560617.chatgpt.site/

## Inbegrepen
- Volledige responsive website met lokale beelden, logo’s en lettertypen.
- Scrollanimaties en interactieve projectgalerij.
- Header met vijf projectfoto’s, automatische wissel om de 5 seconden en pauzeknop.
- Ondersteuning voor verminderde beweging.

De website staat volledig in `dist/`. Publiceer die map als statische website. De bestaande Sites-hosting is vastgelegd in `.openai/hosting.json`; deze GitHub-repo publiceert niet automatisch naar die hosting.

## Netlify
`netlify.toml` publiceert de map `dist` zonder buildstap. Koppel de `main`-branch; laat de base directory op de hoofdmap staan. Na een push publiceert Netlify opnieuw wanneer automatische deploys actief zijn.
