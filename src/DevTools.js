import React from "react";
import { inspect } from "@xstate/inspect";

const DevTools = () => {
  inspect({
    // options
    // url: 'https://statecharts.io/inspect', // (default)
    iframe: false, // open in new window
  });
  return null;
};

export default DevTools;
