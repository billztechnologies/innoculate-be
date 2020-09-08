const emailService = require("../services/emailServices");

module.exports = {
  email: (req, res) => {
    const {radioservice, preferredhub, lga, state,vaccines} = req.body;
    const {firstname, lastname, email, phone, age, gender, time, address, zipcode, paymentStatus, brandschosen, totalprice} = req.body
    const allVaccines = []
    const allBrands =[]
    const vacc = function(){
      for(let i =0; i < vaccines.length; i++){
        allVaccines.push(vaccines[i].name)
        allBrands.push(brandschosen[i].name + ' ' + brandschosen[i].price)
      }
    }

    vacc();
    emailService.sendText(
      ["hammed@inocul8.com.ng", "eegbroko@inocul8.com.ng", "omomoh@inocul8.com.ng", "mahilday17@gmail.com"],
      "New Vaccination Booking(Myself)!!!",
      [`Place of vaccination: ${radioservice}`,`Name: ${firstname + ' ' + lastname}`, `Email: ${email}`, `State: ${state}`, `Local govt: ${lga}`, `Preferred Hub: ${preferredhub}`,`Vaccines: ${allVaccines}`, `Vaccine brands: ${allBrands}`, `Total Vaccine price: ${totalprice}`, `Payment Status: ${paymentStatus}`, `Phone: ${phone}`, `Age: ${age}`, `Gender: ${gender}`, `Time: ${time}`, `Address(Zip code): ${address + `(${zipcode})`}` ]
    )
      .then(() => {
        res.status(200).json({message: "Email sent"});
        console.log("message sent", allVaccines);
      })
      .catch(() => {
        res.status(500).json({ message: "Internal Error" });
        console.log("Error", vaccines.forEach(vacc => vacc));
      });
  },

  emailFam: (req, res) => {
    const {radioservicefam, preferredhubfam, lgafam, statefam, timefam, paymentStatus, addressfam, totalprice} = req.body;

  let profile = req.body.profile.length
   
    emailService.sendText(
      ["hammed@inocul8.com.ng", "eegbroko@inocul8.com.ng", "omomoh@inocul8.com.ng", "mahilday17@gmail.com"],
      "New Vaccination Booking(Myself and Family)!!!",
      [`Place of vaccination: ${radioservicefam}`,`State: ${statefam}`, `Local govt: ${lgafam}`, `Preferred Hub: ${preferredhubfam}`, `Total Vaccine price: ${totalprice}`, `Payment Status: ${paymentStatus}`, `Number of people: family of ${profile}`, `Time: ${timefam}`, `Address: ${addressfam}` ]
    )
      .then(() => {
        res.status(200).json({message: "Email sent"});
        console.log("message sent");
      })
      .catch(() => {
        res.status(500).json({ message: "Internal Error" });
        console.log("Error");
      });
  },
  emailCorp: (req, res) => {
    const {fullname, email, companydetails,phone, questions} = req.body;

   
    emailService.sendText(
      ["hammed@inocul8.com.ng", "eegbroko@inocul8.com.ng", "omomoh@inocul8.com.ng", "mahilday17@gmail.com"],
      "New Vaccination Booking(Corporate)!!!",
      [`Fullname: ${fullname}`, `Email: ${email}`, `Company Name: ${companydetails.companyname}`,`Address: ${companydetails.address}`, `Number of Staff: ${companydetails.nofstaff}`,`Phone: ${phone}`, `Question: ${questions}`]
    )
      .then(() => {
        res.status(200).json({message: "Email sent"});
        console.log("message sent");
      })
      .catch(() => {
        res.status(500).json({ message: "Internal Error" });
        console.log("Error");
      });
  },
};
