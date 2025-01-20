"use server";

import { PubSub, Message, StatusError } from "@google-cloud/pubsub";

// const topicName = "projects/my-emm-next-dev/topics/dev";
const subscriptionName = "projects/my-emm-next-dev/subscriptions/dev-sub";

const pubSubClient = new PubSub({
  projectId: "my-emm-next-dev",
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export const getLog = async () => {
  try {
    // Instantiates a client
    const timeout = 5;
    const pubsub = pubSubClient;
    // Creates a new topic
    const subscription = pubsub.subscription(subscriptionName);
    // console.log("subscription test", subscription);

    // サブスクリプションが存在するか確認
    const [exists] = await subscription.exists();
    if (!exists) {
      console.error("Subscription does not exist");
      return {
        messages: [],
        status: "error",
        error: "Subscription not found",
      };
    }
    // Create an event handler to handle messages
    let messageCount = 0;
    const messageHandler = (message: Message) => {
      console.log(`Received message ${message.id}:`);
      // console.log(`\tData: ${message.data}`);
      console.log(`\tAttributes: ${message.attributes}`);
      console.log(`\tAttributes: ${message.attributes.notificationType}`);
      messageCount += 1;

      // "Ack" (acknowledge receipt of) the message
      message.ack();
    };

    // Listen for new messages until timeout is hit
    subscription.on("message", messageHandler);

    // Create an event handler to handle errors
    const errorHandler = (error: StatusError) => {
      // Do something with the error
      console.error(`ERROR: ${error}`);
      throw error;
    };

    // Listen for new messages/errors until timeout is hit
    subscription.on("message", messageHandler);
    subscription.on("error", errorHandler);

    // Wait a while for the subscription to run. (Part of the sample only.)
    setTimeout(() => {
      subscription.removeListener("message", messageHandler);
      console.log(`${messageCount} message(s) received.`);
    }, timeout * 1000);
  } catch (error) {
    console.error("Failed to pull messages:", error);
    return;
  }
};
