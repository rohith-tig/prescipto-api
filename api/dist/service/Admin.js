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
exports.updateDoctorProfile = exports.registerAdmin = exports.updateDoctorEarnings = exports.completeAppointment = exports.deleteApppointment = exports.confirmAppointment = exports.getAdminAppointmentList = exports.getDoctorDetailsAndAppointments = exports.getDoctorAppointmentList = exports.getNewDoctorAppointmentList = exports.loginAdmin = exports.loginDoctor = exports.updateDoctorAvailability = exports.createDoctor = exports.adminSingleDoc = exports.singleAdmin = exports.singleDoc = exports.getAdmin = exports.fetchResult = exports.executeQuery = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_2 = require("../config/db");
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
const getAdmin = (db) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `SELECT * FROM doctors_table`;
        const result = yield (0, exports.fetchResult)(db, query, sequelize_1.QueryTypes.SELECT);
        return result;
    }
    catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
});
exports.getAdmin = getAdmin;
const singleDoc = (db, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `SELECT * FROM doctors_table WHERE id = :id`;
        const result = yield (0, exports.fetchResult)(db, query, sequelize_1.QueryTypes.SELECT, { id });
        if (!result.length) {
            throw new Error(`Doctor with ID ${id} not found`);
        }
        return result[0];
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching doctor data:", error.message);
        }
        else {
            console.error("Unknown error:", error);
        }
        throw new Error("Error fetching doctor details");
    }
});
exports.singleDoc = singleDoc;
const singleAdmin = (db, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `SELECT  role FROM admin_table WHERE id = :id`;
        const result = yield (0, exports.fetchResult)(db, query, sequelize_1.QueryTypes.SELECT, { id });
        if (!result.length) {
            throw new Error(`Admin with ID ${id} not found`);
        }
        return result[0];
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching Admin data:", error.message);
        }
        else {
            console.error("Unknown error:", error);
        }
        throw new Error("Error fetching Admin details");
    }
});
exports.singleAdmin = singleAdmin;
const adminSingleDoc = (db, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `SELECT * FROM doctors_table WHERE id = :id`;
        const result = yield (0, exports.fetchResult)(db, query, sequelize_1.QueryTypes.SELECT, { id });
        if (!result.length) {
            throw new Error(`Doctor with ID ${id} not found`);
        }
        return result[0];
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching doctor data:", error.message);
        }
        else {
            console.error("Unknown error:", error);
        }
        throw new Error("Error fetching doctor details");
    }
});
exports.adminSingleDoc = adminSingleDoc;
const createDoctor = (doctorData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, imageUrl, speciality, degree, experience, about, fees, address1, address2, } = doctorData;
    try {
        const userId = (0, uuid_1.v4)();
        const hashedPassword = yield bcrypt_1.default.hash(doctorData.password, 10);
        const selectUserQuery = `SELECT * FROM doctors_table WHERE email = :email`;
        const dbUser = yield (0, exports.fetchResult)(db_1.db, selectUserQuery, sequelize_1.QueryTypes.SELECT, {
            email,
        });
        if (dbUser && dbUser.length > 0) {
            throw new Error("Doctor already exists");
        }
        else {
            const createUserQuery = `
        INSERT INTO doctors_table (id, name, email, password,doc_image_url,
    speciality,
    degree,
    experience,
    about,
    fees,
    adr_line1,
    adr_line2) 
        VALUES (:userId, :name, :email, :hashedPassword,:imageUrl,
    :speciality,
    :degree,
    :experience,
    :about,
    :fees,
    :address1,
    :address2)
      `;
            const response = yield (0, exports.fetchResult)(db_1.db, createUserQuery, sequelize_1.QueryTypes.INSERT, {
                userId,
                name,
                email,
                hashedPassword,
                imageUrl,
                speciality,
                degree,
                experience,
                about,
                fees,
                address1,
                address2,
            });
            return "Doctor created successfully";
        }
    }
    catch (error) {
        console.error("Error during doctor registration:", error);
        throw error;
    }
});
exports.createDoctor = createDoctor;
const updateDoctorAvailability = (doctorId, available) => __awaiter(void 0, void 0, void 0, function* () {
    const updateAvailabilityQuery = `
    UPDATE doctors_table 
    SET availability = :available 
    WHERE id = :doctorId
  `;
    try {
        const result = yield (0, exports.fetchResult)(db_1.db, updateAvailabilityQuery, sequelize_1.QueryTypes.UPDATE, {
            doctorId,
            available,
        });
        return result;
    }
    catch (error) {
        console.error("Error updating doctor availability:", error);
        throw error;
    }
});
exports.updateDoctorAvailability = updateDoctorAvailability;
const loginDoctor = (email, password, db) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const selectDoctorQuery = `SELECT * FROM doctors_table WHERE email = :email`;
        const dbDoctor = (yield (0, exports.fetchResult)(db, selectDoctorQuery, sequelize_1.QueryTypes.SELECT, {
            email,
        }));
        if (!dbDoctor || dbDoctor.length === 0) {
            throw new Error("Doctor not found");
        }
        const doctor = dbDoctor[0];
        const isPasswordValid = yield bcrypt_1.default.compare(password, doctor.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        const token = jsonwebtoken_1.default.sign({ id: doctor.id, email: doctor.email }, db_2.secretKey, {
            expiresIn: "1d",
        });
        return {
            id: doctor.id,
            name: doctor.name,
            email: doctor.email,
            token,
            message: "Login successful",
        };
    }
    catch (error) {
        console.error("Error during doctor login:", error);
        throw error;
    }
});
exports.loginDoctor = loginDoctor;
const loginAdmin = (email, password, db) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const selectDoctorQuery = `SELECT * FROM admin_table WHERE email = :email`;
        const dbAdmin = (yield (0, exports.fetchResult)(db, selectDoctorQuery, sequelize_1.QueryTypes.SELECT, {
            email,
        }));
        if (!dbAdmin || dbAdmin.length === 0) {
            throw new Error(`Admin with email ${email} does not exists`);
        }
        const admin = dbAdmin[0];
        const isPasswordValid = yield bcrypt_1.default.compare(password, admin.password_hash);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email }, db_2.secretKey, {
            expiresIn: "1d",
        });
        return {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            token,
            message: "Login successful",
        };
    }
    catch (error) {
        console.error("Error during admin login:", error);
        throw error;
    }
});
exports.loginAdmin = loginAdmin;
const getNewDoctorAppointmentList = (db, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const status = "waiting";
        const query = `SELECT * FROM appoint_table WHERE doctor_id=:id AND status=:status`;
        const result = yield (0, exports.fetchResult)(db, query, sequelize_1.QueryTypes.SELECT, {
            id,
            status,
        });
        return result;
    }
    catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
});
exports.getNewDoctorAppointmentList = getNewDoctorAppointmentList;
const getDoctorAppointmentList = (db, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `SELECT * FROM appoint_table WHERE doctor_id=:id `;
        const result = yield (0, exports.fetchResult)(db, query, sequelize_1.QueryTypes.SELECT, { id });
        return result || [];
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching appointments:", {
                message: error.message,
                query: "SELECT * FROM appoint_table",
            });
            throw new Error("Unable to fetch appointments from the database");
        }
        else {
            console.error("Unexpected Error:", error);
            throw new Error("An unexpected error occurred while fetching appointments");
        }
    }
});
exports.getDoctorAppointmentList = getDoctorAppointmentList;
const getDoctorDetailsAndAppointments = (db, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorQuery = `SELECT * FROM doctors_table WHERE id = :id`;
        const doctorResult = yield (0, exports.fetchResult)(db, doctorQuery, sequelize_1.QueryTypes.SELECT, {
            id,
        });
        if (!doctorResult.length) {
            throw new Error(`Doctor with ID ${id} not found`);
        }
        const appointmentQuery = `SELECT * FROM appoint_table WHERE doctor_id = :id`;
        const appointmentResult = yield (0, exports.fetchResult)(db, appointmentQuery, sequelize_1.QueryTypes.SELECT, { id });
        return {
            doctor: doctorResult[0],
            appointments: appointmentResult || [],
        };
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching data:", error.message);
        }
        else {
            console.error("Unexpected Error:", error);
        }
        throw new Error("Error fetching doctor details and appointments");
    }
});
exports.getDoctorDetailsAndAppointments = getDoctorDetailsAndAppointments;
const getAdminAppointmentList = (db) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Define the two queries
        const doctorsQuery = `SELECT * from doctors_table`;
        const appointmentsQuery = `SELECT * FROM appoint_table`;
        // Fetch results in parallel using Promise.all
        const [doctorsResult, appointmentsResult] = yield Promise.all([
            (0, exports.fetchResult)(db, doctorsQuery, sequelize_1.QueryTypes.SELECT),
            (0, exports.fetchResult)(db, appointmentsQuery, sequelize_1.QueryTypes.SELECT),
        ]);
        // Calculate the count of doctors and return both the count and appointments list
        const doctorsCount = doctorsResult.length;
        return {
            doctorsCount,
            appointments: appointmentsResult || [],
        };
    }
    catch (error) {
        // Handle errors properly
        if (error instanceof Error) {
            console.error("Error fetching doctors and appointments:", {
                message: error.message,
            });
            throw new Error("Unable to fetch doctors and appointments from the database");
        }
        else {
            console.error("Unexpected Error:", error);
            throw new Error("An unexpected error occurred while fetching doctors and appointments");
        }
    }
});
exports.getAdminAppointmentList = getAdminAppointmentList;
const confirmAppointment = (appointmentId, status, patientName, doctorId, fees) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (status === "Completed") {
            const getDoctorEarnings = `SELECT earnings from doctors_table WHERE id=:doctorId`;
            const doctorRresult = (yield (0, exports.fetchResult)(db_1.db, getDoctorEarnings, sequelize_1.QueryTypes.SELECT, { doctorId }));
            if (doctorRresult.length > 0) {
                const earnings = doctorRresult[0].earnings;
                const newEarning = earnings + fees;
                const updateEarningsQuery = `UPDATE doctors_table SET earnings=:newEarning WHERE id=:doctorId`;
                const result = yield (0, exports.fetchResult)(db_1.db, updateEarningsQuery, sequelize_1.QueryTypes.UPDATE, {
                    newEarning,
                    doctorId,
                });
            }
        }
        const updateAvailabilityQuery = `
      UPDATE appoint_table
      SET status = :status
      WHERE id = :appointmentId
    `;
        const result = yield (0, exports.fetchResult)(db_1.db, updateAvailabilityQuery, sequelize_1.QueryTypes.UPDATE, {
            status,
            appointmentId,
        });
        console.log("status result", result);
        return result;
    }
    catch (error) {
        console.error("Error updating status:", error);
        throw error;
    }
});
exports.confirmAppointment = confirmAppointment;
const deleteApppointment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteQuery = `DELETE  from appoint_table WHERE id=:id`;
        const result = yield (0, exports.fetchResult)(db_1.db, deleteQuery, sequelize_1.QueryTypes.DELETE, {
            id,
        });
        return result;
    }
    catch (error) {
        console.error("Error updating status:", error);
        throw error;
    }
});
exports.deleteApppointment = deleteApppointment;
const completeAppointment = (doctorId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateAvailabilityQuery = `
    UPDATE appoint_table 
    SET status = :status 
    WHERE id = :doctorId
  `;
        const result = yield (0, exports.fetchResult)(db_1.db, updateAvailabilityQuery, sequelize_1.QueryTypes.UPDATE, {
            status,
            doctorId,
        });
        return result;
    }
    catch (error) {
        console.error("Error updatings status:", error);
        throw error;
    }
});
exports.completeAppointment = completeAppointment;
const updateDoctorEarnings = (db, id, earnings) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `    UPDATE doctors_table 
    SET earnings = :earnings 
    WHERE id = :id `;
        const result = yield (0, exports.fetchResult)(db, query, sequelize_1.QueryTypes.SELECT, {
            earnings,
            id,
        });
        return result;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error updating earnings:", error.message);
        }
        else {
            console.error("Unknown error:", error);
        }
        throw new Error("Unable to update earnings");
    }
});
exports.updateDoctorEarnings = updateDoctorEarnings;
const registerAdmin = (userName, email, password, db) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = (0, uuid_1.v4)();
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const date = new Date();
        const role = "editor";
        console.log(date.toUTCString);
        const selectUserQuery = `SELECT * FROM admin_table WHERE email = :email`;
        const dbUser = yield (0, exports.fetchResult)(db, selectUserQuery, sequelize_1.QueryTypes.SELECT, {
            email,
        });
        if (dbUser && dbUser.length > 0) {
            throw new Error("admin already exists");
        }
        else {
            const createUserQuery = `
        INSERT INTO admin_table (id, name, email, password_hash,role) 
        VALUES (:userId, :userName, :email, :hashedPassword,:role)
      `;
            yield (0, exports.fetchResult)(db, createUserQuery, sequelize_1.QueryTypes.INSERT, {
                userId,
                userName,
                email,
                hashedPassword,
                role,
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
exports.registerAdmin = registerAdmin;
const updateDoctorProfile = (DoctorData, id, db, available) => __awaiter(void 0, void 0, void 0, function* () {
    const { about, adrLine1, imageUrl, adrLine2, fees } = DoctorData;
    try {
        const query = `UPDATE doctors_table SET about=:about, adr_line1=:adrLine1, adr_line2=:adrLine2, fees=:fees, doc_image_url=:imageUrl,
    availability=:available
     WHERE id=:id `;
        const result = yield (0, exports.fetchResult)(db, query, sequelize_1.QueryTypes.UPDATE, {
            about,
            adrLine1,
            adrLine2,
            fees,
            imageUrl,
            available,
            id,
        });
        return Array.isArray(result) && result.length > 0
            ? "Profile updated successfully"
            : "No changes made to the profile";
    }
    catch (error) {
        console.error("Error updating user profile:", error);
        throw new Error("Failed to update user profile");
    }
});
exports.updateDoctorProfile = updateDoctorProfile;
