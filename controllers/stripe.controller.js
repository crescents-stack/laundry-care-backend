const MakePaymentIntendWithAmount = require("../config/stripe");


exports.GetSecret = async (req, res) => {
  try {
    console.log(req.body.amount, "Amount")
    const intent = await MakePaymentIntendWithAmount(req.body.amount || 0);
    if (!intent) {
      res.status(500).send({
        message: "Internal server error!",
      });
    }
    res.status(200).send({
      message: "Successfully generated Client Secret",
      client_secret: intent.client_secret
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error!",
    });
  }
};