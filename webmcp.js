/*
  Experimental WebMCP integration for West Auckland Windscreens.
  Exposes a structured "request a quote" tool to in-browser AI agents via the
  proposed navigator.modelContext API (W3C WebMCP). Feature-detected and fully
  defensive: if the browser/agent does not support WebMCP, this does nothing and
  the page is unaffected. The WebMCP spec is in early preview and may change.
*/
(function () {
  var mc = navigator && navigator.modelContext;
  if (!mc) return;

  var tool = {
    name: "request_windscreen_quote",
    description: "Request a windscreen or auto-glass quote from West Auckland Windscreens. Collects the customer's contact and vehicle details and submits an enquiry. Use when a user wants a quote, booking, or to replace a windscreen / side window / back glass.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Customer full name" },
        phone: { type: "string", description: "Best contact phone number" },
        email: { type: "string", description: "Email address (optional)" },
        vehicle: { type: "string", description: "Vehicle make, model and year, e.g. Toyota Hilux 2019" },
        glass: { type: "string", description: "What needs replacing: Windscreen, Side window, Rear/back glass, or Not sure" },
        insurance: { type: "string", description: "Insurance claim? Yes, No, or Not sure" },
        message: { type: "string", description: "Anything else, e.g. suburb or best time to call" }
      },
      required: ["name", "phone", "vehicle"]
    },
    execute: async function (args) {
      args = args || {};
      try {
        var body = new URLSearchParams();
        body.append("form-name", "Quote Request");
        ["name", "phone", "email", "vehicle", "glass", "insurance", "message"].forEach(function (k) {
          if (args[k]) body.append(k, args[k]);
        });
        var res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString()
        });
        var ok = res && res.ok;
        return { content: [{ type: "text", text: ok
          ? "Quote request sent to West Auckland Windscreens. We'll be in touch shortly on the number provided. For urgent help call 0800 202 888."
          : "Could not submit the quote automatically. Please call West Auckland Windscreens on 0800 202 888 or use the contact form." }] };
      } catch (e) {
        return { content: [{ type: "text", text: "Could not submit the quote automatically. Please call West Auckland Windscreens on 0800 202 888." }] };
      }
    }
  };

  try {
    if (typeof mc.registerTool === "function") {
      mc.registerTool(tool);
    } else if (typeof mc.provideContext === "function") {
      mc.provideContext({ tools: [tool] });
    }
  } catch (e) { /* no-op: WebMCP not available or API shape differs */ }
})();
