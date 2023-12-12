if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}


const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const mysql = require("mysql");
const mysqlStore = require("express-mysql-session")(session);
const app = express();
const db = require("./db");

const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");

const PORT = process.env.APP_PORT || 3000;
const IN_PROD = process.env.NODE_ENV === "production";
const TWO_HOURS = 1000 * 60 * 60 * 2;

const options = {
  connectionLimit: 10,
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  database: process.env.MYSQL_DB,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  createDatabaseTable: true,
};

const pool = mysql.createPool(options);
const sessionStore = new mysqlStore(options, pool);


// Refreshes the browser on server restart from Nodemon
app.use(connectLiveReload());
const liveReloadeServer = livereload.createServer();
liveReloadeServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadeServer.refresh("/")
  }, 100);
});

// Sets the view engine as Embedded JavaScript templates as templating language

app.set("view engine", "ejs");

// Serves static files via Express
app.use(express.static(path.join(__dirname, "public")));

// Parses the encoded URL info
// app.use(express.urlencoded( {extended: true}));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

app.use(
    session({
        name: process.env.SESS_NAME,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        secret: process.env.SESS_SECRET,
        cookie: {
        maxAge: TWO_HOURS,
        sameSite: true,
        secure: IN_PROD,
        },
    })
);


const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("/login");
  } else {
    next();
  }
};

const redirectHome = (req, res, next) => {
  if (req.session.userId) {
    res.redirect("/home");
  } else {
    next();
  }
};

// Get routes

app.get("/", redirectHome, (req, res) => {
  res.render("pages/landing");
});

app.get("/signup", redirectHome, (req, res) => {
    res.render("pages/signup");
});

app.get("/login", redirectHome, (req, res) => {
  res.render("pages/login");
})

app.get("/home", redirectLogin, async (req, res) => {
  const { userId } = req.session;
  if (userId) {
    try {
      const user = await db.getUser(userId);
      console.log(user);
      req.user = user;
      res.render("pages/home")
    } catch (e) {
      console.log(e);
      res.sendStatus(404);
    }
  }
});

// Post routes

app.post("/signup", redirectHome, async (req, res, next) => {
  try {
    const email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const salt = genSaltSync(10);
    password = hashSync(password, salt);

    const user = await db.insertUser(email, password).then((insertId) => {
      return db.getUser(insertId);
    });
    req.session.userId = user.id;
    console.log(user, password)
    return res.redirect("/login");
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

app.post("/login", redirectHome, async (req, res) => {
  try {
    const email = req.body.email;
    let password = req.body.password;
    user = await db.getUserByEmail(email);

    if (!user) {
      return res.send({
        message: "Invalid email or password",
      });
    }

    const isValidPassword = compareSync(password, user.password);
    if (isValidPassword) {
      user.password = undefined;
      req.session.userId = user.id;
      return res.redirect("/home");

    } else {

      res.send("Invalid email or password");
      return res.redirect("/login");
    }

  } catch (e) {

    console.log(e);
  }
    
});


app.post("/logout", redirectLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/home");
    }
    sessionStore.close();
    res.clearCookie(process.env.SESS_NAME);
    res.redirect("/login");
  });
});

// launches the server
app.listen(PORT, console.log(`Server is listening on ${PORT}`))







// Routes that will be organized into the routes folder later

// Get routes
// app.get("/", checkAuthenticated, (req, res) => {
//     res.render("pages/index.ejs", {name: req.user.name});
// });


// app.get("/login", (req, res) => {
//     res.render("pages/login.ejs");

// });





// app.get("/register", checkNotAuthenticated, (req, res) => {
//     res.render("pages/register.ejs");

// });


// Post routes
// app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: true
// }))

// app.post("/register", checkNotAuthenticated, async (req, res) => {
//     try {
//         const hashedPassword = await bcrypt.hash(req.body.password, 10);
//         users.push({
//             id: Date.now().toString(),
//             name: req.body.name,
//             email: req.body.email,
//             password: hashedPassword
//         });

//         res.redirect("/login");

//     } catch {
//         res.redirect("/register");
//         console.log("something went wrong");
//     }
//     console.log(users);
// })



// function checkAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     } else {
//         res.redirect("/login");
//     }
// }

// function checkNotAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         res.redirect("/");
//     } else {
//         return next();
//     }
// }




