# Introduction 

This application is a real-time simulation of a stock ticker. It displays a real-time table of a simulated collection of stocks that one might find listed on an exchange. Their key properties such as current price and daily movement are simulated in the Java Swim application located in the `/server` directory of this repository. A single MapDownlink is opened by the UI to the `stocks` lane of the backend application's `SymbolsAgent`. This downlink syncs with the lane's state containing pricing for all entries and then receives follow-on price updates until the downlink is closed. With each update received, UI local state and table content is updated.

# Running the example
This default implementation simulates 20K stocks by default. 
```bash
cd server
mvn clean compile exec:java
```

You may change the number of stocks by setting the `NUM_STOCKS` environment variable. To run the application with 50K simulated stocks, use the following commands.
```bash
cd server
NUM_STOCKS=50000
mvn clean compile exec:java
```


# Viewing the UI

The UI is built using React bootstrapped with Vite and AG Grid for the table component.


```bash
cd ui
npm install
npm run dev
```

Then head to `localhost:5173` to see it in action.
