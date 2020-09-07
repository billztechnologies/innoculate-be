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
      "New Vaccination Booking!!!",
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
};
