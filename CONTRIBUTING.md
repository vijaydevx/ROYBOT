# Contributing to ROYBOT

ROYBOT is a student-built robotics prototype. Issues, questions and suggestions are welcome.

## Reporting bugs
Open a GitHub issue and include:
- what you did and what you expected to happen,
- which part is affected (firmware, backend, dashboard, hardware),
- your hardware (ESP32 / ESP32-CAM board variant, power source) when it is hardware related,
- logs or console output, **with Wi-Fi names, passwords and IP addresses of private networks removed**.

## Suggesting changes
Open an issue describing the problem and the proposed change before starting large work.

## Pull requests
1. Fork the repository and branch from `main`.
2. Keep changes small and focused.
3. Make sure both packages still build:
   ```bash
   npm ci
   npm run build -w server    # TypeScript compile
   npm run build -w client    # Next.js production build
   ```
4. If you change an API endpoint, the pin mapping or the setup steps, update the README and `docs/`.
5. Never commit Wi-Fi credentials, tokens or `.env` files. Use the `*.example` files and placeholders.
6. Do not describe a feature as working unless it was tested; mark it as "not verified" instead.

There is currently no automated test suite and no formatter configuration in this repository.

## Hardware safety
Changes to motor-control or balancing code can make the robot move unexpectedly. Test with the wheels lifted off the ground first.
