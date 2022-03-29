import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";

AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda();

export const getNotes = (req, res) => {

  const params = {
    TableName: process.env.TABLE_NAME
  };

  docClient.scan(params, function(err, data) {
    if(err) {
      console.log("===Error fetching from DynamoDB=== ", err);
      res.send({
        success: false,  
        message: err
      });
    } else {
      console.log("===Data fetched from DynamoDB=== ", data);
      res.send({
        success: true,
        message: data.Items
      });
    }
  });
}

export const addNote = async (req, res) => {
  let { title, text: content } = req.body;

  lambda.invoke({ 
    FunctionName: "eliminateRepeatedPunctuationMarks",
    Payload: JSON.stringify({ text: content })
  }, function(err, data) {
    if(err) {
      console.log(err);
    }

    content = data.Payload;

    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        title,
        content,
        id: uuidv4()
      }
    };

    docClient.put(params, function(err, data) {
      if(err) {
        console.log("===Error putting in DynamoDB=== ", err);
        res.send({
          success: false,
          message: err
        });
      } else {
        let items = [];

        docClient.scan({
          TableName: process.env.TABLE_NAME
        }, function(err, data) {
          if(err) {
            console.log("(Interior)===Error fetching from DynamoDB=== ", err);

            items = err;

            console.log("===Error on getting all notes in POST=== ", err);

            res.send({
              success: true,
              message: "Added movie",
              items
            });
          } else {
            console.log("(Interior)===Data fetched from DynamoDB=== ", data);

            items = data;

            console.log("===Data put in DynamoDB=== ", data);

            res.send({
              success: true,
              message: "Added movie",
              items: items.Items
            });
          }
        });
      }
    })
  });
}