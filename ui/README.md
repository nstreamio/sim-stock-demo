# Stocks UI with AG Grid

This UI displays a live stock ticker. The UI in this folder was bootstrapped with React + TypeScript + Vite and uses `ag-grid-react` for its table component.

Incoming data is still streamed via a downlink to the the backend found at `[projectRoot]/server`.

## Running a local Swim backend

```bash
cd ../server
mvn clean compile exec:java
```

## Running the UI locally

```bash
npm run dev
```
