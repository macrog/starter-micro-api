const express = require("express");
const cors = require("cors");

const operationRouter = require("./routes/operation");

const app = express();
app.use(cors());
app.use(express.json());
app.use(operationRouter);

app.listen(process.env.PORT || 3000);
