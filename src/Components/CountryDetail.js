import React from "react";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const Item = styled(Paper)(({ theme }) => ({
  root: {
    width: "100%",
    height: "100%",
    margin: "0 auto",
    marginTop: 20,
    padding: theme.spacing(2),
    textAlign: "center",
    backgroundColor: "rgba(25, 118, 210, 0.8)",
    color: "#F9F9F9",
    borderRadius: 4,
    boxShadow:
      "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
    transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const CountryDetail = ({ searchResults }) => {
  const { country } = useParams();

  // Find the country by country name
  const selectedCountry = searchResults.find(
    (result) => result.country === country
  );

  if (!selectedCountry) {
    return (
      <Box>
        <Typography variant="h6">Country not found</Typography>
      </Box>
    );
  }

  const {
    cases,
    deaths,
    recovered,
    active,
    population,
    continent,
    currency,
    language,
    cities = [],
  } = selectedCountry;

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            Country Detail
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Item>
              <h3>{selectedCountry.country}</h3>
              <div>
                <p>Cases: {cases}</p>
                <p>Deaths: {deaths}</p>
                <p>Recovered: {recovered}</p>
                <p>Active Cases: {active}</p>
                <p>Population: {population}</p>
                <p>Continent: {continent}</p>
                <p>Currency: {currency}</p>
                <p>Language: {language}</p>
              </div>
            </Item>
          </Grid>
          {cities.map((city) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={city}>
              <Item>
                <h3>{city}</h3>
              </Item>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default CountryDetail;
