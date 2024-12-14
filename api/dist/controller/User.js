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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfileController = exports.cancelBookingController = exports.getAppController = exports.bookAppointmentController = exports.loginController = exports.registerController = exports.getUserController = exports.singleDocController = exports.specialityController = exports.userController = void 0;
const db_1 = require("../config/db");
const cloudinary_1 = require("cloudinary");
const User_1 = require("../service/User");
require("dotenv").config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const userController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctors = yield (0, User_1.getDoctors)(db_1.db);
        if (!doctors || doctors.length === 0) {
            return res.status(404).send({
                message: "No doctors found.",
                data: [],
            });
        }
        return res.status(200).send({
            data: doctors,
            message: "Doctors data retrieved successfully",
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Error in userController:", errorMessage);
        // Return a 500 status with error details
        return res.status(500).send({
            message: "Error retrieving doctors data",
            error: errorMessage,
        });
    }
});
exports.userController = userController;
const specialityController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const speciality = req.params.speciality;
    try {
        console.log(`Fetching specialists for: ${speciality}`);
        const result = yield (0, User_1.getSpecialist)(db_1.db, speciality);
        if (!result || result.length === 0) {
            return res.status(404).send({
                message: `No ${speciality} specialists found`,
            });
        }
        console.log("Specialists fetched successfully:", result);
        return res.status(200).send({
            data: result,
            message: `${speciality} doctors API call done`,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching specialists:", error.message);
            return res.status(500).send({
                message: `Error fetching ${speciality} doctors: ${error.message}`,
            });
        }
        console.error("Unknown error:", error);
        return res.status(500).send({
            message: "An unexpected error occurred while fetching specialists.",
        });
    }
});
exports.specialityController = specialityController;
const singleDocController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log(id);
    try {
        const result = yield (0, User_1.singleDoc)(db_1.db, id);
        if (!result) {
            return res.status(404).send({
                message: `Doctor with ID ${id} not found`,
            });
        }
        console.log(result);
        return res.status(200).send({
            data: result,
            message: "Doctor details fetched successfully",
        });
    }
    catch (error) {
        console.error("Error fetching doctor data:", error);
        return res.status(500).send({
            message: "An error occurred while fetching doctor details. Please try again.",
        });
    }
});
exports.singleDocController = singleDocController;
const getUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = user;
    try {
        const result = yield (0, User_1.getuser)(db_1.db, id);
        if (!result || result.length === 0) {
            return res.status(404).send({
                message: "User not found",
            });
        }
        console.log(result);
        return res.status(200).send({
            data: result,
            message: "User data fetched successfully",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching user data:", error.message);
            return res.status(500).send({
                message: error.message || "An error occurred while fetching user data.",
            });
        }
        else {
            console.error("Unknown error occurred:", error);
            return res.status(500).send({
                message: "An unknown error occurred while fetching user data.",
            });
        }
    }
});
exports.getUserController = getUserController;
const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, email, password } = req.body;
    console.log(userName, email, password);
    try {
        const imageUrl = "https://res.cloudinary.com/duzolgclw/image/upload/v1727961073/upload_area_ep8jrb.png";
        const result = yield (0, User_1.registerUser)(userName, email, password, imageUrl, db_1.db);
        console.log(result);
        return res.status(200).send({
            message: result,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === "User already exists") {
                return res.status(400).send({
                    message: `user with ${email} already exists`,
                });
            }
            else {
                console.error("Unexpected error:", error);
                return res.status(500).send("Internal server error");
            }
        }
    }
});
exports.registerController = registerController;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, email, password } = req.body;
    console.log(userName, email, password);
    try {
        const result = yield (0, User_1.loginUser)(email, password, db_1.db);
        console.log(result);
        return res.status(200).send({
            result,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === "User not found") {
                return res.status(400).send({
                    message: `User not found`,
                });
            }
            if (error.message === "Invalid password") {
                return res.status(400).send({
                    message: `Invalid password`,
                });
            }
            else {
                console.error("Unexpected error:", error);
                return res.status(500).send("Internal server error");
            }
        }
    }
});
exports.loginController = loginController;
const bookAppointmentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { doctorId, doctorName, image, department, fees, appointmentDate, appointmentDay, appointmentHour, adrLine1, adrLine2, patientName, age, imageUrl, status, } = req.body;
        console.log(doctorId);
        const user = req.user;
        const { id } = user;
        console.log("patientId:", id);
        const appointment_details = {
            patientId: id,
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
            patientName,
            age: age || null,
            imageUrl,
            status,
        };
        console.log(age);
        const result = yield (0, User_1.userAppointment)(appointment_details);
        return res.status(200).send({
            success: true,
            result,
        });
    }
    catch (error) {
        const errorMessage = error.message ||
            "An error occurred while booking the appointment.";
        console.error(`Error during booking appointment: ${errorMessage}`);
        return res.status(400).send({
            success: false,
            message: errorMessage || "An error occurred while booking the appointment.",
        });
    }
});
exports.bookAppointmentController = bookAppointmentController;
const getAppController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { id } = user;
        const result = yield (0, User_1.getAppointments)(db_1.db, id);
        if (!result || result.length === 0) {
            return res.status(404).json({
                message: "No appointments found",
            });
        }
        return res.status(200).json({
            data: result,
            message: "Appointments retrieved successfully",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching appointments:", error.message);
            return res.status(500).json({
                message: "Unable to fetch appointments",
                error: error.message,
            });
        }
        else {
            console.error("Unknown error:", error);
            return res.status(500).json({
                message: "Internal server error",
                error: "An unexpected error occurred",
            });
        }
    }
});
exports.getAppController = getAppController;
const cancelBookingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    console.log(status);
    try {
        const result = yield (0, User_1.cancelAppointment)(id, status);
        return res
            .status(200)
            .json({ message: "status updated successfully", result });
    }
    catch (error) {
        console.error("Error updating availability:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.cancelBookingController = cancelBookingController;
const updateUserProfileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, address, gender, birthday: dob, prevImageUrl, } = req.body;
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required fields.",
            });
        }
        const profileImage = req.file;
        let fileUrl = null;
        if (profileImage) {
            try {
                const uploadResponse = yield cloudinary_1.v2.uploader.upload(profileImage.path);
                fileUrl = uploadResponse.secure_url;
            }
            catch (uploadError) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload profile image.",
                });
            }
        }
        const user = req.user;
        const { id } = user;
        const userData = {
            name,
            email,
            imageUrl: fileUrl || prevImageUrl,
            phone: phone || null,
            gender: gender || null,
            dob: dob || null,
            address: address || null,
        };
        const result = yield (0, User_1.updateUserProfile)(userData, id, db_1.db);
        return res.status(200).json({
            success: true,
            message: result || "User profile updated successfully.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred. Please try again later.",
        });
    }
});
exports.updateUserProfileController = updateUserProfileController;
