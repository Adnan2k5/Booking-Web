import { Adventure } from "../models/adventure.model";

export const getAdventure = async (req, res) => {
    const {location, date, duration} = req.body;

    const adventures = await Adventure.find({location, date, duration}).sort({ date: 1 }).select('- enroled - instructors');

    return res.status(200).json(adventures);
}