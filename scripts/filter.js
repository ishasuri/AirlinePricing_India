const fs = require("fs");
const path = require("path");

// Source and destination folder paths
const sourceFolder = path.join(__dirname, "api/FilteredData1");
const destinationFolder = path.join(__dirname, "filtered");

// Ensure destination folder exists
if (!fs.existsSync(destinationFolder)) {
  fs.mkdirSync(destinationFolder, { recursive: true });
}

// Transformation function for JSON data
const transformJson = (data) => {
  // Example transformation: Add a new field "processedAt" with a timestamp
  delete data.search_metadata;
  delete data.airports;
  delete data.price_insights.price_history;
  data.other_flights = data.other_flights
    ? data.other_flights.map((o) => {
        return {
          flights: o.flights ? o.flights.map((i) => i.airline) : [],
          price: o.price,
        };
      })
    : [];
  data.best_flights = data.best_flights
    ? data.best_flights.map((o) => {
        return {
          flights: o.flights ? o.flights.map((i) => i.airline) : [],
          price: o.price,
        };
      })
    : [];
  return {
    ...data,
  };
};

// Function to process JSON files
const processJsonFiles = () => {
  fs.readdir(sourceFolder, (err, files) => {
    if (err) {
      console.error("Error reading source folder:", err);
      return;
    }

    // Filter only JSON files
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    jsonFiles.forEach((file) => {
      const sourceFilePath = path.join(sourceFolder, file);
      const destinationFilePath = path.join(destinationFolder, file);

      // Read the JSON file
      fs.readFile(sourceFilePath, "utf8", (err, data) => {
        if (err) {
          console.error(`Error reading file ${file}:`, err);
          return;
        }

        try {
          // Parse JSON, transform it, and write to destination
          const jsonData = JSON.parse(data);
          const transformedData = transformJson(jsonData);

          fs.writeFile(
            destinationFilePath,
            JSON.stringify(transformedData, null, 2),
            (err) => {
              if (err) {
                console.error(`Error writing file ${file}:`, err);
              } else {
                console.log(`Processed and saved: ${file}`);
              }
            }
          );
        } catch (parseErr) {
          console.error(`Error parsing JSON in file ${file}:`, parseErr);
        }
      });
    });
  });
};

// Start processing
processJsonFiles();
