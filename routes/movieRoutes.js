import express from "express";
import { MovieModel } from "../models/Movie";

// Create an instance of the Express router
// The router method in this code is like setting up a map or a blueprint for handling different kinds of requests in a web application. It helps organize and define how the application should respond when someone visits different URLs. Think of it as creating a list of instructions for the app to follow when it receives specific requests, like "show me all tasks" or "register a new user." This makes the code neat and helps the app know what to do when someone interacts with it.
const router = express.Router();

//DEFINE ROUTES
// Get all movies
router.get('/movies', async (req, res) => {
    await MovieModel.find()
        .then((result) => res.json(result))
        .catch((error) => res.json(error));
});

// Get movie by ID
router.get('/movies/:id', async (req, res) => {
    const id = req.params.id
    if (isNaN(id)) {
        res.status(404).json({ error: "You must enter the number of the movie ID" })
        return
    }
    try {
        //Matching the id from param with a movie with the same movieID
        const movie = await MovieModel.findOne({ show_id: parseInt(id) })

        //Error message when a movie with required id does not exist
        if (!movie) {
            return res.status(404).json({ error: "A movie with the required id does not exist. Try again." })
        }
        res.json(movie)
    } catch (error) {
        res.json({ error: error.message })
    }
});

// Get movies by type (TV Show or Movie)
router.get('/movies/type/:type', async (req, res) => {
    const { type } = req.params;
    try {
        const moviesByType = await MovieModel.find({ type });
        res.json(moviesByType);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get movies by release year
router.get('/movies/year/:year', async (req, res) => {
    const { year } = req.params;
    try {
        const moviesByYear = await MovieModel.find({ release_year: Number(year) });
        res.json(moviesByYear);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get movies by rating
router.get('/movies/rating/:rating', async (req, res) => {
    const { rating } = req.params;
    try {
        const moviesByRating = await MovieModel.find({ rating });
        res.json(moviesByRating);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get paginated movies
router.get('/movies/page/:page', async (req, res) => {
    const { page } = req.params;
    const perPage = 10; // Items per page
    const skip = (page - 1) * perPage;

    try {
        const paginatedMovies = await MovieModel.find({})
            .skip(skip)
            .limit(perPage);
        res.json(paginatedMovies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;