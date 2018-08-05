const chai = require("chai");
const chaiHttp = require("chai-http");
const {
  app,
  runServer,
  closeServer
} = require("../server");
const expect = chai.expect;
chai.use(chaiHttp);

describe("Blogapi", function(){
    before(function() {
        return runServer();
      });
    
      after(function() {
        return closeServer();
      });

      it("Should list items on GET", function() {
        return chai
          .request(app).get("/blog-list").then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a("array");
            expect(res.body.length).to.be.at.least(1);
            const expectedKeys = ["id", 'title', 'content', 'author', 'publishDate'];
            res.body.forEach(function(item) {
              expect(item).to.be.a("object");
              expect(item).to.include.keys(expectedKeys)
            });
          });
      });


      it("should add an item on POST", function() {
        const newItem = {
            title: "Lorem ip some",
            content: "foo foo foo foo",
            author: "Emma Goldman",
            publishDate:"08-05-2018"
        };
        return chai
          .request(app)
          .post("/blog-list")
          .send(newItem)
          .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a("object");
            expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
            expect(res.body.id).to.not.equal(null);
            expect(res.body).to.deep.equal(
              Object.assign(newItem, {
                id: res.body.id
              })
            );
          });
      });


      it("should error if POST missing expected values", function() {
        const badRequestData = {};
        return chai
          .request(app)
          .post("/blog-list")
          .send(badRequestData)
          .then(function(res) {
            expect(res).to.have.status(400);
          });
      });

      it("should update items on PUT", function() {
        const updateData = {
            title: "News1",
            author: "Author123", 
            content: "Content4Content4Content4",
            publishDate: "publishDate"
        };
    
        return (
          chai
          .request(app)
          .get("/blog-list")
          .then(function(res) {
            console.log(res.body);
            updateData.id = res.body[0].id;
            console.log("LOGGGGGG" +"  " + updateData.id);
            return chai
              .request(app)
              .put(`/blog-list/${updateData.id}`)
              .send(updateData).then( function(res){
                    expect(res).to.have.status(204);
              });
          })
        );
      });

      it("should delete items on DELETE", function() {
        return (
          chai
          .request(app)
          .get("/blog-list")
          .then(function(res) {
            return chai.request(app).delete(`/blog-list/${res.body[0].id}`);
          })
          .then(function(res) {
            expect(res).to.have.status(204);
          })
        );
      });
    
});