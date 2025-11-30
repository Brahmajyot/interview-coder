import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";
const app = express();



const __dirname = path.resolve();

app.get("/", (req, res) => {
  res.send("what is your name");
});
app.get("/books",(req,res) => {
  res.send("bhai hogaya")
})
// app ka deploy karnay ka tareeqa
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../fronted/dist")));

  app.get("/{*any}", (req,res)=>{
    res.sendFile(path.join(__dirname,"../fronted", "dist", "index.html"))
  })
}





app.listen(ENV.PORT, () => {
  console.log(`Server running on port: ${ENV.PORT}`);
});