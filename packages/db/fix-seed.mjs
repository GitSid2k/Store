// Run seed via prisma CLI
import { execSync } from "child_process";
process.env.DATABASE_URL = "file:C:/Users/Sid2k/ProjectsKodic/Market/packages/db/prisma/dev.db";
execSync("npx prisma db seed --schema=prisma/schema.prisma", { stdio: "inherit", cwd: process.cwd() });
