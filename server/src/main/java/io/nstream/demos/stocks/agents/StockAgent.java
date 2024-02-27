package io.nstream.demos.stocks.agents;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.ValueLane;
import swim.structure.Value;

public class StockAgent extends AbstractAgent {

  @SwimLane("status")
  final ValueLane<Value> status = valueLane();

  @Override
  public void didStart() {
    command("/symbols", "add", getProp("symbol"));
  }

}
