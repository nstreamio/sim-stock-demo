# Stocks Demo

This UI displays a real-time table of a simulated collection of stocks that one might find listed on an exchange. Their key properties such as current price and daily movement are simulated in the Java Swim application located in the `/server` directory of this repository. A single MapDownlink is opened by the UI to the `stocks` lane of the backend application's `SymbolsAgent`. This downlink syncs with the lane's state containing pricing for all entries and then receives follow-on price updates until the downlink is closed. With each update received, UI local state and table content is updated.

The UI in this folder was bootstrapped with React + TypeScript + Vite and uses `ag-grid-react` for its table component.

## Setup

Install dependencies.

```bash
npm install
```

## Running the Java Swim application

You may optionally configure an environment variable, `NUM_STOCKS`, which will set the number of stocks simulated by the Java Swim application. The default is 20,000. All stocks update randomly once in every 20-second interval, so by default there will be an average of about 1,000 incoming messages per second.

```bash
cd ../server
TOKEN=abcdefghijklmnopqrst mvn clean compile exec:java
```

## Start the UI

Build and serve the UI. It can be viewed in your browser at `localhost:5173`.

```bash
npm run dev
```
