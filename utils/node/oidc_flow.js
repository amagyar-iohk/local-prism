const Api = require("./api");

// setup script for OIDC
// run once, if any failure, reset environment and run again

(async () => {
  const authServerUrl = `http://host.docker.internal:9981`;
  const agentUrl = `http://localhost:8090`;
  const oidcUrl = `${agentUrl}/oid4vci/issuers`;
  const didsUrl = `${agentUrl}/did-registrar/dids`;
  const schemasUrl = `${agentUrl}/schema-registry/schemas`;
  const realm = "oid4vci-holder";
  const configurationId = "StudentProfile";
  const clientId = "alice-wallet";

  const adminToken = await Api.formEncoded(
    `${authServerUrl}/realms/master/protocol/openid-connect/token`,
    {
      grant_type: "password",
      client_id: "admin-cli",
      username: "admin",
      password: "admin"
    }
  )
  .then(x => x.json())
  .then(x => x.access_token);

  await Api.post(
    `${authServerUrl}/admin/realms`,
    { realm: realm, enabled: true },
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );

  const realmAuthUrl = `${authServerUrl}/admin/realms/${realm}`

  await Api.post(
    `${realmAuthUrl}/clients`,
    {
      "id": "cloud-agent",
      "secret": "cloud-agent-secret",
      "authorizationServicesEnabled": true,
      "serviceAccountsEnabled": true,
    },
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );

  await Api.post(
    `${realmAuthUrl}/clients`,
    { 
      "id": clientId,
      "publicClient": true,
      "consentRequired": true,
      "redirectUris": [ "http://localhost:7777/*" ]
    },
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );

  await Api.post(
    `${realmAuthUrl}/users`,
    { 
      "username": "Alice",
      "firstName": "Alice",
      "lastName": "Wonderland",
      "enabled": true,
      "email": "alice@atalaprism.io",
      "credentials": [{"value": "1234", "temporary": false}]
    },
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );


  const clientScopeResponse = await Api.post(
    `${realmAuthUrl}/client-scopes`,
    {
      "name": "StudentProfile",
      "description": "The University Degree Credential",
      "protocol": "openid-connect",
      "attributes": {
        "consent.screen.text": "University Degree",
        "display.on.consent.screen": "true",
        "include.in.token.scope": "true",
        "gui.order": ""
      }
    },
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );

  const clientScopeId = clientScopeResponse.headers.get("Location").split("/").at(-1);
  console.log({clientScopeId})

  await Api.put(
    `${realmAuthUrl}/clients/${clientId}/optional-client-scopes/${clientScopeId}`,
    {},
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );

  const createDid = await Api.json(didsUrl, {
    "documentTemplate": {
      "publicKeys": [
        {
          "id": "auth-1",
          "purpose": "authentication"
        },
        {
          "id": "issue-1",
              "purpose": "assertionMethod"	
        }
      ],
      "services": []
    }
  });
  
  const issuerDid = await Api.json(
    `${didsUrl}/${createDid.longFormDid}/publications`,
    {
      "documentTemplate": {
        "publicKeys": [
          {
            "id": "auth-1",
            "purpose": "authentication"
          },
          {
            "id": "issue-1",
            "purpose": "assertionMethod"	
          }
        ],
        "services": []
      }
    }
  )
  .then(x => x.scheduledOperation.didRef);

  const schemaId = await Api.json(schemasUrl, {
    "name": "oidc-test",
    "version": "1.0.0",
    "type": "https://w3c-ccg.github.io/vc-json-schemas/schema/2.0/schema.json",
    "schema": {
        "$id": "https://example.com/student-schema-1.0",
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "description": "Student schema",
        "type": "object",
        "required": [
            "name",
            "age"
        ],
        "properties": {
            "name": {
                "type": "string"
            },
            "age": {
                "type": "integer"
            }
        }
    },
    "author": `${issuerDid}`,
    "description": "Simple student credentials schema",
    "tags": [
        "school",
        "students"
    ]
  })
  .then(x => x.guid);

  const oidcId = await Api.json(oidcUrl, {
    "authorizationServer": {
      "url": `${authServerUrl}/realms/${realm}`,
      "clientId": "cloud-agent",
      "clientSecret": "cloud-agent-secret"
    }
  })
  .then(x => x.id);

  const issuerUrl = `${oidcUrl}/${oidcId}`;

  await Api.post(`${issuerUrl}/credential-configurations`, {
    "configurationId": configurationId,
    "format": "jwt_vc_json",
    "schemaId": `${agentUrl}/schema-registry/schemas/${schemaId}/schema`
  });

  // make an offer
  await Api.post(`${issuerUrl}/credential-offers`, {
    credentialConfigurationId: configurationId,
    issuingDID: issuerDid,
    claims: { name: "Alice", age: 42 }
  });

  // needed to run the flow in a separate script
  console.log({ 
    issuerUrl, 
    issuerDid, 
    clientId,
    credentialConfigurationId: configurationId,
  })
})();
