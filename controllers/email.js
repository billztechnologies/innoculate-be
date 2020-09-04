const emailService = require("../services/emailServices");

module.exports = {
  email: (req, res) => {
    const {radioservice, preferredhub, lga, state, profile,vaccine} = req.body;
    emailService.sendText(
      ["mahilday17@gmail.com", "tilda.imadojiemu@gmail.com"],
      "Awesome!",
      [radioservice, preferredhub, lga, state, profile, vaccine ]
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
