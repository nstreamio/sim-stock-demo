# Introduction 

A real-time simulation of a stock ticker. 

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
