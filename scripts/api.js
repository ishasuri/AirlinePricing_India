const https = require("https");
const fs = require("fs");
const path = require("path");

const destinatinos = [
  {
    From: "MAA",
    To: "CJB",
  },
  {
    From: "BOM",
    To: "CJB",
  },
  {
    From: "BLR",
    To: "CJB",
  },
  {
    From: "HYD",
    To: "CJB",
  },
  {
    From: "MAA",
    To: "IXM",
  },
  {
    From: "BLR",
    To: "IXM",
  },
  {
    From: "BOM",
    To: "MAA",
  },
  {
    From: "DEL",
    To: "MAA",
  },
  {
    From: "BLR",
    To: "MAA",
  },
  {
    From: "HYD",
    To: "MAA",
  },
  {
    From: "DEL",
    To: "LKO",
  },
  {
    From: "BLR",
    To: "LKO",
  },
  {
    From: "DEL",
    To: "AGR",
  },
  {
    From: "HYD",
    To: "AGR",
  },
  {
    From: "DEL",
    To: "HYD",
  },
  {
    From: "BLR",
    To: "HYD",
  },
  {
    From: "DEL",
    To: "BLR",
  },
  {
    From: "BOM",
    To: "BLR",
  },
  {
    From: "HYD",
    To: "BLR",
  },
  {
    From: "CCU",
    To: "BLR",
  },
  {
    From: "DEL",
    To: "BOM",
  },
  {
    From: "BLR",
    To: "BOM",
  },
  {
    From: "HYD",
    To: "BOM",
  },
  {
    From: "DEL",
    To: "PNQ",
  },
  {
    From: "BLR",
    To: "PNQ",
  },
  {
    From: "MAA",
    To: "PNQ",
  },
  {
    From: "BOM",
    To: "DEL",
  },
  {
    From: "BLR",
    To: "DEL",
  },
  {
    From: "HYD",
    To: "DEL",
  },
  {
    From: "CCU",
    To: "DEL",
  },
];

const dates = [
  {
    outbound_date: "2025-01-11",
    return_date: "2025-01-14",
  },
  // {
  //     "outbound_date": "2025-03-13",
  //     "return_date": "2025-03-16"
  // },
  // {
  //     "outbound_date": "2025-03-29",
  //     "return_date": "2025-03-31"
  // },
  // {
  //     "outbound_date": "2025-04-10",
  //     "return_date": "2025-04-13"
  // },
  // {
  //     "outbound_date": "2025-04-18",
  //     "return_date": "2025-04-20"
  // },
  // {
  //     "outbound_date": "2025-05-10",
  //     "return_date": "2025-05-12"
  // },
  {
    outbound_date: "2025-08-15",
    return_date: "2025-08-17",
  },
  // {
  //     "outbound_date": "2025-09-5",
  //     "return_date": "2025-09-7"
  // },
  // {
  //     "outbound_date": "2025-10-01",
  //     "return_date": "2025-10-05"
  // },
  // {
  //     "outbound_date": "2025-10-18",
  //     "return_date": "2025-10-20"
  // },
  // {
  //     "outbound_date": "2025-10-23",
  //     "return_date": "2025-10-26"
  // },
  {
    outbound_date: "2025-12-25",
    return_date: "2025-12-28",
  },
];

const destinationFolder = path.join(__dirname, "FilteredData");

// Ensure destination folder exists
if (!fs.existsSync(destinationFolder)) {
  fs.mkdirSync(destinationFolder, { recursive: true });
}

function callApi(apiUrl) {
  return new Promise((resolve, reject) => {
    // Construct the query string

    // Make the GET request
    https
      .get(apiUrl, (response) => {
        let data = "";

        // Collect response data
        response.on("data", (chunk) => {
          data += chunk;
        });

        // Handle the end of the response
        response.on("end", () => {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`HTTP ${response.statusCode}: ${data}`));
          }
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

// Transformation function for JSON data
// const transformJson = (data) => {
//   // Example transformation: Add a new field "processedAt" with a timestamp
//   delete data.search_metadata;
//   delete data.airports;
//   delete data.price_insights.price_history;
//   data.other_flights = data.other_flights
//     ? data.other_flights.map((o) => {
//         return {
//           flights: o.flights ? o.flights.map((i) => i.airline) : [],
//           price: o.price,
//         };
//       })
//     : [];
//   data.best_flights = data.best_flights
//     ? data.best_flights.map((o) => {
//         return {
//           flights: o.flights ? o.flights.map((i) => i.airline) : [],
//           price: o.price,
//         };
//       })
//     : [];
//   return {
//     ...data,
//   };
// };

const callloop = (date) => {
  destinatinos.map(async (item) => {
    try {
      const departure_id = item.From;
      const arrival_id = item.To;
      const outbound_date = date.outbound_date;
      const return_date = date.return_date;
      const url = `https://serpapi.com/search.json?engine=google_flights&departure_id=${departure_id}&arrival_id=${arrival_id}&gl=in&hl=en&currency=INR&outbound_date=${outbound_date}&return_date=${return_date}&travel_class=1&adults=1&stops=1&api_key=bbbe46cef0ab0ac7262afa8c6f2b37f938cca1c3ce18680f7e81e4223417b5eb`;
      const response = await callApi(url);

      // const transformedData = transformJson(response);

      const fileName = `${arrival_id}-${departure_id}-${outbound_date}-${return_date}.json`;
      const destinationFilePath = path.join(destinationFolder, fileName);

      await fs.writeFile(
        destinationFilePath,
        JSON.stringify(response, null, 2),
        (err) => {
          if (err) {
            console.error(`Error writing file ${url}`, err);
          } else {
            console.log(`Processed and saved:`, fileName);
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  });
};

const callDates = () => {
  dates.map((date) => {
    callloop(date);
  });
};

callDates();
