/* eslint-disable */
import supertest from "supertest";
import { expect } from "chai";

describe("Cart Test - Coderhouse", () => {
  const requester = supertest("http://localhost:8080");
  describe("Endpoint test", () => {
    it("El endpoint GET /api/cart/ debe traer un objeto con status success, payload con status success y otras comprobaciones positivas.", async () => {
      const response = await requester
        .get("/api/cart/")
        .set("Cookie", [
          "AUTH=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDRhYzczNTkxMTcyYjkxYjM0ZGQ3YzkiLCJjYXJ0SWQiOiI2NDRhYzczNTkxMTcyYjkxYjM0ZGQ3YzciLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODg0MTY0MjksImV4cCI6MTY4ODUwMjgyOX0.s2LydrP1vArV4uNNg0cXEQeinnnpXT7KlztakyOi8K0",
        ]);
      expect(response.status).to.eql(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("status", "success");
      expect(response.body).to.have.property("payload");
      expect(response.body.payload).to.be.an("array");

      // Comprobación para el primer elemento del array
      if (response.body.payload.length > 0) {
        const firstItem = response.body.payload[0];
        expect(firstItem).to.be.an("object");
        expect(firstItem).to.have.property("_id");
        expect(firstItem).to.have.property("products").that.is.an("array");
        expect(firstItem).to.have.property("__v");
      }
    });
    it("El endpoint GET /api/cart/:id debe traer un objeto con status success y otras comprobaciones positivas.", async () => {
      const response = await requester
        .get("/api/cart/6447ee9083b157bd89f824ae")
        .set("Cookie", [
          "AUTH=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDRhYzczNTkxMTcyYjkxYjM0ZGQ3YzkiLCJjYXJ0SWQiOiI2NDRhYzczNTkxMTcyYjkxYjM0ZGQ3YzciLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODg0MTY0MjksImV4cCI6MTY4ODUwMjgyOX0.s2LydrP1vArV4uNNg0cXEQeinnnpXT7KlztakyOi8K0",
        ]);

      // Comprobaciones
      expect(response.status).to.eql(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("_id");
      expect(response.body).to.have.property("products").that.is.an("array");
      expect(response.body).to.have.property("__v");

      // Comprobación adicional para el primer elemento del array de productos
      if (response.body.products.length > 0) {
        const firstProduct = response.body.products[0];
        expect(firstProduct).to.be.an("object");
        expect(firstProduct).to.have.property("product").that.is.an("object");
        expect(firstProduct).to.have.property("quantity");
        expect(firstProduct.product).to.have.property("_id");
      }
    });
    it("El endpoint GET /api/cart/ debe traer un objeto con status success, payload con status success y otras comprobaciones positivas.", async () => {
      const response = await requester
        .get("/api/cart/tickets/all")
        .set("Cookie", [
          "AUTH=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDRhYzczNTkxMTcyYjkxYjM0ZGQ3YzkiLCJjYXJ0SWQiOiI2NDRhYzczNTkxMTcyYjkxYjM0ZGQ3YzciLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODg0MTY0MjksImV4cCI6MTY4ODUwMjgyOX0.s2LydrP1vArV4uNNg0cXEQeinnnpXT7KlztakyOi8K0",
        ]);

      // Comprobaciones
      expect(response.status).to.eql(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("status", "success");
      expect(response.body).to.have.property("payload").that.is.an("object");
      expect(response.body.payload)
        .to.have.property("tickets")
        .that.is.an("array");

      // Comprobación adicional para el primer ticket
      if (response.body.payload.tickets.length > 0) {
        const firstTicket = response.body.payload.tickets[0];
        expect(firstTicket).to.be.an("object");
      }
    });
  });
});
