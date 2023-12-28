import { postBody, putBody } from "../fixtures/testData.json";


describe("template spec", () => {
  beforeEach(function () {
    cy.fixture('testData').then((data) => {
      this.firstName = data.postBody.firstName;
      this.lastName = data.postBody.lastName;
      this.email = data.postBody.email;
      this.dob = data.postBody.dob;

      this.firstNameU = data.putBody.firstName;
      this.lastNameU = data.putBody.lastName;
      this.emailU = data.putBody.email;
      this.dobU = data.putBody.dob;
    });
  });

  let userId;
  let durTime = 600
 

  it("Create new student using Post and validate with DB", function () {
    cy.request({
      method: "POST",
      url: Cypress.env("baseUrl"),
      body: postBody,
    }).then((response) => {
      userId = response.body.id;
    
      cy.validateResponse(response, postBody);
      expect(response.status).to.equal(200);
      expect(response.duration).to.lessThan(durTime);
    });

    cy.task(
      'runQuery', 'SELECT * FROM student WHERE email = \'Igor.strelka@example.net\'').then((rows) => {
      expect(rows).to.have.length(1);
      const igor = rows[0];

      const expectedValues = [ this.dob, this.email, this.firstName , this.lastName];
      expectedValues.forEach((value, index) => {
        expect(igor[index + 1]).to.equal(value);
      });
    });
  });

  it('Make a GET call for the specific user created', function () {
    cy.request({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/${userId}`,
    }).then((response) => {
      cy.validateResponse(response, postBody);
      expect(response.status).to.equal(200);
      expect(response.duration).to.lessThan(durTime);
    });

    cy.task(
      'runQuery', 'SELECT * FROM student WHERE email = \'Igor.strelka@example.net\'').then((rows) => {
      expect(rows).to.have.length(1);
      const igor = rows[0];

      const expectedValues = [ this.dob, this.email, this.firstName , this.lastName];
      expectedValues.forEach((value, index) => {
        expect(igor[index + 1]).to.equal(value);
      });
    });
  });

  it("Update created student using PUT and validate with DB", function () {
    cy.request({
      method: "PUT",
      url: `${Cypress.env("baseUrl")}/${userId}`,
      body: putBody,
    }).then((response) => {
      
  
      cy.validateResponse(response, putBody);
      expect(response.status).to.equal(200);
      expect(response.duration).to.lessThan(durTime);
  
    });

    cy.task(
      'runQuery', 'SELECT * FROM student WHERE email = \'Nettieasdaupdated7@example.net\'').then((rows) => {
      expect(rows).to.have.length(1);
      const igor = rows[0];

      const expectedValues = [ this.dobU, this.emailU, this.firstNameU , this.lastNameU];
      expectedValues.forEach((value, index) => {
        expect(igor[index + 1]).to.equal(value);
      });
    });
  });
  it('Make a GET call for the updated user', function () {
    cy.request({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/${userId}`,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.duration).to.lessThan(durTime);
      cy.validateResponse(response, putBody);
    });

    cy.task(
      'runQuery', 'SELECT * FROM student WHERE email = \'Nettieasdaupdated7@example.net\'').then((rows) => {
      expect(rows).to.have.length(1);
      const igor = rows[0];

      const expectedValues = [ this.dobU, this.emailU, this.firstNameU , this.lastNameU];
      expectedValues.forEach((value, index) => {
        expect(igor[index + 1]).to.equal(value);
      });
    });
  });
  it("delete the user that you created.", () => {
    cy.request({
      method: "DELETE",
      url: `${Cypress.env("baseUrl")}/${userId}`,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.duration).to.lessThan(durTime)
    });
    cy.task(
      'runQuery', 'SELECT * FROM student WHERE email = \'Nettieasdaupdated7@example.net\'').then((rows) => {
      expect(rows).to.have.length(0);

    });
  });

});
