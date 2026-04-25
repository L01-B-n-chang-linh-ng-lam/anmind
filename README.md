# AnMind

![CI](https://github.com/L01-B-n-chang-linh-ng-lam/anmind/actions/workflows/test.yml/badge.svg)
![SonarCloud Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=L01-B-n-chang-linh-ng-lam_anmind&metric=alert_status)

AnMind is a digital wellness platform focused on mindfulness, emotional awareness, and sustainable mental well-being habits.

## Run Tests Locally

Both workspaces use Jest. Run them independently from their respective directories.

### Backend (NestJS)

```bash
cd backend
npm install
npm test                # unit tests
npm run test:cov        # unit tests with coverage report
npm run test:e2e        # end-to-end tests
npm run test:watch      # watch mode during development
```

### Mobile (Expo React Native)

React Native requires a specific Jest environment. Make sure you are using Node.js 20+.

```bash
cd mobile
npm install
npm test                # unit tests
npm run test:cov        # unit tests with coverage report
npm run test:watch      # watch mode during development
```