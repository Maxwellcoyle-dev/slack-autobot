import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({
  region: "us-east-2",
});

export const getSecret = async (secretId) => {
  console.log("secretId", secretId);
  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretId,
      })
    );

    const key = JSON.parse(response.SecretString);
    return key;
  } catch (err) {
    console.log(err);
    return err;
  }
};
