const router = require("express").Router();
const { register, login, logout, getList, addList, deleteList, editListItem } = require("../controllers/user");
const passport = require("passport");
const { isAuthenticated } = require("../utility/authMiddleware");

//get requests
router.get("/list", isAuthenticated, getList);
router.get("/logout", logout)
//test
router.get("/", async (req, res) => {
  try {
    res.send("gigity");
  } catch (err) {
    res.send(err);
  }
})

//post requests
router.post("/register", register);
router.post(
  "/login",
  passport.authenticate("local"),
  login
);

//put requests
router.put("/list", isAuthenticated, addList);
router.put("/list/edit/:id", isAuthenticated, editListItem);

//delete requests
router.delete("/list/:id", isAuthenticated, deleteList);

module.exports = router;
