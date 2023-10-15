const ServicesModel = require("../../models/services/services.model");

exports.createService = async (req, res) => {
  try {
    const isServiceExist = await ServicesModel.find({
      service: req.body.service,
    });
    if (isServiceExist.length) {
      return res.status(409).send({
        message: "Service already exists!",
      });
    }
    const createdService = await ServicesModel.create(req.body)
    if (!createdService) {
      return res.status(500).send({
        message: "Somthing went wrong!",
      });
    }

    res.status(200).send({
      message: "Service created successfully!",
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong!",
    });
  }
};

exports.getServices = async (req, res) => {
  try {
    const isServiceExist = await ServicesModel.find({});
    if (!isServiceExist.length) {
      return res.status(404).send({
        message: "No service exists!",
      });
    }
    res.status(200).send({
      message: "Services fetched successfully!",
      services: isServiceExist,
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong!",
    });
  }
};

exports.updateService = async (req, res) => {
  try {
    const isServiceExist = await ServicesModel.find({ _id: req.body._id });
    if (!isServiceExist.length) {
      return res.status(404).send({
        message: "No service exists!",
      });
    }
    const updatedService = await ServicesModel.updateOne(
      { _id: req.body._id },
      req.body
    );
    if (!updatedService) {
      return res.status(500).send({
        message: "Something went wrong!",
      });
    }
    res.status(200).send({
      message: "Services Update successfully!",
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong!",
    });
  }
};

exports.deleteServices = async (req, res) => {
  try {
    const isServiceExist = await ServicesModel.find({ _id: req.params._id });
    if (!isServiceExist.length) {
      return res.status(404).send({
        message: "No service exists!",
      });
    }
    const isDeleted = await ServicesModel.deleteOne({ _id: req.params._id });
    if (!isDeleted) {
      return res.status(500).send({
        message: "Something went wrong!",
      });
    }
    res.status(200).send({
      message: "Services delete successfully!",
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong!",
    });
  }
};
