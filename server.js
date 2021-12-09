import express from "express";
import dotenv from "dotenv";

import morgan from "morgan";
import colors from "colors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
dotenv.config();
import  swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc'
import logger from './config/winston.js';
connectDB();
 

const app = express();
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan('combined', { stream: logger.stream }));
}

app.use(express.json());

const swaggerOptions={
  definition:{
   openapi:'3.0.0',
    info:{
      title:'Node.js API Project',
      description:'customer api information',
      contact:{
        name:"Amazing developer"
      }
    },
    servers:[
      {url:  "http://localhost:5000"}
      ]
  },
  apis:["app.js"]
  }
  
  const swaggerDocs=swaggerJsdoc(swaggerOptions)
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  

app.use("/api/users", userRoutes);
app.use("/api/todo", todoRoutes);

/**
 * @swagger
 * /:
 *  get
 *    summary:new get request
 *    description:new get request
 *    responses: 
 *       200:
 *          description:to Test get method     
 */
  app.get("/", (req, res) => {
    res.send("API is running....");
  });


app.use(notFound);
// app.use(errorHandler);
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 5000;


app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
