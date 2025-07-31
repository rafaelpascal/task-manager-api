import app from "./app";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger-output.json";
import { config } from "dotenv";
config();

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
