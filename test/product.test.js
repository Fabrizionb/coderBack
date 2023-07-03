/* eslint-disable */
import ProductService from "../src/Dao/mongo/product.service.mjs";
import supertest from "supertest";
import { expect } from "chai";

describe("Product Test - Coderhouse", () => {
  const requester = supertest("http://localhost:8080");
  describe("Endpoint test", () => {
    it("El endpoint GET /api/product/ debe traer un objeto con status success, payload con status success y otras comprobaciones positivas.", async () => {
      const response = await requester.get("/api/product/");
      expect(response.status).to.eql(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("status", "success");
      expect(response.body).to.have.property("payload");
      expect(response.body.payload).to.be.an("object");
      expect(response.body.payload).to.have.property("status", "success");
      expect(response.body.payload).to.have.property("payload");
      expect(response.body.payload.payload).to.be.an("array");
      expect(response.body.payload.payload[0]).to.be.an("object");
    });
    it("El endpoint GET /api/product/:id debe traer un objeto con status success y otras comprobaciones positivas.", async () => {
      const response = await requester.get(
        "/api/product/643041d86ed6ac26dc81ad98"
      );
      expect(response.status).to.eql(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("status", "success");
      expect(response.body).to.have.property("payload");
      expect(response.body.payload).to.be.an("object");
      expect(response.body.payload).to.have.property("product");
      const product = response.body.payload.product;
      expect(product).to.be.an("object");
      expect(product).to.have.property("_id").that.is.a("string");
      expect(product).to.have.property("title").that.is.a("string");
      expect(product).to.have.property("price").that.is.a("number");
    });
    it("El endpoint DELETE /api/product/:id debe eliminar un producto determinado y recibir su respuesta", async () => {
      const response = await requester
        .delete("/api/product/643041d86ed6ac26dc81ada0")
        .set("Cookie", [
          "AUTH=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDRhYzczNTkxMTcyYjkxYjM0ZGQ3YzkiLCJjYXJ0SWQiOiI2NDRhYzczNTkxMTcyYjkxYjM0ZGQ3YzciLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODg0MTY0MjksImV4cCI6MTY4ODUwMjgyOX0.s2LydrP1vArV4uNNg0cXEQeinnnpXT7KlztakyOi8K0",
        ]);
      expect(response.status).to.eql(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("status", "success");
      expect(response.body).to.have.property("payload");
      expect(response.body.payload).to.be.an("object");
      expect(response.body.payload).to.have.property(
        "message",
        "Product deleted successfully"
      );
    });
  });
});
 