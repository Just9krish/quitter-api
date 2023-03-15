import express from "express";
const app = express();
const ads = "Sfsfas";
app.get("/", (req, res) => {
    res.send("hellow owrd");
});
app.listen(3000, () => console.log("server is listening"));
//# sourceMappingURL=server.js.map