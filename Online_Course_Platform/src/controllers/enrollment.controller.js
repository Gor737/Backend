const {
  createEnrollmentService,
  getMyEnrollmentsService,
  updateEnrollmentProgressService,
  deleteEnrollmentService,
  getEnrollmentsService,
} = require("../services/enrollment.service");
const asyncHandler = require("../utils/asyncHandler");

const createEnrollmentController = asyncHandler(async (req, res) => {
  const response = await createEnrollmentService(req.body, req.user);
  res.status(201).send({
    success: true,
    data: response,
  });
});

const getMyEnrollmentsController = asyncHandler(async (req, res) => {
  const response = await getMyEnrollmentsService(req.user.id);
  res.status(200).send({
    success: true,
    data: response,
  });
});

const updateEnrollmentProgressController = asyncHandler(async (req, res) => {
  const response = await updateEnrollmentProgressService(
    req.params.id,
    req.body,
    req.user,
  );
  res.status(200).send({
    success: true,
    data: response,
  });
});

const deleteEnrollmentController = asyncHandler(async (req, res) => {
  const response = await deleteEnrollmentService(req.params.id, req.user);
  res.status(200).send({
    success: true,
    data: response,
  });
});

const getEnrollmentsController = asyncHandler(async (req, res) => {
  const response = await getEnrollmentsService();
  res.status(200).send({
    success: true,
    data: response,
  });
});

module.exports = {
  createEnrollmentController,
  getMyEnrollmentsController,
  updateEnrollmentProgressController,
  deleteEnrollmentController,
  getEnrollmentsController,
};
