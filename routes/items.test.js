process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");


let chips = { name: "Chips" , price: 50};

beforeEach(function () {
  items.push(chips);
});

afterEach(function () {
  // make sure this *mutates*, not redefines, `items`
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ items: [chips] })
  })
})

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${chips.name}`);
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ item: chips })
  })
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get(`/items/ice`);
    expect(res.statusCode).toBe(404)
  })
})

describe("POST /items", () => {
  test("Creating a item", async () => {
    const res = await request(app).post("/items").send({ name: "Apple", price: 5 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ item: { name: "Apple", price: 5 } });
  })
  test("Responds with 400 if name is missing", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
  })
})

describe("/PATCH /items/:name", () => {
  test("Updating a item's name", async () => {
    const res = await request(app).patch(`/items/${chips.name}`).send({ name: "Monster", price: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: { name: "Monster", price: 5 } });
  })
  test("Responds with 404 for invalid name", async () => {
    const res = await request(app).patch(`/items/juice`).send({ name: "Monster" });
    expect(res.statusCode).toBe(404);
  })
})

describe("/DELETE /items/:name", () => {
  test("Deleting a item", async () => {
    const res = await request(app).delete(`/items/${chips.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Deleted' })
  })
  test("Responds with 404 for deleting invalid item", async () => {
    const res = await request(app).delete(`/items/banana`);
    expect(res.statusCode).toBe(404);
  })
})

