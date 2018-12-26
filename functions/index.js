const functions = require('firebase-functions');
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 8080;
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

//ROUTES
const authRouter = require('./routes/authRouter');
const partsRouter = require('./routes/partsRouter');
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/parts', partsRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});

exports.app = functions.https.onRequest(app);
