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
exports.updateDoctorProfileController1 = exports.updateDoctorProfileController = exports.registerAdminController = exports.updateEarningsController = exports.completeBookingController = exports.deleteApppointmentController = exports.confirmBookingController = exports.getAdminAppointmentListController = exports.getDoctorProfileAndAppointmentsController = exports.getDoctorAppointmentController = exports.newDoctorAppointmentList = exports.adminLoginController = exports.doctorLoginController = exports.updateDoctorAvailabilityController = exports.addDoctorController = exports.adminDocController = exports.singleAdminController = exports.singleDocController = exports.adminController = void 0;
const db_1 = require("../config/db");
const Admin_1 = require("../service/Admin");
const cloudinary_1 = require("cloudinary");
const Admin_2 = require("../service/Admin");
require("dotenv").config();
const adminController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dbname = db_1.db;
    const result = yield (0, Admin_1.getAdmin)(db_1.db);
    console.log(result);
    return res.status(200).send({
        data: result,
        message: "Basic Api Call Done",
    });
});
exports.adminController = adminController;
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const singleDocController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.docInfo;
        const { id } = doctor;
        console.log(doctor);
        if (!doctor || !id) {
            return res.status(400).send({
                message: "Doctor information is missing or invalid.",
            });
        }
        const result = yield (0, Admin_1.singleDoc)(db_1.db, id);
        console.log("Doctor Details Fetched:", result);
        return res.status(200).send({
            data: result,
            message: "Doctor details fetched successfully.",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in singleDocController:", error.message);
            const statusCode = error.message.includes("not found") ? 404 : 500;
            return res.status(statusCode).send({
                message: error.message || "An unexpected error occurred.",
            });
        }
        console.error("Unknown error:", error);
        return res.status(500).send({
            message: "An unexpected error occurred while processing your request.",
        });
    }
});
exports.singleDocController = singleDocController;
const singleAdminController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Admin = req.adminInfo;
        const { id } = Admin;
        console.log(Admin);
        if (!Admin || !id) {
            return res.status(400).send({
                message: "Admin information is missing or invalid.",
            });
        }
        const result = yield (0, Admin_1.singleAdmin)(db_1.db, id);
        console.log("Admin Details Fetched:", result);
        return res.status(200).send({
            data: result,
            message: "Admin details fetched successfully.",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in singleAdminController:", error.message);
            const statusCode = error.message.includes("not found") ? 404 : 500;
            return res.status(statusCode).send({
                message: error.message || "An unexpected error occurred.",
            });
        }
        console.error("Unknown error:", error);
        return res.status(500).send({
            message: "An unexpected error occurred while processing your request.",
        });
    }
});
exports.singleAdminController = singleAdminController;
const adminDocController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).send({
                message: "Doctor information is missing or invalid.",
            });
        }
        const result = yield (0, Admin_1.adminSingleDoc)(db_1.db, id);
        console.log("Doctor Details Fetched:", result);
        return res.status(200).send({
            data: result,
            message: "Doctor details fetched successfully.",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in singleDocController:", error.message);
            const statusCode = error.message.includes("not found") ? 404 : 500;
            return res.status(statusCode).send({
                message: error.message || "An unexpected error occurred.",
            });
        }
        console.error("Unknown error:", error);
        return res.status(500).send({
            message: "An unexpected error occurred while processing your request.",
        });
    }
});
exports.adminDocController = adminDocController;
const addDoctorController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, experience, fees, degree, speciality, address1, address2, about, } = req.body;
        const file = req.file;
        console.log(file);
        let fileUrl = null;
        if (file) {
            const uploadResponse = yield cloudinary_1.v2.uploader.upload(file.path);
            fileUrl = uploadResponse.secure_url;
        }
        const doctorData = {
            name,
            email,
            password,
            experience,
            fees,
            degree,
            speciality,
            address1,
            address2,
            about,
            imageUrl: fileUrl || undefined,
        };
        const result = yield (0, Admin_1.createDoctor)(doctorData);
        return res.status(201).json({
            success: true,
            message: "Doctor added successfully",
            doctor: result,
        });
    }
    catch (error) {
        console.error("Error adding doctor:", error);
        return res
            .status(500)
            .json({ success: false, message: "Failed to add doctor" });
    }
});
exports.addDoctorController = addDoctorController;
const updateDoctorAvailabilityController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { available } = req.body;
    try {
        const result = yield (0, Admin_2.updateDoctorAvailability)(id, available);
        return res
            .status(200)
            .json({ message: "Availability updated successfully", result });
    }
    catch (error) {
        console.error("Error updating availability:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateDoctorAvailabilityController = updateDoctorAvailabilityController;
const doctorLoginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        const result = yield (0, Admin_1.loginDoctor)(email, password, db_1.db);
        console.log(result);
        return res.status(200).send({
            result,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === "Doctor not found") {
                return res.status(400).send({
                    message: `Doctor not found`,
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
exports.doctorLoginController = doctorLoginController;
const adminLoginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        const result = yield (0, Admin_1.loginAdmin)(email, password, db_1.db);
        console.log(result);
        return res.status(200).send({
            result,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === `Admin with email ${email} does not exists`) {
                return res.status(400).send({
                    message: `Admin with email ${email} does not exists`,
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
exports.adminLoginController = adminLoginController;
const newDoctorAppointmentList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Doctor = req.docInfo;
        if (!Doctor) {
            return res.status(401).json({ message: "Doctor information is missing" });
        }
        const { id } = Doctor;
        const result = yield (0, Admin_1.getNewDoctorAppointmentList)(db_1.db, id);
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
exports.newDoctorAppointmentList = newDoctorAppointmentList;
const getDoctorAppointmentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Doctor = req.docInfo;
        const { id } = Doctor;
        const result = yield (0, Admin_1.getDoctorAppointmentList)(db_1.db, id);
        if (result.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No appointments available",
                data: [],
            });
        }
        return res.status(200).json({
            data: result,
            message: "Appointments retrieved successfully",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching appointments:", error.stack || error.message);
            return res.status(500).json({
                success: false,
                message: "Unable to fetch appointments",
                error: error.message,
            });
        }
        else {
            console.error("Unknown error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: "An unexpected error occurred",
            });
        }
    }
});
exports.getDoctorAppointmentController = getDoctorAppointmentController;
const getDoctorProfileAndAppointmentsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Doctor = req.docInfo;
        const { id } = Doctor;
        const data = yield (0, Admin_1.getDoctorDetailsAndAppointments)(db_1.db, id);
        return res.status(200).send({
            data,
            message: "Doctor details and appointments fetched successfully",
        });
    }
    catch (error) {
        console.error("Error fetching doctor profile and appointments:", error);
        return res.status(500).send({
            message: "An error occurred while fetching doctor details and appointments",
        });
    }
});
exports.getDoctorProfileAndAppointmentsController = getDoctorProfileAndAppointmentsController;
const getAdminAppointmentListController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, Admin_1.getAdminAppointmentList)(db_1.db);
        return res.status(200).json({
            success: true,
            message: "Appointments retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching appointments:", error.stack || error.message);
            return res.status(500).json({
                success: false,
                message: "Unable to fetch appointments",
                error: error.message,
            });
        }
        else {
            console.error("Unknown error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: "An unexpected error occurred",
            });
        }
    }
});
exports.getAdminAppointmentListController = getAdminAppointmentListController;
const confirmBookingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { statusText } = req.body;
    const { patientName } = req.body;
    const { doctorId } = req.body;
    const { fees } = req.body;
    console.log("status", statusText);
    try {
        const result = yield (0, Admin_1.confirmAppointment)(id, statusText, patientName, doctorId, fees);
        return res.status(200).json({
            message: `${patientName}'s Appointment ${statusText} successfully`,
            result,
        });
    }
    catch (error) {
        console.error("Error updating availability:", error);
        if (error instanceof Error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error.message || "An unexpected error occurred",
            });
        }
    }
});
exports.confirmBookingController = confirmBookingController;
const deleteApppointmentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { patientName } = req.body;
    try {
        const result = yield (0, Admin_1.deleteApppointment)(id);
        return res.status(200).json({
            message: `${patientName}'s Appointment Deleted successfully`,
            result,
        });
    }
    catch (error) {
        console.error("Error deleting Appointment:", error);
        if (error instanceof Error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error.message || "An unexpected error occurred",
            });
        }
    }
});
exports.deleteApppointmentController = deleteApppointmentController;
const completeBookingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    console.log("status", status);
    try {
        const result = yield (0, Admin_1.completeAppointment)(id, status);
        return res
            .status(200)
            .json({ message: "status updated successfully", result });
    }
    catch (error) {
        console.error("Error updating availability:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.completeBookingController = completeBookingController;
const updateEarningsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Doctor = req.docInfo;
        console.log(Doctor);
        const { id } = Doctor;
        const result = yield (0, Admin_1.updateDoctorEarnings)(db_1.db, id, req.body.earnings);
        return res.status(200).json({
            message: "earnings Updated",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error update Earnings:", error.message);
            return res.status(500).json({
                message: "Unable to update Earnings",
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
exports.updateEarningsController = updateEarningsController;
const registerAdminController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, email, password } = req.body;
    console.log(userName, email, password);
    try {
        const result = yield (0, Admin_1.registerAdmin)(userName, email, password, db_1.db);
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
exports.registerAdminController = registerAdminController;
const updateDoctorProfileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { about, fees, adrLine1, adrLine2, prevImageUrl, availability } = req.body;
        const available = availability === "true" ? true : false;
        const Image = req.file;
        let fileUrl = null;
        if (Image) {
            try {
                const uploadResponse = yield cloudinary_1.v2.uploader.upload(Image.path);
                fileUrl = uploadResponse.secure_url;
            }
            catch (uploadError) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload profile image.",
                });
            }
        }
        const { id } = req.params;
        const DoctorData = {
            about,
            fees,
            imageUrl: fileUrl || prevImageUrl,
            adrLine1,
            adrLine2,
        };
        const result = yield (0, Admin_1.updateDoctorProfile)(DoctorData, id, db_1.db, available);
        return res.status(200).json({
            success: true,
            message: result || "Doctor profile updated successfully.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred. Please try again later.",
        });
    }
});
exports.updateDoctorProfileController = updateDoctorProfileController;
const updateDoctorProfileController1 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { about, fees, adrLine1, adrLine2, prevImageUrl, availability } = req.body;
        const available = availability === "true" ? true : false;
        const DoctorImage = req.file;
        let fileUrl = null;
        if (DoctorImage) {
            try {
                const uploadResponse = yield cloudinary_1.v2.uploader.upload(DoctorImage.path);
                fileUrl = uploadResponse.secure_url;
            }
            catch (uploadError) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload profile image.",
                });
            }
        }
        const Doctor = req.docInfo;
        const { id } = Doctor;
        const DoctorData = {
            about,
            fees,
            imageUrl: fileUrl || prevImageUrl,
            adrLine1,
            adrLine2,
        };
        const result = yield (0, Admin_1.updateDoctorProfile)(DoctorData, id, db_1.db, available);
        return res.status(200).json({
            success: true,
            message: result || "Doctor profile updated successfully.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred. Please try again later.",
        });
    }
});
exports.updateDoctorProfileController1 = updateDoctorProfileController1;
