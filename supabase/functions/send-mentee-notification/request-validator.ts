
import { NotificationRequest } from './types.ts';

export const validateRequest = (parsedBody: NotificationRequest): void => {
  const { menteeEmail, actionType } = parsedBody;
  
  if (!menteeEmail || !actionType) {
    const error = "Email and action type are required";
    console.error("Validation error:", error);
    throw new Error(error);
  }
};

export const parseRequestBody = async (req: Request): Promise<NotificationRequest> => {
  console.log("Request method:", req.method);
  console.log("Request headers:", Object.fromEntries(req.headers.entries()));
  
  const requestBody = await req.text();
  console.log("Raw request body:", requestBody);
  
  try {
    return JSON.parse(requestBody);
  } catch (parseError) {
    console.error("JSON parse error:", parseError);
    throw new Error("Invalid JSON in request body");
  }
};
