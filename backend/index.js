const express = require("express")
const cors = require("cors")   ; 
const mainRouter = require('../backend/Routes/index');

const app = express() ; 
app.use(cors())  ; 
app.use(express.json()) ; 
app.use("/api/v1",mainRouter) ; 
app.listen(3001) ; 

//  By calling app.use("api/v1", mainRouter), the mainRouter middleware function is mounted at the /api/v1 path, and any requests that match this path will be handled by mainRouter.