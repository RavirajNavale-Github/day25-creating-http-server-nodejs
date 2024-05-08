const http = require("http");
const https = require("https");

// Create an HTTP server
const server = http.createServer((req, res) => {
  if (req.url === "/users" && req.method === "GET") {
    // Define JSON API endpoint URL
    const apiUrl = "https://jsonplaceholder.typicode.com/users";

    // Send HTTP response headers
    res.writeHead(200, { "Content-Type": "application/json" });

    // Fetch user data from JSON API
    https
      .get(apiUrl, (apiRes) => {
        let data = "";
        //fired when we get the data
        apiRes.on("data", (chunk) => {
          data += chunk;
        });

        //fires at the end of resopnse
        apiRes.on("end", () => {
          // Parse JSON data and send response
          const users = JSON.parse(data); //convert to JS object
          res.end(JSON.stringify(users)); //convert to string
        });
      })
      .on("error", (err) => {
        console.error("Error fetching user data:", err);
        res.end(JSON.stringify({ error: "Failed to fetch user data" }));
      });
  } else if (req.url === "/users" && req.method === "POST") {
    let data = "";

    //fired when added content in data
    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      const postData = JSON.parse(data);
      //here logic for add data in api by POST method
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(JSON.stringify(postData));
    });
  } else if (req.url.startsWith("/users/") && req.method === "PUT") {
    //get user Id
    const userId = req.url.split("/")[2];

    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      const updateData = JSON.parse(data);

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`User ${userId} updated successfully: ${JSON.stringify(updateData)}`);
    });
  } else {
    //Other request
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

// Specify the port to listen on
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
