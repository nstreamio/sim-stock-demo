# Introduction 

This application is a real-time simulation of a stock ticker. It displays a real-time table of a simulated collection of stocks that one might find listed on an exchange. Their key properties such as current price and daily movement are simulated in the Java Swim application located in the `/server` directory of this repository. A single MapDownlink is opened by the UI to the `stocks` lane of the backend application's `SymbolsAgent`. This downlink syncs with the lane's state containing pricing for all entries and then receives follow-on price updates until the downlink is closed. With each update received, UI local state and table content is updated.

See a hosted version of this app running at [https://stocks-simulated.nstream-demo.io](https://stocks-simulated.nstream-demo.io/).
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

## Streaming APIs

The [swim-cli](https://www.swimos.org/backend/cli/) is the simplest way to fetch or stream data from  the web agents in this application

### "swim-cli" installation
**swim-cli** installation details available here: https://www.swimos.org/backend/cli/

### Application APIs
**Note:**
* Below **swim-cli** commands for introspection are for streaming locally running application.
* There is a hosted version of this application running here: https://stocks-simulated.nstream-demo.io/
* To stream APIs for the hosted version, replace `warp://localhost:9001` in below commands with `warps://stocks-simulated.nstream-demo.io`

(Below, Stock ticker symbol "AAAA" is used as an example)

1. **SYMBOLS**:

* List of various stocks' current price, trading volume, bid/ask if any, and the price movement in the stock price.
```sh
swim-cli sync -h warp://localhost:9001 -n /symbols -l stocks
```

2. **STOCK**:

* A particular stock's current status details (current price, trading volume, bid/ask if any, and the price movement in the stock price)
```sh
swim-cli sync -h warp://localhost:9001 -n /stock/AAAA -l status
```

* A particular stock's previous close price details
```sh
swim-cli sync -h warp://localhost:9001 -n /stock/AAAA -l previousClose
```

### Introspection APIs
The Swim runtime exposes its internal subsystems as a set of meta web agents.

Use the `swim:meta:host` agent to introspect a running host. Use the `pulse`
lane to stream high level stats:

```sh
swim-cli sync -h warp://localhost:9001 -n swim:meta:host -l pulse
```

The `nodes` lane enumerates all agents running on a host:

```sh
swim-cli sync -h warp://localhost:9001 -n swim:meta:host -l nodes
```

The fragment part of the `nodes` lane URI can contain a URI subpath filter:

```sh
swim-cli sync -h warp://localhost:9001 -n swim:meta:host -l nodes#/
```

#### Node Introspection

You can stream the utilization of an individual web agent:

```sh
swim-cli sync -h warp://localhost:9001 -n swim:meta:node/%2fsymbols -l pulse

swim-cli sync -h warp://localhost:9001 -n swim:meta:node/%2fstock%2fAAAA -l pulse
```

And discover its lanes:

```sh
swim-cli sync -h warp://localhost:9001 -n swim:meta:node/%2fsymbols -l lanes

swim-cli sync -h warp://localhost:9001 -n swim:meta:node/%2fstock%2fAAAA -l lanes
```

#### Mesh introspectiong

```sh
swim-cli sync -h warp://localhost:9001 -n swim:meta:edge -l meshes
```
