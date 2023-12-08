export const lambdaHandler = async (event) => {
  console.log("SLACK HANDLER TRIGGERED BY EVENT --- ", event);
  const eventPayload = JSON.parse(event.body);
  console.log("EVENT PAYLOAD --- ", eventPayload);
  const eventType = eventPayload.type;
  console.log("EVENT TYPE --- ", eventType);
};
