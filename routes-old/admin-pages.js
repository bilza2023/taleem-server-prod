
import express from "express";
import path from "path";

const router = express.Router();

const ADMIN_PAGES = path.resolve("admin-pages");

////////////////////////////////////////////////////
////////////////////////////////////////////////////

// --------------------------------------------------
// Administration Pages
// --------------------------------------------------

router.get("/", (req, res) => {
	res.sendFile(path.join(ADMIN_PAGES, "index.html"));
});

router.get("/login", (req, res) => {
	res.sendFile(path.join(ADMIN_PAGES, "login.html"));
});

router.get("/dashboard", (req, res) => {
	res.sendFile(path.join(ADMIN_PAGES, "dashboard.html"));
});


// --------------------------------------------------
// Course Pages
// --------------------------------------------------

router.get("/course", (req, res) => {
	res.sendFile(
		path.join(ADMIN_PAGES, "course", "index.html")
	);
});

router.get("/course/dashboard", (req, res) => {
	res.sendFile(
		path.join(ADMIN_PAGES, "course", "dashboard.html")
	);
});


// --------------------------------------------------
// Library Pages
// --------------------------------------------------

// router.get("/course/library", (req, res) => {
// 	res.sendFile(
// 		path.join(ADMIN_PAGES, "course", "library", "index.html")
// 	);
// });

router.get("/course/library", (req, res) => {

	console.log("COURSE LIBRARY PAGE");

	res.send("course library page");

});

router.get("/course/library/new", (req, res) => {
	res.sendFile(
		path.join(ADMIN_PAGES, "course", "library", "new.html")
	);
});

router.get("/course/library/edit", (req, res) => {
	res.sendFile(
		path.join(ADMIN_PAGES, "course", "library", "edit.html")
	);
});

router.get("/course/library/delete", (req, res) => {
	res.sendFile(
		path.join(ADMIN_PAGES, "course", "library", "delete.html")
	);
});


// --------------------------------------------------
// Communication Pages
// --------------------------------------------------

router.get("/course/communication", (req, res) => {
	res.sendFile(
		path.join(ADMIN_PAGES, "course", "communication", "index.html")
	);
});

router.get("/course/communication/reply", (req, res) => {
	res.sendFile(
		path.join(ADMIN_PAGES, "course", "communication", "reply.html")
	);
});


// --------------------------------------------------
// Subscription Pages
// --------------------------------------------------

router.get("/course/subscription", (req, res) => {
	res.sendFile(
		path.join(ADMIN_PAGES, "course", "subscription", "index.html")
	);
});

router.get("/course/subscription/new", (req, res) => {
	res.sendFile(
		path.join(ADMIN_PAGES, "course", "subscription", "new.html")
	);
});

router.get("/course/subscription/edit", (req, res) => {
	res.sendFile(
		path.join(ADMIN_PAGES, "course", "subscription", "edit.html")
	);
});

router.get("/course/subscription/delete", (req, res) => {
	res.sendFile(
		path.join(ADMIN_PAGES, "course", "subscription", "delete.html")
	);
});


// --------------------------------------------------
// Course Admin Pages
// --------------------------------------------------

router.get("/course/admin", (req, res) => {
	res.sendFile(
		path.join(ADMIN_PAGES, "course", "admin", "index.html")
	);
});

router.get("/course/admin/new", (req, res) => {
	res.sendFile(
		path.join(ADMIN_PAGES, "course", "admin", "new.html")
	);
});

router.get("/course/admin/delete", (req, res) => {
	res.sendFile(
		path.join(ADMIN_PAGES, "course", "admin", "delete.html")
	);
});

////////////////////////////////////////////////////
////////////////////////////////////////////////////
export default router;