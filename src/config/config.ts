import moongoose from "mongoose";

export const dbConnection = moongoose
    .connect(process.env.DATABASE_URL || "")
    .then(() => console.log("Conectado a Mongo Atlas"))
    .catch((error) => console.error(error));
