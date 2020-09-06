const emailService = require("../services/emailServices");

module.exports = {
  email: (req, res) => {
    const {radioservice, preferredhub, lga, state,vaccine} = req.body;
    const {firstname, lastname, email, phone, age, gender, time} = req.body.profile
    const {address, zipcode} = req.body.profile.address
    emailService.sendText(
      ["mahilday17@gmail.com", "tilda.imadojiemu@gmail.com"],
      "New Vaccination Booking!!!",
      [`Place of vaccination: ${radioservice}`,`Name: ${firstname + ' ' + lastname}`, `Email: ${email}`, `State: ${state}`, `Local govt: ${lga}`, `Preferred Hub: ${preferredhub}`,`Phone: ${phone}`, `Age: ${age}`, `Gender: ${gender}`, `Time: ${time}`, `Address(Zip code): ${address + `(${zipcode})`}` ]
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
