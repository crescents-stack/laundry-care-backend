exports.createSchedule = async (req, res) => {
  try {
    res.status(200).send({
      message: "Schedules!",
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong!",
    });
  }
};
