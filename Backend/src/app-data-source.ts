import { DataSource } from "typeorm"

export const myDataSource = new DataSource({
    type: "mysql",
    host: "209.38.26.237",
    port: 3306,
    username: "S4097536",
    password: "cunCode2006?",
    database: "S4097536",
    entities: ["src/entities/*.js"],
    logging: true,
    synchronize: true,
})