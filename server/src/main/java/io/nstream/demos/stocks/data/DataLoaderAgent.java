package io.nstream.demos.stocks.data;

import swim.api.agent.AbstractAgent;
import swim.structure.Value;

public class DataLoaderAgent extends AbstractAgent {

  private void initStockAgents() {
    int numStocks = 20000;
    try {
      numStocks = Integer.parseInt(System.getenv("NUM_STOCKS"));
    } catch (Exception e) {
    }

    int i = 0;
    while (i < numStocks) {
      command("/stock/" + getId(i), "init", Value.absent());
      i++;
    }
  }

  private String getId(int i) {
    final int n = 4; // use 4 digits for ids
    int place = 0;
    final StringBuilder s = new StringBuilder();
    while (place < n) {
      s.insert(0, (char) ((i / Math.pow(26, place)) % 26 + 65));
      place++;
    }
    return s.toString();
  }

  @Override
  public void didStart() {
    initStockAgents();
  }

}
