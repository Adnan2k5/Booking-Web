import { Adventure } from "../models/adventure.model.js";

export const getAdventure = async (req, res) => {
    const {location, date, duration} = req.body;

    const adventures = await Adventure.find({location, date, duration}).sort({ date: 1 }).select('-enrolled -instructors');

    return res.status(200).json(adventures);
}

export const createAdventure = async (req, res) => {
    const {name, description, location, date, image, exp, instructor} = req.body;

    
};

export const updateAdventure = async (req, res) => {};

export const deleteAdventure = async (req, res) => {};

export const enrollAdventure = async (req, res) => {};

export const unenrollAdventure = async (req, res) => {};

export const getEnrolledAdventures = async (req, res) => {};

export const getInstructorAdventures = async (req, res) => {};

export const getAdventureById = async (req, res) => {};