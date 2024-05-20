import express from "express";

const app = express();

app.get("/", (req, res) => {
    console.log("Primer endpoint");
});

app.listen(3600, () => {
    console.log("Server running on port 3600");
    console.log("localhost:3600");
});
