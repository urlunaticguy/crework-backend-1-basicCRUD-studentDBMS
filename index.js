const http = require("http");
const port = 3000;

const fileSystem = require("fs");

let newStudentObjectChecker = (obj) => {
  let errorMsg = "";
  if (obj.id == undefined || obj.id == "") {
    errorMsg += "⚠️ No ID given in POST request\n";
  }
  if (obj.name == undefined || obj.name == "") {
    errorMsg += "⚠️ No Name given in POST request\n";
  }
  if (obj.age == undefined || obj.age == "") {
    errorMsg += "⚠️ No Age given in POST request\n";
  }
  if (obj.gender == undefined || obj.gender == "") {
    errorMsg += "⚠️ No Gender given in POST request\n";
  }
  if (obj.class == undefined || obj.class == "") {
    errorMsg += "⚠️ No Class given in POST request\n";
  }
  if (obj.roll_no == undefined || obj.roll_no == "") {
    errorMsg += "⚠️ No Roll No given in POST request\n";
  }
  return errorMsg;
};

const server = http.createServer((request, response) => {
  if (request.url == "/") {
    if (request.method == "GET") {
      response.writeHead(200, { "Content-Type": "text/json" });
      response.write("Here is a list of endpoints - \n");
      response.write(
        "\tGET details about all students\n\t\tFull Link - http://localhost:3000/studentsAll \tPostman Click - /studentsAll\n"
      );
      response.write(
        "\tGET details about one student by ID search\n\t\tFull Link - http://localhost:3000/studentByID/:id \tPostman Click - /studentByID/:id\n"
      );
      response.write(
        "\n\tPOST a new Student entry\n\t\tFull Link - http://localhost:3000/post/newStudent \tPostman Click - /post/newStudent\n\t\tJSON Body : id, name, age, gender, class, roll_no\n"
      );
      response.write(
        "\n\tPATCH an existing Student entry\n\t\tFull Link - http://localhost:3000/updateStudent \tPostman Click - /updateStudent\n\t\tJSON Body : id (mandatory), name, age, gender, class, roll_no\n"
      );
      response.write(
        "\n\tDELETE an existing Student entry\n\t\tFull Link - http://localhost:3000/delete \tPostman Click - /delete\n\t\tJSON Body : id (mandatory)\n"
      );
      response.end();
    } else {
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.end("Use only GET request here.");
    }
  } else if (request.url == "/studentsAll") {
    if (request.method == "GET") {
      fileSystem.readFile("student.json", (error, rawData) => {
        if (error) throw error;
        else {
          let parsedData = JSON.parse(rawData);
          response.writeHead(200, { "Content-Type": "text/json" });
          response.end(JSON.stringify(parsedData));
        }
      });
    } else {
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.end("Use only GET request here.");
    }
  } else if (request.url == "/post/newStudent") {
    if (request.method == "POST") {
      let body = "";
      let x;
      let fetchedData;
      request.on("data", (chunk) => {
        body += chunk.toString();
      });
      request.on("end", () => {
        x = JSON.parse(body);
        let a = newStudentObjectChecker(x);
        if (a == "") {
          fileSystem.readFile("student.json", (error, rawData) => {
            if (error) throw error;
            else {
              fetchedData = JSON.parse(rawData);
              fetchedData.main.push(x);
              arrayLength = fetchedData.main.length;
              let xdata = JSON.stringify(fetchedData);
              fileSystem.writeFile("student.json", xdata, (err) => {
                if (err) throw err;
                console.log("Data written to file");
              });
              response.writeHead(200, { "Content-Type": "text/plain" });
              response.end(`✅ New Student Added.`);
            }
          });
        } else {
          response.writeHead(200, { "Content-Type": "text/plain" });
          response.end(a);
        }
      });
    } else {
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.end("Use only POST request here.");
    }
  } else if (request.url == "/updateStudent") {
    if (request.method == "PATCH") {
      let body = "";
      let patchJSON;
      request.on("data", (chunk) => {
        body += chunk.toString();
      });
      request.on("end", () => {
        patchJSON = JSON.parse(body);
        let readDataArray;

        fileSystem.readFile("student.json", (error, rawData) => {
          if (error) throw error;
          else {
            readDataArray = JSON.parse(rawData);
            let responseArr = [];
            for (let i = 0; i < readDataArray.main.length; i++) {
              let eachObject = readDataArray.main[i];
              if (eachObject.id == patchJSON.id) {
                if (patchJSON.name != undefined) {
                  responseArr.push("NAME");
                  responseArr.push(eachObject.name);
                  responseArr.push(patchJSON.name);
                  readDataArray.main[i].name = patchJSON.name;
                }
                if (patchJSON.age != undefined) {
                  responseArr.push("AGE");
                  responseArr.push(eachObject.age);
                  responseArr.push(patchJSON.age);
                  readDataArray.main[i].age = patchJSON.age;
                }
                if (patchJSON.gender != undefined) {
                  responseArr.push("GENDER");
                  responseArr.push(eachObject.gender);
                  responseArr.push(patchJSON.gender);
                  readDataArray.main[i].gender = patchJSON.gender;
                }
                if (patchJSON.class != undefined) {
                  responseArr.push("CLASS");
                  responseArr.push(eachObject.class);
                  responseArr.push(patchJSON.class);
                  readDataArray.main[i].class = patchJSON.class;
                }
                if (patchJSON.roll_no != undefined) {
                  responseArr.push("ROLl NO");
                  responseArr.push(eachObject.roll_no);
                  responseArr.push(patchJSON.roll_no);
                  readDataArray.main[i].roll_no = patchJSON.roll_no;
                }
                break;
              }
            }
            fileSystem.writeFile(
              "student.json",
              JSON.stringify(readDataArray),
              (err) => {
                if (err) throw err;
                console.log("Data written to file");
              }
            );
            response.writeHead(200, { "Content-Type": "text/plain" });
            response.write("✅ UPDATE COMPLETED SUCCESSFULLY.\n");
            response.write(`\tStudent ID : ${patchJSON.id}\n`);
            for (let i = 0; i < responseArr.length; i += 3) {
              response.write(
                `\t${responseArr[i]} updated from : ${responseArr[i + 1]} TO ${
                  responseArr[i + 2]
                }\n`
              );
            }
            response.end();
          }
        });
      });
    } else {
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.end("Cannot Process Request.\nUse only PATCH request here.");
    }
  } else if (request.url == "/delete") {
    if (request.method == "DELETE") {
      let body = "";
      request.on("data", (chunk) => {
        body += chunk.toString();
      });
      request.on("end", () => {
        let deleteJSON = JSON.parse(body);
        let readDataArray;

        fileSystem.readFile("student.json", (error, rawData) => {
          if (error) throw error;
          else {
            readDataArray = JSON.parse(rawData);
            let flag = false;
            for (let i = 0; i < readDataArray.main.length; i++) {
              let eachObject = readDataArray.main[i];
              if (eachObject.id == deleteJSON.id) {
                readDataArray.main.splice(i, 1);
                flag = true;
                break;
              }
            }
            fileSystem.writeFile(
              "student.json",
              JSON.stringify(readDataArray),
              (err) => {
                if (err) throw err;
                console.log("Data written to file");
              }
            );
            response.writeHead(200, { "Content-Type": "text/plain" });
            if (flag) {
              response.write("✅ DELETE COMPLETED SUCCESSFULLY.\n");
              response.write(`\tDELETED record of Student ID ${deleteJSON.id}`);
            } else {
              response.write("⚠️ DELETE FAILED.\n");
              response.write("⚠️ Invalid Student ID.");
            }
            response.end();
          }
        });
      });
    } else {
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.end("Cannot Process Request.\nUse only DELETE request here.");
    }
  } else if (request.url == "/studentByID") {
    if (request.method == "GET") {
      let body = "";
      request.on("data", (chunk) => {
        body += chunk.toString();
      });
      request.on("end", () => {
        let receivedJSON = JSON.parse(body);
        let readDataArray;
        fileSystem.readFile("student.json", (error, rawData) => {
          if (error) throw error;
          else {
            let sendJSON;
            let flag = false;
            readDataArray = JSON.parse(rawData);
            for (let i = 0; i < readDataArray.main.length; i++) {
              let eachObject = readDataArray.main[i];
              if (eachObject.id == receivedJSON.id) {
                sendJSON = eachObject;
                flag = true;
                break;
              }
            }
            if (flag) {
              response.writeHead(200, { "Content-Type": "text/json" });
              response.end(JSON.stringify(sendJSON));
            } else {
              response.writeHead(200, { "Content-Type": "text/plain" });
              response.end("Cannot Process Request. Invalid ID.");
            }
          }
        });
      });
    } else {
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.end("Cannot Process Request.\nUse only GET request here.");
    }
  }
});

server.listen(port, () => {
  console.log("Server is listening on port", port);
});
