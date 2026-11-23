# DIGIMON CORE v1.0 — Shadowmon Digivice PWA

This upgrade extends the existing Shadowmon Digivice AI v1.1 project. It preserves the existing browser save key `shadowmon_digivice_save_v1` and adds a versioned Core object inside the existing saved state.

## Included
- Persistent creature ID and device ID
- Backward-compatible save migration (existing partner stats, memories, chat, traits, wins and evolution fields are retained)
- Short-term chat context and a separate Core memory index
- Simulated emotional state, needs/drives and learned action preferences
- High-independence bounded decision cycle while the app is open
- Hybrid chat: cloud AI through `/api/chat` when online; local rule-based companion responses offline
- Device-context awareness (online/offline, visible/hidden, local time and timezone)
- Export/import of the complete creature identity and Core data for manual transfer between devices
- Updated service-worker cache for offline app files

## Critical first step: back up your save
1. Open your currently deployed Digivice.
2. Go to **Memory → Export save**.
3. Keep the downloaded `shadowmon-save.json` somewhere safe before replacing any files.

## Deploy from Android / GitHub
1. Download and extract this ZIP.
2. Upload the contents to the same GitHub repository used by your existing v1.1 deployment, preserving the `public` folder and root files.
3. Replace the existing files with these versions. New file: `public/core.js`.
4. Commit the changes. Your Render service should redeploy from GitHub.
5. Open the app, hard-refresh/reopen it, then check the new **DIGIMON CORE // v1.0** panel.
6. If the old PWA is cached, close it fully and reopen; the service-worker cache version has been changed.

## Existing save compatibility
The existing key remains exactly `shadowmon_digivice_save_v1`. Core v1.0 adds `core` as a new property; it does not rename or clear the old key. The importer also accepts older save files and adds missing Core fields. Keep the exported backup regardless.

## Hybrid AI
- Online: the existing private Node backend calls the OpenAI Responses API at `/api/chat`.
- Offline or if the backend is unavailable: the app uses the local rule-based response engine and retains its local memories and state.
- The API key remains on the server in `OPENAI_API_KEY`; never put it in `public/` or commit it to GitHub.
- The model is configured with `OPENAI_MODEL` in the hosting provider's environment settings. The included Render configuration uses `gpt-6.2-astra`; change it only to a model enabled for your API project.

## Independence and real-world context
Autonomous decisions run at five-minute intervals while the PWA is open and visible. The phone/browser may suspend JavaScript when the app is closed or backgrounded, so this version does not claim continuous background activity. The environment observer reads only basic device context (online state, visibility, local time and timezone); it does not access GPS, camera or microphone without a separate permission-based feature.

## Transfer to another device
Use **Memory → Export save** on the old device, then **Import save** on the new device. This carries the same creature ID, partner data, memories and Core state. Automatic cloud synchronization and multi-device conflict resolution are not enabled yet; those require authenticated cloud storage and are the next infrastructure milestone.

## Important
This is a digital companion simulation. It can store memories, adapt rule-based preferences and make bounded autonomous choices, but it is not evidence of consciousness or biological life.
