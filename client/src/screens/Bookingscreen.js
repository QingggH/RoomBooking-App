import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
// import StripeCheckout from "react-stripe-checkout";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import Error from "../components/Error";
import {Map, Marker, NavigationControl, InfoWindow} from 'react-bmapgl';

function Bookingscreen({ match }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [room, setRoom] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  const roomid = match.params.roomid;
  const fromdate = moment(match.params.fromdate, "DD-MM-YYYY");
  const todate = moment(match.params.todate, "DD-MM-YYYY");
  // const data = {
  //   address:'town Bordowali Road no. 3, netaji chowmuhani , 799001',
  //   city:'Agartala',
  //   country:'India',
  // }
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      window.location.href = "/login";
    }
    async function fetchMyAPI() {
      try {
        setError("");
        setLoading(true);
        const data = (
          await axios.post("/api/rooms/getroombyid", {
            roomid: match.params.roomid,
          })
        ).data;
        //console.log(data);
        setRoom(data);
      } catch (error) {
        console.log(error);
        setError(error);
      }
      setLoading(false);
    }

    fetchMyAPI();
  }, []);

  useEffect(() => {
    const totaldays = moment.duration(todate.diff(fromdate)).asDays() + 1;
    setTotalDays(totaldays);
    setTotalAmount(totalDays * room.rentperday);
  }, [room]);

  const onToken = async () => {
    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem("currentUser"))._id,
      fromdate,
      todate,
      totalAmount,
      totaldays: totalDays,
      token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Njg0MDdmYmJmMWU5MjJiZjgwZWVlMWIiLCJpYXQiOjE3MTk5Mjg5MTYsImV4cCI6MTcyMDUzMzcxNn0.veIm6FW9A1XwOfn23wWat9TVsY6cjFpBwzUMxJ7D47U',
    };
    console.log('bookingDetails',bookingDetails);

    try {
      setLoading(true);
      const result = await axios.post("/api/bookings/bookroom", bookingDetails);
      setLoading(false);
      Swal.fire(
        "Congratulations",
        "Your Room Booked Successfully",
        "success"
      ).then((result) => {
        window.location.href = "/home";
      });
    } catch (error) {
      setError(error);
      Swal.fire("Opps", "Error:" + error, "error");
    }
    setLoading(false);
    //TESTING CARD
    //https://stripe.com/docs/testing
    //https://www.npmjs.com/package/react-stripe-checkout
    // fetch("/save-stripe-token", {
    //   method: "POST",
    //   body: JSON.stringify(token),
    // }).then((response) => {
    //   response.json().then((data) => {
    //     alert(`We are in business, ${data.email}`);
    //   });
    // });
  };
  const genOrder = async () => {
    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem("currentUser"))._id,
      fromdate,
      todate,
      totalAmount,
      totaldays: totalDays,
      token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Njg0MDdmYmJmMWU5MjJiZjgwZWVlMWIiLCJpYXQiOjE3MTk5Mjg5MTYsImV4cCI6MTcyMDUzMzcxNn0.veIm6FW9A1XwOfn23wWat9TVsY6cjFpBwzUMxJ7D47U',
    };
    console.log('bookingDetails',bookingDetails);

    try {
      setLoading(true);
      const result = await axios.post("/api/bookings/bookroom", bookingDetails);
      setLoading(false);
      Swal.fire(
        "Congratulations",
        "Your Room Booked Successfully",
        "success"
      ).then((result) => {
        window.location.href = "/home";
      });
    } catch (error) {
      setError(error);
      Swal.fire("Opps", "Error:" + error, "error");
    }
    setLoading(false);
  };

  return (
    <div className="m-5">
      {loading ? (
        <Loader></Loader>
      ) : error.length > 0 ? (
        <Error msg={error}></Error>
      ) : (
        <div className="row justify-content-center mt-5 bs aligin-items-center">
          <div className="col-md-4">
            <h1>{room.name}</h1>
            <img src={room.imageurls[0]} alt="" style={{width:'100%'}} className="bigimg" />
          </div>
          <div className="col-md-4" >
            
              <Map center={{lng: 120.8404789, lat: 40.7515443 }} zoom="11" style={{height:'100%'}}>
                    <Marker position={{lng: 120.8404789, lat: 40.7515443 }} />
                    <NavigationControl /> 
                </Map>
          </div>
          <div className="col-md-4">
            <div style={{ textAlign: "right" }}>
              <h1>Booking Details</h1>
              <hr />
              <b>
                <p>
                  Name : {JSON.parse(localStorage.getItem("currentUser")).name}
                </p>
                <p>From Date : {match.params.fromdate}</p>
                <p>To Date : {match.params.todate}</p>
                <p>Max Count : {room.maxcount}</p>
              </b>
            </div>
            <div style={{ textAlign: "right" }}>
              <h1>Amount</h1>
              <hr />
              <b>
                <p>Total Days : {totalDays}</p>
                <p>Rent per day : {room.rentperday}</p>
                <p>Total Amount : {totalAmount}</p>
              </b>
            </div>

            <div style={{ float: "right" }}>
              {/* <StripeCheckout
                amount={totalAmount * 100}
                currency="USD"
                token={onToken}
                stripeKey="YOUR PUBLIC STRIP API KEY"
              >
                <button className="btn btn-primary">Pay Now</button>
              </StripeCheckout> */}
                <button className="btn btn-primary" onClick={genOrder}>Pay Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookingscreen;
