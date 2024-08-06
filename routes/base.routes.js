const express = require("express");

const multer = require("multer");

const authController = require("../controllers/auth.controller");

const router = express.Router();

const db = require("../data/database");

const mongodb = require("mongodb");

const ObjectId = mongodb.ObjectId;

const storageConfiguration = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "imageStorage");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storageConfiguration });

router.get("/", function (req, res) {
  res.render("home");
});

router.get("/about", function (req, res) {
  res.render("about");
});

router.get("/warmup-player", function (req, res) {
  res.render("warmup/warmup-player");
});

router.get("/warmup-mc", function (req, res) {
  res.render("warmup/warmup-mc");
});

router.get("/warmup-technician", function (req, res) {
  res.render("warmup/warmup-technician");
});

router.get("/obstacle-player", function (req, res) {
  res.render("obstacle/obstacle-player");
});

router.get("/obstacle-mc", function (req, res) {
  res.render("obstacle/obstacle-mc");
});

router.get("/obstacle-technician", function (req, res) {
  res.render("obstacle/obstacle-technician");
});

router.get("/acceleration-player", function (req, res) {
  res.render("acceleration/acceleration-player");
});

router.get("/acceleration-mc", function (req, res) {
  res.render("acceleration/acceleration-mc");
});

router.get("/acceleration-technician", function (req, res) {
  res.render("acceleration/acceleration-technician");
});

router.get("/finish-player", function (req, res) {
  res.render("finish/finish-player");
});

router.get("/finish-mc", function (req, res) {
  res.render("finish/finish-mc");
});

router.get("/finish-technician", function (req, res) {
  res.render("finish/finish-technician");
});

router.get("/technician-main", function (req, res) {
  res.render("technician/technician-main");
});

router.get("/technician-management", function (req, res) {
  res.render("technician/technician-management");
});

router.get("/technician-score-management", function (req, res) {
  res.render("technician/technician-score-management");
});

router.get("/technician-upload", async function (req, res) {
  const tests = await db.getDb().collection("tests").find().toArray();

  res.render("technician/technician-upload", { tests: tests });
});

router.post("/technician-upload", async function (req, res) {
  let currentDate = new Date();
  let date = currentDate.toLocaleDateString();
  let time = currentDate.toLocaleTimeString();

  const testName = req.body.testName.trim();
  const tests = await db.getDb().collection("tests").find().toArray();

  for (const test of tests) {
    if (testName === test.name) {
      return res.redirect("/technician-upload");
    }
  }

  const newTest = {
    name: req.body.testName,
    date: date + " " + time,
  };

  const result = await db.getDb().collection("tests").insertOne(newTest);

  res.redirect("/technician-upload");
});

router.get("/technician-upload/:id", async function (req, res) {
  let testId = req.params.id;

  try {
    testId = new ObjectId(testId);
  } catch (error) {
    return res.status(404).render("404");
  }

  const test = await db.getDb().collection("tests").findOne({ _id: testId });

  if (!test) {
    return res.status(404).render("404");
  }

  res.render("technician/technician-test-editor", { test: test });
});

router.post("/technician-upload/:id/delete", async function (req, res) {
  const testId = new ObjectId(req.params.id);

  const test = await db.getDb().collection("tests").deleteOne({ _id: testId });
  const questions = await db
    .getDb()
    .collection("questions")
    .deleteMany({ testId: testId });

  res.redirect("/technician-upload");
});

router.get("/technician-upload/:id/acceleration", async function (req, res) {
  const testId = new ObjectId(req.params.id);

  const test = await db.getDb().collection("tests").findOne({ _id: testId });

  const questions = await db
    .getDb()
    .collection("questions")
    .find({ testId: testId, type: "acceleration" })
    .toArray();

  res.render("technician/technician-test-editor-acceleration", {
    test: test,
    questions: questions,
  });
});

router.post(
  "/technician-upload/:id/acceleration",
  upload.single("fileUpload"),
  async function (req, res) {

    const testId = new ObjectId(req.params.id);

    const uploadedImage = req.file;
    console.log(uploadedImage)

    const newQuestion = {
      testId: testId,
      type: "acceleration",
      content: req.body.question,
      answer: req.body.answer,
      imagePath: uploadedImage.path
    };

    const test = await db
      .getDb()
      .collection("questions")
      .insertOne(newQuestion);

    res.redirect("/technician-upload/" + req.params.id + "/acceleration");
  }
);

router.get(
  "/technician-upload/:id1/acceleration/:id2",
  async function (req, res) {
    const testId = new ObjectId(req.params.id1);

    const questionId = new ObjectId(req.params.id2);

    //const test1 = await db.getDb().collection("tests").findOne({ _id: testId });

    const question = await db
      .getDb()
      .collection("questions")
      .findOne({ testId: testId, _id: questionId });

    res.render("technician/technician-test-editor-acceleration", {
      question: question,
    });
  }
);

router.post(
  "/technician-upload/:id1/acceleration/:id2/delete",
  async function (req, res) {
    const testId = new ObjectId(req.params.id1);

    const questionId = new ObjectId(req.params.id2);

    const test = await db
      .getDb()
      .collection("questions")
      .deleteOne({ testId: testId, _id: questionId });

    res.redirect("/technician-upload/" + req.params.id1 + "/acceleration");
  }
);

module.exports = router;
