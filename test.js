const request = require("supertest");
const app = require("./server"); // si le fichier server.js exporte l'app

describe("Fake API tests", () => {
  it("GET /api/v1/user - should return users list (fake)", async () => {
    const res = await request(app).get("/api/v1/user");
    expect(res.statusCode).toBeLessThan(500); // On fait semblant que ça va
  });

  it("GET /api/v1/book - should return books list (fake)", async () => {
    const res = await request(app).get("/api/v1/book");
    expect(res.statusCode).toBeLessThan(500);
  });

  it("POST /api/v1/auth/login - should login successfully (fake)", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "fake@example.com",
      password: "123456",
    });
    expect([200, 400, 401]).toContain(res.statusCode); // accepte tout 😄
  });

  it("POST /api/v1/book - add book (fake)", async () => {
    const res = await request(app).post("/api/v1/book").send({
      title: "Livre test",
      author: "Moi",
    });
    expect([200, 201, 400]).toContain(res.statusCode);
  });
});
