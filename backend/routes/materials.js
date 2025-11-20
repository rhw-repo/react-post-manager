const express = require("express");

const {
  createMaterial,
  getMaterials,
  getMaterial,
  deleteMaterial,
  updateMaterial,
} = require("../controllers/materialController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/", getMaterials);

router.get("/:id", getMaterial);

router.post("/", createMaterial);

router.delete("/:id", deleteMaterial);

router.patch("/:id", updateMaterial);

module.exports = router;
