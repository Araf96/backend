const axios = require("axios");

const getCoordinates = async (address) =>{
    console.log(process.env.GOOGLE_API_KEY)
    const result = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}}&key=${process.env.GOOGLE_API_KEY}`);
    if(result.data.status==="OK"){
        return {coordinates: result.data.results[0].geometry.location, status:"OK"};
    }else{
        return {message: "Area not found", status:"FAILED"};
    }
    
}

module.exports = getCoordinates;

