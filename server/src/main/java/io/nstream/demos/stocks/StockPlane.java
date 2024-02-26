package io.nstream.demos.stocks;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import swim.api.plane.AbstractPlane;
import swim.kernel.Kernel;
import swim.server.ServerLoader;

public class StockPlane extends AbstractPlane {

  private static final Logger log = LoggerFactory.getLogger(StockPlane.class);

  public static void main(String[] args) {
    final Kernel kernel = ServerLoader.loadServer();
    kernel.start();
    log.info("Running Stock Plane");
    kernel.run();
  }
}
