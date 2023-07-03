import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const Item = styled(Paper)(({ theme }) => ({
  root: {
    maxWidth: 400,
    margin: '0 auto',
    marginTop: 20,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  },
  '&.highlight': {
    backgroundColor: '#FFC107', // Custom color for highlighted items
  },
  '&.info': {
    backgroundColor: '#03A9F4', // Custom color for info items
  },
  '&.success': {
    backgroundColor: '#4CAF50', // Custom color for success items
  },
  '&.warning': {
    backgroundColor: '#FF9800', // Custom color for warning items
  },
}));

const Flag = styled('img')({
  width: '100%',
  maxHeight: 150,
  objectFit: 'contain',
  marginBottom: 10,
});

const Navbar = styled(AppBar)({
  marginBottom: 20,
});

const InfoPanel = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [flagImages, setFlagImages] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://api.covid19api.com/summary`);
      const data = await response.json();
      const countries = data.Countries.map((country) => ({
        country: country.Country,
        cases: country.TotalConfirmed,
        deaths: country.TotalDeaths,
        recovered: country.TotalRecovered,
        alpha2Code: country.CountryCode.toLowerCase(),
      }));
      setSearchResults(countries);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFlagImages = async () => {
      const fetchData = async (result) => {
        const response = await fetch(
          `https://www.countryflags.io/${result.alpha2Code}/flat/64.png`
        );
        if (response.ok) {
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        }
        return null;
      };

      const flagImagesMap = {};
      for (const result of searchResults) {
        const dataUrl = await fetchData(result);
        if (dataUrl) {
          flagImagesMap[result.alpha2Code] = dataUrl;
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
          />
        </Toolbar>
      </Navbar>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {filteredResults.map((result) => (
            <Grid item xs={12} key={result.country}>
              <Item>
                {flagImages[result.alpha2Code] && (
                  <Flag src={flagImages[result.alpha2Code]} alt={`${result.country} Flag`} />
                )}
                <h3>{result.country}</h3>
                <div>
                  <p>Cases: {result.cases}</p>
                  <p>Deaths: {result.deaths}</p>
                  <p>Recovered: {result.recovered}</p>
                </div>
              </Item>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default InfoPanel;
