package io.nstream.demos.stocks.agents;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.CommandLane;
import swim.api.lane.ValueLane;
import swim.concurrent.TimerRef;
import swim.structure.Record;
import swim.structure.Value;

public class StockAgent extends AbstractAgent {

  TimerRef simTicker;

  @SwimLane("status")
  final ValueLane<Value> status = valueLane();

  @SwimLane("init")
  final CommandLane<Value> init = commandLane();

  void onSimTick() {
    //generate data every 20 seconds, with 20K stocks this should roughly get 1K stocks to send messages every second
    this.simTicker.reschedule(Math.round(20000L * Math.random()));

    final double prevPrice = this.status.get().get("price").doubleValue(0.0);
    final double currentPrice = toTwoDecimalPlaces(Math.random() * 100);
    final double movement = currentPrice - prevPrice;

    final Record record = Record.create(4)
          .slot("timestamp", System.currentTimeMillis())
          .slot("price", currentPrice)
          .slot("volume", Math.pow(Math.random() * 400, 3))
          .slot("bid", toTwoDecimalPlaces(Math.random() * 100))
          .slot("ask", toTwoDecimalPlaces(Math.random() * 100))
          .slot("movement", toTwoDecimalPlaces(movement));
    this.status.set(record);
  }

  private double toTwoDecimalPlaces(double d) {
    return Math.floor(d * 100) / 100;
  }

  @Override
  public void didStart() {
    command("/symbols", "add", getProp("symbol"));
    this.simTicker = setTimer(3000, this::onSimTick);
  }

}
