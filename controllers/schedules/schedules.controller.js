const ScheduleModel = require("../../models/schedules/schedules.model");

exports.createSchedule = async (req, res) => {
  try {
    const newSchedule = await ScheduleModel.create(req.body);
    if (!newSchedule) {
      res.status(500).send({
        message: "Something went wrong!",
      });
    }
    res.status(200).send({
      message: "Scheduled successfully!",
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Something went wrong!",
    });
  }
};

exports.getSchedules = async (req, res) => {
  try {
    const newSchedule = await ScheduleModel.find({});
    if (!newSchedule.length) {
      res.status(404).send({
        message: "No schedule found!",
      });
    }
    res.status(200).send({
      message: "Scheduled successfully!",
      schedules: newSchedule,
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong!",
    });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    console.log(req.body)
    const newSchedule = await ScheduleModel.find({ _id: req.body._id });
    if (!newSchedule.length) {
      return res.status(404).send({
        message: "No schedule found!",
      });
    }
    const updatedSchedule = await ScheduleModel.updateOne(
      {
        _id: req.body._id,
      },
      req.body
    );
    if (!updatedSchedule) {
      return res.status(500).send({
        message: "Something went wrong!",
      });
    }
    res.status(200).send({
      message: "Schedule updated successfully!",
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong!",
    });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const newSchedule = await ScheduleModel.find({ _id: req.params._id });
    if (!newSchedule.length) {
      res.status(404).send({
        message: "No schedule found!",
      });
    }
    const deletedSchedule = await ScheduleModel.deleteOne({
      _id: req.params._id,
    });
    if (!deletedSchedule) {
      res.status(500).send({
        message: "Something went wrong!",
      });
    }
    res.status(200).send({
      message: "Schedule deleted successfully!",
      schedules: newSchedule,
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong!",
    });
  }
};
