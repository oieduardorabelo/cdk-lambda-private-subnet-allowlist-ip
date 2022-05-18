import { Context, ScheduledEvent } from "aws-lambda";
import { request } from 'undici'

let API_URL = "https://postman-echo.com/get";

let handler = async (event: ScheduledEvent, context: Context) => {
  console.log(JSON.stringify(event));
  let res = await request(API_URL);
  let json = await res.body.json();
  console.log(json);
};

export { handler };
