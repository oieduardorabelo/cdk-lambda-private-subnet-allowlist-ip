import { Context, ScheduledEvent } from "aws-lambda";
import { request } from 'undici'

// This domain will resolve to "34.205.194.84/32"
// Any other domain or address will be blocked
// And the Lambda will timeout
let API_URL = "https://postman-echo.com/get";

let handler = async (event: ScheduledEvent, context: Context) => {
  console.log(JSON.stringify(event));
  let res = await request(API_URL);
  let json = await res.body.json();
  console.log(json);
};

export { handler };
