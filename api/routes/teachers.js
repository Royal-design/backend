import express from "express";

const router = express.Router();
router.get("/", (req, res) => {
  res.send("get all teachers");
});
router.post("/create", (req, res) => {
  res.send("create teacher");
});
router.put("/update/:id", (req, res) => {
  res.send(`update teacher ${req.params.id}`);
});
router.delete("/delete/:id", (req, res) => {
  res.send(`delete teacher ${req.params.id}`);
});

export default router;
