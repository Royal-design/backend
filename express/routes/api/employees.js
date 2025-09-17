import express from "express";
import employees from "../../data/employees.js";

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.json(employees);
  })
  .post((req, res) => {
    res.json({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
  })
  .put((req, res) => {
    res.json({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
  })
  .delete((req, res) => {
    res.json({ id: req.body.id });
  });
router.route("/:id").get((req, res) => {
  res.json({ id: req.params.id });
});

export default router;
