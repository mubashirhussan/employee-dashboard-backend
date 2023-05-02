const express = require("express");
const app = express();
const SwaggerUI = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const cors = require("cors");
require("./db/config");
const User = require("./db/users");
const Product = require("./db/products");
const router = express.Router();
app.use(express.json());
app.use(cors());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hello Shafiq Siddiq",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3002/",
      },
    ],
  },
  apis: ["./index.js"],
};
const openapiSpecification = swaggerJsdoc(options);
app.use("/api-docs", SwaggerUI.serve, SwaggerUI.setup(openapiSpecification));

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Create a JSONPlaceholder user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The user's name.
 *                 example: string
 *               lastName:
 *                 type: string
 *                 description: The user's name.
 *                 example: string
 *               fullName:
 *                 type: string
 *                 description: The user's name.
 *                 example: string
 *               email:
 *                 type: string
 *                 description: The user's name.
 *                 example: string
 *               phoneNumber:
 *                 type: integer
 *                 description: The user's name.
 *                 example: integer
 *     responses:
 *       201:
 *        description: Returns a mysterious string.
 */

app.post("/register", async function (req, res) {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  res.send(result);
});
router.post("/login", async function (req, res) {
  console.log(req.body);
  if (req.body.email && req.body.password) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      res.send(user);
    } else {
      res.send("No User Found");
    }
  } else {
    res.send("No User Found");
  }
});
router.post("/add-product", async function (req, res) {
  console.log(req.body);
  let product = new Product(req.body);
  let result = await product.save();
  res.send(result);
});
router.get("/productList", async function (req, res) {
  let products = await Product.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ result: "No Product found" });
  }
});
router.delete("/product/:id", async function (req, res) {
  let product = await Product.deleteOne({ _id: req.params.id });
  res.send(product);
});
router.get("/product/:id", async function (req, res) {
  let product = await Product.findOne({ _id: req.params.id });
  if (product) {
    res.send(product);
  } else {
    res.send({ result: "No Product Found" });
  }
});
router.put("/product/:id", async function (req, res) {
  let product = await Product.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  res.send(product);
});
// app.get("/", (req, res) => {
//   res.send("app working successfully");
// });
app.listen(3002);
