const Hotel = require("../models/hotel.model");

const handleSearchHotel = async (req, res) => {
  try {
    let { destination, checkIn, checkOut, guests, clickedHotelName } =
      req.query;

    if (!destination) {
      return res.redirect("index");
    }
    
    destination =
      destination.charAt(0).toUpperCase() + destination.slice(1).toLowerCase();

    const searchedHotels = await Hotel.find({ hotelAddress: destination });

    return res.render("searchedHotel", {
      hotels: searchedHotels,
      checkIn: checkIn,
      checkOut: checkOut,
    });
  } catch (error) {
    console.error("Error searching for hotels:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

async function handleClickedHotel(req, res) {
  let { clickedHotelName, checkIn, checkOut } = req.query;

  const clickedHotel = await Hotel.findOne({ hotelName: clickedHotelName });
  // const hotelId = clickedHotel.hotelId;

  // console.log(clickedHotel);
  req.session.clickedHotel = clickedHotel;

  // return hotelId;

  
  res.render("hotelInfo", {
    clickedHotel: clickedHotel,
    checkIn: checkIn,
    checkOut: checkOut,
  });

  return clickedHotel;
}

const handleHotelInfo = async (req, res) => {
  try {
    const { checkIn, checkOut ,totalPrice} = req.body;

    // console.log("Check-in date from client:", checkIn);
    // console.log("Check-out date from client:", checkOut);

    const dates = {
      checkIn:checkIn,
      checkOut:checkOut
    }

    req.session.dates = dates;
    req.session.totalPrice = totalPrice;

    res.status(200).json({ message: "Data received successfully" });
  } catch (error) {
    console.error("Error handling hotel info:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  handleSearchHotel,
  handleClickedHotel,
  handleHotelInfo,
};
