// src/swagger.ts
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Task Manager API",
    description: "API documentation",
  },
  host: "localhost:6001",
  schemes: ["http"],
};

const outputFile = "./src/swagger-output.json";
const endpointsFiles = ["./src/routes/task.routes.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
