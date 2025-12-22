console.log("SERVER FILE LOADED");

import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = 3001; // порт по заданию

/* ---------------- RANDOM USER ---------------- */
app.get("/api/user", async (req, res) => {
  try {
    const response = await axios.get("https://randomuser.me/api/");
    const u = response.data.results[0];

    res.json({
      firstName: u.name.first,
      lastName: u.name.last,
      gender: u.gender,
      age: u.dob.age,
      dob: u.dob.date.split("T")[0],
      city: u.location.city,
      country: u.location.country,
      address: `${u.location.street.name} ${u.location.street.number}`,
      picture: u.picture.large
    });
  } catch (err) {
    console.error("User API error:", err.message);
    res.status(500).json({ error: "User API error" });
  }
});

/* ---------------- COUNTRY ---------------- */
app.get("/api/country/:country", async (req, res) => {
  try {
    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${req.params.country}`
    );

    const c = response.data[0];

    res.json({
      name: c.name.common,
      capital: c.capital?.[0] || "N/A",
      languages: c.languages ? Object.values(c.languages) : [],
      currency: c.currencies ? Object.keys(c.currencies)[0] : "N/A",
      flag: c.flags.png
    });
  } catch (err) {
    console.error("Country API error:", err.message);
    res.status(500).json({ error: "Country API error" });
  }
});

/* ---------------- EXCHANGE ---------------- */
app.get("/api/exchange/:currency", async (req, res) => {
  try {
    console.log("EXCHANGE API REQUEST", req.params.currency);

    const response = await axios.get(
      `https://api.frankfurter.app/latest?from=${req.params.currency}`
    );

    const rates = response.data.rates || {};

    res.json({
      USD: rates.USD ?? "N/A",
      KZT: rates.KZT ?? "N/A"
    });
  } catch (err) {
    console.error("Exchange API error:", err.message);
    res.status(500).json({ error: "Exchange API error" });
  }
});

/* ---------------- NEWS ---------------- */
app.get("/api/news/:country", async (req, res) => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${req.params.country}&language=en&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`
    );

    const news = response.data.articles.map(a => ({
      title: a.title,
      description: a.description,
      image: a.urlToImage,
      url: a.url
    }));

    res.json(news);
  } catch (err) {
    console.error("News API error:", err.message);
    res.status(500).json({ error: "News API error" });
  }
});

/* ---------------- SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
