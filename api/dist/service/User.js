"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.cancelAppointment = exports.getAppointments = exports.userAppointment = exports.loginUser = exports.registerUser = exports.getuser = exports.singleDoc = exports.getSpecialist = exports.getDoctors = exports.fetchResult = exports.executeQuery = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_2 = require("../config/db");
const date_fns_1 = require("date-fns");
const executeQuery = (database, query, method, replacements) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield database.query(query, {
            type: method,
            replacements,
        });
        console.log(`Client Database query executed: ${query}`);
        return result;
    }
    catch (err) {
        console.log("Query execution failed on ClientDB:", err);
        throw err;
    }
});
exports.executeQuery = executeQuery;
const fetchResult = (db, query, method, replacements) => __awaiter(void 0, void 0, void 0, function* () {
    const createDbConnection = new sequelize_1.Sequelize({
        username: db_1.user,
        password: db_1.password,
        database: db,
        host: db_1.host,
        dialect: "postgres",
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    });
    const result = yield (0, exports.executeQuery)(createDbConnection, query, method, replacements);
    yield createDbConnection.close();
    return result;
});
exports.fetchResult = fetchResult;
const getDoctors = (db) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `SELECT * FROM doctors_table`;
        const result = yield (0, exports.fetchResult)(db, query, sequelize_1.QueryTypes.SELECT);
        if (!result || result.length === 0) {
            console.warn("No doctors found in the database.");
        }
        return result;
    }
    catch (error) {
        console.error("Error fetching doctors from database:", error.message);
        // Throwing a more detailed error
        throw new Error(`Failed to fetch doctors: ${error.message || error}`);
    }
});
exports.getDoctors = getDoctors;
const getSpecialist = (db, speciality) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `SELECT * FROM doctors_table WHERE speciality = :speciality`;
        const result = yield (0, exports.fetchResult)(db, query, sequelize_1.QueryTypes.SELECT, {
            speciality,
        });
        if (!result || result.length === 0) {
            console.log(`No doctors found for speciality: ${speciality}`);
            return [];
        }
        return result;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error fetching specialists for ${speciality}:`, error.message);
            throw new Error(`Database error: ${error.message}`);
        }
        console.error("Unexpected error:", error);
        throw new Error("An unexpected error occurred while fetching specialists.");
    }
});
exports.getSpecialist = getSpecialist;
const singleDoc = (db, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `SELECT * FROM doctors_table WHERE id=:id`;
        const result = yield (0, exports.fetchResult)(db, query, sequelize_1.QueryTypes.SELECT, {
            id,
        });
        return result;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching doctor details:", error.message);
            throw new Error(error.message);
        }
        else {
            console.error("Unknown error:", error);
            throw new Error("An unknown error occurred");
        }
    }
});
exports.singleDoc = singleDoc;
const getuser = (db, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `SELECT * FROM users_table WHERE id=:id`;
        const result = yield (0, exports.fetchResult)(db, query, sequelize_1.QueryTypes.SELECT, {
            id,
        });
        return result;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching user:", error.message);
            throw new Error(error.message);
        }
        else {
            console.error("Unknown error occurred:", error);
            throw new Error("An unknown error occurred while fetching user data.");
        }
    }
});
exports.getuser = getuser;
const registerUser = (userName, email, password, imageUrl, db) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = (0, uuid_1.v4)();
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const selectUserQuery = `SELECT * FROM users_table WHERE email = :email`;
        const dbUser = yield (0, exports.fetchResult)(db, selectUserQuery, sequelize_1.QueryTypes.SELECT, {
            email,
        });
        if (dbUser && dbUser.length > 0) {
            throw new Error("User already exists");
        }
        else {
            const createUserQuery = `
        INSERT INTO users_table (id, name, email, password,image_url) 
        VALUES (:userId, :userName, :email, :hashedPassword,:imageUrl)
      `;
            yield (0, exports.fetchResult)(db, createUserQuery, sequelize_1.QueryTypes.INSERT, {
                userId,
                userName,
                email,
                hashedPassword,
                imageUrl,
            });
            const token = jsonwebtoken_1.default.sign({ id: userId, email: email }, db_2.secretKey, {
                expiresIn: "1d",
            });
            return {
                id: userId,
                userName,
                email,
                token,
                message: `Welcome ${userName}`,
            };
        }
    }
    catch (error) {
        console.error("Error during user registration:", error);
        throw error;
    }
});
exports.registerUser = registerUser;
// Login a user
const loginUser = (email, password, db) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const selectUserQuery = `SELECT * FROM users_table WHERE email = :email`;
        const dbUser = (yield (0, exports.fetchResult)(db, selectUserQuery, sequelize_1.QueryTypes.SELECT, {
            email,
        }));
        if (!dbUser || dbUser.length === 0) {
            throw new Error("User not found");
        }
        const user = dbUser[0];
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, db_2.secretKey, {
            expiresIn: "1d",
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            token,
            message: "Login successful",
        };
    }
    catch (error) {
        console.error("Error during user login:", error);
        throw error;
    }
});
exports.loginUser = loginUser;
const userAppointment = (appointment_details) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId, patientId, doctorName, image, department, fees, appointmentDate, appointmentDay, appointmentHour, adrLine1, adrLine2, patientName, age, imageUrl, status, } = appointment_details;
    console.log(patientId);
    const getdateAndTimeQuery = `
    SELECT * FROM appoint_table 
    WHERE appointment_date = :appointmentDate 
    AND appointment_hour = :appointmentHour AND doctor_name=:doctorName AND status=:status
  `;
    try {
        const dbUser = (yield (0, exports.fetchResult)(db_1.db, getdateAndTimeQuery, sequelize_1.QueryTypes.SELECT, { appointmentDate, appointmentHour, doctorName, status }));
        const user = dbUser[0];
        if (dbUser.length === 0) {
            const appointmentId = (0, uuid_1.v4)();
            const bookAppointmentQuery = `
        INSERT INTO appoint_table 
        (id, doctor_id, doctor_name, doc_img_url, department, fees, appointment_date, appointment_day, appointment_hour,adr_line1,adr_line2,status,patient_name,patient_age,patient_img_url,patient_id) 
        VALUES (:appointmentId, :doctorId, :doctorName, :image, :department, :fees, :appointmentDate, :appointmentDay, :appointmentHour,:adrLine1,:adrLine2,:status,:patientName,:age,:imageUrl,:patientId)
      `;
            yield (0, exports.fetchResult)(db_1.db, bookAppointmentQuery, sequelize_1.QueryTypes.INSERT, {
                appointmentId,
                doctorId,
                doctorName,
                image,
                department,
                fees,
                appointmentDate,
                appointmentDay,
                appointmentHour,
                adrLine1,
                adrLine2,
                status,
                patientName,
                age,
                imageUrl,
                patientId,
            });
            return {
                appointmentId,
                message: "Appointment booked successfully.",
            };
        }
        else if (dbUser.length > 0 && user.status === "Cancelled") {
            const appointmentId = (0, uuid_1.v4)();
            const bookAppointmentQuery = `
        INSERT INTO appoint_table 
        (id, doctor_id, doctor_name, doc_img_url, department, fees, appointment_date, appointment_day, appointment_hour,adr_line1,adr_line2,status,patient_name,patient_age,patient_img_url,patient_id) 
        VALUES (:appointmentId, :doctorId, :doctorName, :image, :department, :fees, :appointmentDate, :appointmentDay, :appointmentHour,:adrLine1,:adrLine2,:status,:patientName,:age,:imageUrl,:patientId)
      `;
            yield (0, exports.fetchResult)(db_1.db, bookAppointmentQuery, sequelize_1.QueryTypes.INSERT, {
                appointmentId,
                doctorId,
                doctorName,
                image,
                department,
                fees,
                appointmentDate,
                appointmentDay,
                appointmentHour,
                adrLine1,
                adrLine2,
                status,
                patientName,
                age,
                imageUrl,
                patientId,
            });
            return {
                appointmentId,
                message: "Appointment booked successfully.",
            };
        }
        else {
            throw new Error("Slot is already taken.");
        }
    }
    catch (error) {
        const errorMessage = error.message ||
            "An error occurred while booking the appointment.";
        console.error(`Error during booking appointment: ${errorMessage}`);
        throw error; // Re-throw the error after logging it
    }
});
exports.userAppointment = userAppointment;
const getAppointments = (db, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `SELECT * FROM appoint_table WHERE patient_id=:id `;
        const result = yield (0, exports.fetchResult)(db, query, sequelize_1.QueryTypes.SELECT, { id });
        return result;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching appointments:", error.message);
        }
        else {
            console.error("Unknown error:", error);
        }
        throw new Error("Unable to fetch appointments from the database");
    }
});
exports.getAppointments = getAppointments;
const cancelAppointment = (doctorId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const updateAvailabilityQuery = `
    UPDATE appoint_table 
    SET status = :status 
    WHERE id = :doctorId
  `;
    try {
        const result = yield (0, exports.fetchResult)(db_1.db, updateAvailabilityQuery, sequelize_1.QueryTypes.UPDATE, {
            doctorId,
            status,
        });
        return result;
    }
    catch (error) {
        console.error("Error updating doctor availability:", error);
        throw error;
    }
});
exports.cancelAppointment = cancelAppointment;
const updateUserProfile = (userData, id, db) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, address, phone, dob, imageUrl } = userData;
    console.log("DOB received:", dob);
    let age = null;
    if (dob && !isNaN(new Date(dob).getTime())) {
        const date = new Date();
        const startDate = new Date(dob);
        age = (0, date_fns_1.differenceInYears)(date, startDate);
    }
    try {
        const query = `UPDATE users_table SET name=:name, email=:email, address=:address, age=:age, image_url=:imageUrl,
    date_of_birth=:dob, phone_num=:phone WHERE id=:id`;
        console.log("Executing query with parameters:", {
            name,
            email,
            address,
            age,
            imageUrl,
            dob,
            phone,
            id,
        });
        const result = yield (0, exports.fetchResult)(db, query, sequelize_1.QueryTypes.UPDATE, {
            name,
            email,
            address,
            age,
            imageUrl,
            dob,
            phone,
            id,
        });
        return result ? "Profile updated successfully" : "No changes made";
    }
    catch (error) {
        console.error("Error updating user profile:", error);
        throw new Error("Failed to update user profile");
    }
});
exports.updateUserProfile = updateUserProfile;
