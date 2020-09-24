var requirements = {};

var body = document.getElementsByTagName("body")[0];

body.onkeydown = function (e) {
  if (
    e.target.tagName == "INPUTLINE" &&
    e.target.hasAttribute("contenteditable") &&
    e.key == "Enter"
  ) {
    e.target.removeAttribute("contenteditable");
    var terminalInput = e.target.innerText;

    if (terminalInput == "nodejs httpServers.js") {
      createHttpServers();
    } else {
      let terminal = document.getElementsByTagName("terminal")[0];
      let terminalLine = document.createElement("terminalline");

      var terminalArrow = document.createElement("terminalarrow");
      terminalArrow.innerHTML = `>`;

      var terminalInputLine = document.createElement("inputline");
      terminalInputLine.toggleAttribute("contenteditable");

      terminalLine.appendChild(terminalArrow);
      terminalLine.appendChild(terminalInputLine);
      terminal.appendChild(terminalLine);
    }
  }
};

function updateNodeJsTerminal(line) {
  var nodeJsTerminal = document.getElementsByTagName("terminal")[0];
  nodeJsTerminal.append(line);
}

function createNodeJsTerminalOutput(lineContent) {
  var newLine = document.createElement("line");
  newLine.innerHTML = lineContent;

  return newLine;
}

var modules = {
  http2: {},
  http: {
    createServer: function (functionRequestResponse) {
      this.requestResponse = functionRequestResponse;
      return this;
    },
    response: {
      end: function () {},
      write: function (writeWhat) {
        var webpage = document.getElementsByTagName("webpage")[0];
        webpage.innerHTML = webpage.innerHTML + writeWhat;
      },
      writeHead: function (headerResponseCode, headerResponseObject) {
        var headerLines = "";

        for (let index in headerResponseObject) {
          headerLines =
            headerLines +
            `<br>&nbsp;&nbsp;${index}: ${headerResponseObject[index]}`;
        }
        updateNodeJsTerminal(
          createNodeJsTerminalOutput(
            `<httpheaderterminaloutput>
                &nbsp;sending http response header: 
                  <br>&nbsp;&nbsp;Response Code: ${headerResponseCode}
                  ${headerLines}
               </httpheaderterminaloutput>`
          )
        );
      }
    },
    requestResponse: "none",
    listen: function (portNumber) {
      updateNodeJsTerminal(
        createNodeJsTerminalOutput(
          "<httpterminaloutput>http server listening on port " +
            portNumber +
            "</httpterminaloutput>"
        )
      );

      return this;
    }
  }
};

function require(what) {
  if (!requirements[what]) {
    requirements[what] = { what: what, required: true };
  }

  if (modules[what]) {
    return modules[what];
  }
}

var http = require("http");

function createHttpServers() {
  http
    .createServer(function (request, response) {
      response.writeHead(200, {
        "Content-Type": "emulated",
        "HTTP2-Support-Enabled": "true"
      });

      response.write("<intro>Hello Codepen.io</intro>");
      response.end();
    })
    .listen(38923);

  http
    .createServer(function (request, response) {
      response.writeHead(200, {
        "Content-Type": "emulated",
        "HTTP2-Support-Enabled": "true"
      });

      response.write("<intro>Hello Codepen.io</intro>");
      response.end();
    })
    .listen(49834);

  http
    .createServer(function (request, response) {
      response.writeHead(200, {
        "Content-Type": "emulated",
        "HTTP2-Support-Enabled": "true"
      });

      response.write("<intro>Hello Codepen.io</intro>");
      response.end();
    })
    .listen(58745);
}

//localStorage["reloads"] = parseInt(localStorage["reloads"]) + 1;
//console.log("reloads: " + localStorage["reloads"]);

// middleware

var dns = {
  listeningOn38923: {
    http: http,
    serverResponseIsAvailable: true,
    requests: {
      requestFromSelf: {
        time: new Date()
      }
    }
  }
};

//////////////////////////
// Client side JavaScript //
//////////////////////////

function connectTo(requestor, endpoint, preferences) {
  if (dns["listeningOn" + endpoint]) {
    dns["listeningOn" + endpoint]["requests"]["requestFrom" + requestor];
    var http = dns["listeningOn" + endpoint]["http"];

    http.request = {
      requestor: requestor,
      time: new Date(),
      endpoint: endpoint,
      http2: preferences.http2
    };

    updateNodeJsTerminal(
      createNodeJsTerminalOutput(
        `<httprequestterminaloutput>
          Heared request from <requestor>${requestor}</requestor> for http connection to <port>port ${endpoint}</port>
         </httprequestterminaloutput>`
      )
    );

    if (typeof http.requestResponse == "function") {
      var webpage = document.getElementsByTagName("webpage")[0];
      webpage.innerHTML = "";

      http.requestResponse(http.request, http.response);
    } else {
      var terminal = document.getElementsByTagName("terminal")[0];
      var terminalLine = document.createElement("notificationline");
      terminalLine.innerHTML = `No http servers are running. 
        <br><br>Type:
        <br><br>&nbsp;&nbsp;> nodejs httpServers.js
        <br><br>to start http servers.<br><br>`;

      terminal.appendChild(terminalLine);

      var terminalArrow = document.createElement("terminalarrow");
      terminalArrow.innerText = ">";

      var terminalInputLine = document.createElement("inputline");
      terminalInputLine.toggleAttribute("contenteditable");

      terminal.appendChild(terminalArrow);
      terminal.appendChild(terminalInputLine);
    }
  }
}

var requestButton = document.getElementsByTagName("button")[0];
requestButton.onclick = function () {
  var endpoint = this.getAttribute("endpoint");
  var requestor = this.getAttribute("onbehalfof");
  var addressbar = document.getElementsByTagName("addressbar")[0];
  addressbar.innerHTML = addressbar.innerText + ":" + endpoint;

  connectTo(requestor, endpoint, {
    http2: {
      askIfAvailable: true,
      connectToMore: function (endpoints) {
        for (let index in endpoints) {
          connectToHttp2(requestor, endpoints[index], index);
        }
      }
    }
  });
};
