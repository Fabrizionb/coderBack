/* eslint-disable */
import supertest from "supertest";
import { expect } from "chai";

describe("Session Test - Coderhouse", () => {
  const requester = supertest("http://localhost:8080");
  const cookie = [
    "AUTH=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDRhYzczNTkxMTcyYjkxYjM0ZGQ3YzkiLCJjYXJ0SWQiOiI2NDRhYzczNTkxMTcyYjkxYjM0ZGQ3YzciLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODg0MTY0MjksImV4cCI6MTY4ODUwMjgyOX0.s2LydrP1vArV4uNNg0cXEQeinnnpXT7KlztakyOi8K0",
  ];
  describe("Endpoint test", () => {
    it("El endpoint GET /current debe traer un objeto con status success y otras comprobaciones positivas.", async () => {
      const response = await requester
        .get("/api/user/current")
        .set("Cookie", [
          "AUTH=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDRhYzczNTkxMTcyYjkxYjM0ZGQ3YzkiLCJjYXJ0SWQiOiI2NDRhYzczNTkxMTcyYjkxYjM0ZGQ3YzciLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODg0MTY0MjksImV4cCI6MTY4ODUwMjgyOX0.s2LydrP1vArV4uNNg0cXEQeinnnpXT7KlztakyOi8K0",
        ]);

      //Comprobaciones;
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("user").that.is.an("object");

      const user = response.body.user;
      expect(user).to.have.property("name").that.is.a("string");
      expect(user).to.have.property("lastname").that.is.a("string");
      expect(user).to.have.property("cartId").that.is.an("object");
      expect(user.cartId).to.have.property("_id").that.is.a("string");
      expect(user.cartId).to.have.property("products").that.is.an("array");
      expect(user.cartId).to.have.property("__v").that.is.a("number");
      expect(user).to.have.property("role").that.is.a("string");
      expect(user).to.have.property("email").that.is.a("string");
    });
    it("El endpoint POST /logout debe traer un objeto con status success y otras comprobaciones positivas.", async () => {
      const response = await requester
        .post("/api/user/logout")
        .set("Cookie", cookie);
      console.log(response.body);
      // Comprobación del status de éxito
      expect(response.status).to.eql(200);
      // Comprobación de que las cookies se hayan eliminado
      const cookies = response.headers["set-cookie"];
      expect(cookies).contain(
        "connect.sid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
      );
      expect(cookies).contain(
        "AUTH=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
      );
    });
    it("El endpoint POST /restore-password debe traer un objeto con status success y otras comprobaciones positivas.", async () => {
      const email = "example@example.com"; // Correo electrónico a enviar
      const response = await requester
        .post("/api/user/restore-password")
        .set("Cookie", cookie)
        .send({ email });

      console.log(response.body);

      // Comprobación del status de éxito
      expect(response.status).to.eql(200);

      // Comprobación del status de éxito en la respuesta
      expect(response.body.status).to.eql("success");

      // Comprobación del mensaje de respuesta
      expect(response.body.payload.message).to.eql(
        "Reset link sent successfully"
      );
    });
  });
});
