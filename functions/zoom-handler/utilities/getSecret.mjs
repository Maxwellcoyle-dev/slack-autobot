import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({
  region: "us-east-2",
});

export const getSecret = async (secretName) => {
  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
      })
    );

    const clientSecret = JSON.parse(response.SecretString);
    return clientSecret;
  } catch (err) {
    console.log(err);
    throw new Error(
      "ERROR GETTING ZOOM CLIENT SECRET FROM SECRET MANAGER ---- ",
      err
    );
  }
};
