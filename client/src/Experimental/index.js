import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url); // Used to grab file url
const __dirname = path.dirname(__filename) // Find the directory name of the file
dotenv.config(); // Needed for dotenv files

// Express is needed to run all of these other imports
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"})); // Helmet will use "cors" resource policy
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));  // Recommended settings for bodyParser according to repo
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets'))); // Set directory of where assets will be stored

/* FILE STORAGE SETUP */
// According to multer package usage instructions
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "public/assets"); // Will store files in the public/assets folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
const upload = multer({storage});


