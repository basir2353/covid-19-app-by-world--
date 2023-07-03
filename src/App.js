import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import CountryDetail from "./Components/CountryDetail";

const Item = styled(Paper)(({ theme }) => ({
  root: {
    width: "100%", // Set the width to 100%
    height: "100%", // Set the height to 100%
    margin: "0 auto",
    marginTop: 20,
    padding: theme.spacing(2),
    textAlign: "center",
    backgroundColor: "rgba(25, 118, 210, 0.8)", // Update the background color to a semi-transparent blue
    color: "#F9F9F9", // Update the text color to white
    borderRadius: 4,
    boxShadow:
      "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
    transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    display: "flex", // Update the display to flex
    flexDirection: "column", // Update the flex direction to column
    alignItems: "center", // Center the items horizontally
    justifyContent: "center", // Center the items vertically
  },
  "&.highlight": {
    backgroundColor: "#FFC107", // Custom color for highlighted items
  },
  "&.info": {
    backgroundColor: "#03A9F4", // Custom color for info items
  },
  "&.success": {
    backgroundColor: "#4CAF50", // Custom color for success items
  },
  "&.warning": {
    backgroundColor: "#FF9800", // Custom color for warning items
  },
}));

const Flag = styled("img")({
  width: 100, // Set the width of the flag image
  height: "auto", // Allow the height to adjust automatically
  objectFit: "contain",
  marginBottom: 10,
});

const Navbar = styled(AppBar)({
  marginBottom: 20,
});

const App = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [flagImages, setFlagImages] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://disease.sh/v3/covid-19/countries");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const countries = data.map((country) => ({
          country: country.country,
          cases: country.cases,
          deaths: country.deaths,
          recovered: country.recovered,
          alpha2Code: country.countryInfo.iso2,
        }));
        setSearchResults(countries);
      } catch (error) {
        console.error(error);
        // Handle the error appropriately
      }
    };
  
    fetchData();
  }, []);
  

  useEffect(() => {
    const fetchFlagImages = async () => {
      const response = await fetch("https://restcountries.com/v2/all");
      const data = await response.json();
      const flagImagesMap = {};
      for (const result of searchResults) {
        const countryData = data.find(
          (country) => country.alpha2Code === result.alpha2Code
        );
        if (countryData && countryData.flags.svg) {
          flagImagesMap[result.alpha2Code] = countryData.flags.svg;
        }
      }
      setFlagImages(flagImagesMap);
    };

    if (searchResults.length > 0) {
      fetchFlagImages();
    }
  }, [searchResults]);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredResults = searchResults.filter((result) =>
    result.country.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Router>
      <Box>
        <Navbar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              COVID-19 Tracker
            </Typography>
            <TextField
              id="search"
              label="Search"
              variant="outlined"
              size="small"
              value={searchValue}
              onChange={handleSearchChange}
              sx={{
                backgroundColor: "#FFF",
                margin: "0 10px",
                padding: "5px 10px",
              }}
            />
          </Toolbar>
        </Navbar>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3} sx={{ backgroundColor: "#1976d2" }}>
            <Grid item xs={12} sx={{ backgroundColor: "#1976d2" }}>
              <Link to="/world">
                <Item className="highlight">
                  <h3>World</h3>
                  <div>
                    <p>
                      Cases:{" "}
                      {searchResults.reduce(
                        (total, result) => total + result.cases,
                        0
                      )}
                    </p>
                    <p>
                      Deaths:{" "}
                      {searchResults.reduce(
                        (total, result) => total + result.deaths,
                        0
                      )}
                    </p>
                    <p>
                      Recovered:{" "}
                      {searchResults.reduce(
                        (total, result) => total + result.recovered,
                        0
                      )}
                    </p>
                  </div>
                </Item>
              </Link>
            </Grid>

            {filteredResults.map((result) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={result.country}>
                <Link to={`/country/${result.country}`}>
                  <Item>
                    <Flag src={flagImages[result.alpha2Code]} alt="" />
                    <h3>{result.country}</h3>
                    <div>
                      <p>Cases: {result.cases}</p>
                      <p>Deaths: {result.deaths}</p>
                      <p>Recovered: {result.recovered}</p>
                    </div>
                  </Item>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Routes>
  <Route path="/world" element={<CountryDetail searchResults={searchResults} />} />
  <Route path="/country/:country" element={<CountryDetail searchResults={searchResults} />} />
</Routes>

      </Box>
    </Router>
  );
};

export default App