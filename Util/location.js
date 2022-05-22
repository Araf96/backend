const API_KEY = "AIzaSyB79MhpgM_DZZOcZEyouthsJMoF-dAFu20";

const axios = require("axios");
const res = require("express/lib/response");

const getCoordinates = async (address) =>{
    const result = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}}&key=${API_KEY}`);
    if(result.data.status==="OK"){
        return {coordinates: result.data.results[0].geometry.location, status:"OK"};
    }else{
        return {message: "Area not found", status:"FAILED"};
    }
    
}

module.exports = getCoordinates;

