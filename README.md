# S.I.G.H.T.E.D. (Secure Information Guarding Healthcare Through Encrypted Data)

Secure Medical Records Sharing : A healthcare application that enables the secure and private sharing of medical records between patients and healthcare providers, using Calimero for privacy-preserving access.

![](https://github.com/SIGHTED-HEALTHCARE/NEAR-SIGHTED/blob/main/images/Screen%20Shot%202024-11-01%20at%2012.03.59%20AM.png?raw=true)

### “When life’s most private moments need to stay private, SIGHTED ensures no one’s looking in.”

![](https://github.com/SIGHTED-HEALTHCARE/NEAR-SIGHTED/blob/main/images/Screen%20Shot%202024-11-01%20at%2012.10.17%20AM.png?raw=true)

![](https://github.com/SIGHTED-HEALTHCARE/NEAR-SIGHTED/blob/main/images/Screen%20Shot%202024-10-31%20at%2011.44.04%20PM.png?raw=true)

![](https://github.com/SIGHTED-HEALTHCARE/NEAR-SIGHTED/blob/main/images/Screen%20Shot%202024-10-31%20at%2011.44.11%20PM.png?raw=true)

![](https://github.com/SIGHTED-HEALTHCARE/NEAR-SIGHTED/blob/main/images/Screen%20Shot%202024-10-31%20at%2011.44.15%20PM.png?raw=true)

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

For the **Privacy-Preserving Access** aspect of the SIGHTED system, each role can have specific permissions for accessing and interacting with medical data, using access-control policies and privacy-preserving mechanisms. 

### 1) **Primary Care Provider (PCP)**
The PCP is typically the main custodian of a patient’s medical records. With privacy-preserving access, the PCP can access the patient’s core medical history but with controls over sensitive details.

#### Privacy-Preserving Access Configuration:
- **Role-Based Permissions**: The PCP can view and update certain sections of a patient’s record but may have limited access to highly sensitive data.
- **Encrypted Data Access**: Only the PCP has decryption keys for their assigned records, ensuring patient data remains secure when accessed.

```typescript
// Sample data access example for PCP
const grantPCPAccess = async (pcpId: string, patientId: string) => {
  await calimero.shard.assignRole(pcpId, {
    role: 'PRIMARY_CARE_PROVIDER',
    permissions: ['READ_PATIENT_RECORD', 'WRITE_MEDICAL_NOTES'],
  });
};
```

### 2) **Radiologist**
The radiologist has access to imaging data and specific test results but is restricted from viewing broader patient records unless required for treatment.

#### Privacy-Preserving Access Configuration:
- **Selective Access**: The radiologist can only access the imaging records and associated notes, minimizing unnecessary exposure to other patient information.
- **Temporal Access Control**: Access is limited to a specific period or task to prevent persistent access to patient data.

```typescript
// Grant access to imaging records for radiologist
const grantRadiologistAccess = async (radiologistId: string, imagingRecordId: string) => {
  await calimero.shard.assignRole(radiologistId, {
    role: 'RADIOLOGIST',
    permissions: ['READ_IMAGING_RECORD'],
    resourceId: imagingRecordId,
  });
};
```

### 3) **Insurance Company**
The insurance company can access claim-related data to verify and process claims but cannot view detailed patient records.

#### Privacy-Preserving Access Configuration:
- **Policy-Based Access Control**: Permissions are restricted to claim verification and billing details, not the patient’s complete medical history.
- **Zero-Knowledge Proofs**: Data required for claims can be validated without disclosing underlying sensitive details, using cryptographic proofs.

```typescript
// Grant limited access for insurance claim verification
const grantInsuranceAccess = async (insuranceId: string, claimId: string) => {
  await calimero.shard.assignRole(insuranceId, {
    role: 'INSURANCE_COMPANY',
    permissions: ['VIEW_CLAIM'],
    resourceId: claimId,
  });
};
```

### 4) **Patient**
The patient has full access to their medical records and can approve or revoke access to their data as needed, offering them control over their privacy.

#### Privacy-Preserving Access Configuration:
- **Self-Sovereign Control**: Patients have the ability to provide selective access to their data and can revoke permissions at any time.
- **End-to-End Encryption**: Patients’ records are encrypted, and they can use their private key to share or hide parts of their data selectively.

```typescript
// Patient granting access to a specific provider
const patientGrantAccess = async (patientId: string, providerId: string) => {
  await calimero.shard.grantAccess(patientId, providerId, {
    permissions: ['READ_MEDICAL_RECORD'],
  });
};
```

Using **Calimero's privacy-preserving capabilities** with **NEAR's secure smart contracts**, each role can have fine-grained, controlled access to patient records, ensuring data privacy while enabling necessary medical workflows. This setup allows SIGHTED to securely manage data sharing and maintain patient autonomy over personal information.




------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


### 1) **Permissioned Private Shard Owned by a Single Entity**
This mode allows for the most controlled environment where a single entity, such as a hospital or healthcare network, owns the shard. Access control is strict, and permissions are finely managed for each role.

- **Primary Care Provider (PCP)** and **Radiologist**: As internal users in this single-entity shard, they receive access to patient data per the organization’s policies. Data sharing is limited to users within the entity, preventing external access.
- **Insurance Company**: The insurance company can access patient claims only by secure APIs with strict, contract-based access (e.g., Zero-Knowledge Proofs) that reveal minimal information for claim verification.
- **Patient**: The patient can view their records and selectively grant or revoke access to specific doctors or departments within the hospital. They retain control over their data with access logs provided by the entity.

**Single-Entity Shard Permissions**:

```typescript
// Single-entity controlled access for internal users
const setupSingleEntityShard = async () => {
  await calimero.shard.create({
    owner: "HospitalSystem",
    mode: "PermissionedPrivateSingleEntity",
  });

  // Grant PCP access within the hospital
  await calimero.shard.assignRole("pcpId", {
    permissions: ['READ_PATIENT_RECORD', 'WRITE_MEDICAL_NOTES'],
    resourceId: "patientRecord",
  });
};
```

### 2) **Permissioned Private Shard Owned by a Consortium**
Here, a consortium of healthcare providers and insurance companies jointly owns the shard. This mode allows for cross-institutional data access and sharing under strict policies, where each entity can manage role-based access across multiple parties while maintaining patient data privacy.

- **Primary Care Provider (PCP)** and **Radiologist**: PCPs and radiologists from any entity within the consortium can access patient records per their role permissions. For example, a PCP from one hospital can access imaging data from a radiologist at another consortium hospital, providing coordinated care across facilities.
- **Insurance Company**: Insurance companies in the consortium have permission to access claims data only, without access to broader medical histories. Zero-Knowledge Proofs are used for privacy-preserving verification across entities.
- **Patient**: Patients can authorize specific providers across the consortium to view or update their records. They benefit from seamless care coordination without losing control over who accesses their information.

**Consortium Shard Permissions**:

```typescript
// Multi-entity controlled access for a consortium
const setupConsortiumShard = async () => {
  await calimero.shard.create({
    owner: ["HospitalSystem1", "HospitalSystem2", "InsuranceCompany1"],
    mode: "PermissionedPrivateConsortium",
  });

  // Grant cross-entity access with selective permissions
  await calimero.shard.assignRole("radiologistId", {
    permissions: ['READ_IMAGING_RECORD'],
    resourceId: "imagingRecord",
  });
};
```

### 3) **Public Shard Owned by a Community**
In this mode, SIGHTED operates in a more open environment where patients and providers form a decentralized community, using smart contracts for permissions. Here, transparency is high, yet patient data remains private through encryption and selective access.

- **Primary Care Provider (PCP)** and **Radiologist**: Providers can access patient data only with explicit patient approval. Any access request is transparent, allowing patients to manage permissions independently in a community-driven environment.
- **Insurance Company**: Insurance companies, as members of the public shard, can process claims, but data access is limited to required information only. Claims verification relies heavily on Zero-Knowledge Proofs for community compliance and transparency.
- **Patient**: Patients are the true owners of their data, with full autonomy to grant or deny access to any provider or insurance company. This setup maximizes control, transparency, and privacy, as data cannot be accessed without explicit consent.

**Community-Owned Public Shard Permissions**:

```typescript
// Decentralized control and transparency in a community shard
const setupCommunityShard = async () => {
  await calimero.shard.create({
    owner: "Community",
    mode: "PublicCommunity",
  });

  // Patient controls access with individual permissions
  const patientGrantAccess = async (patientId: string, providerId: string) => {
    await calimero.shard.grantAccess(patientId, providerId, {
      permissions: ['READ_MEDICAL_RECORD'],
      expiration: '2024-12-31T23:59:59Z', // Optional time-bound access
    });
  };
};
```


------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------




PROVIDER NODE

```
// providerNode.js

const express = require('express');
const bodyParser = require('body-parser');
const calimero = require('calimero'); 

const app = express();
app.use(bodyParser.json());

let patientRecords = {}; // Example patient records storage

// Middleware for authentication
async function authenticate(req, res, next) {
    const { patientId, signature } = req.body;
    // Verify the patient's signature using Calimero
    const isValid = await calimero.verifySignature(patientId, signature);
    if (!isValid) {
        return res.status(403).send('Unauthorized');
    }
    next();
}

// Endpoint to retrieve patient records
app.get('/records/:patientId', authenticate, (req, res) => {
    const { patientId } = req.params;
    const records = patientRecords[patientId];
    if (!records) {
        return res.status(404).send('Records not found');
    }
    res.json(records);
});

// Endpoint to update access permissions
app.post('/permissions', authenticate, (req, res) => {
    const { patientId, providerId, accessLevel } = req.body;
    // Update access control logic using Calimero
    calimero.updateAccess(patientId, providerId, accessLevel);
    res.send('Permissions updated');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Provider Node running on port ${PORT}`);
});

```

PATIENT NODE 

```
// patientNode.js

const express = require('express');
const bodyParser = require('body-parser');
const calimero = require('calimero'); 

const app = express();
app.use(bodyParser.json());

let patientData = {
    // Example patient data structure
    id: 'patient123',
    records: {},
    permissions: {},
};

// Endpoint to view medical records
app.get('/myRecords', async (req, res) => {
    const { patientId, signature } = req.body;
    // Verify patient's signature
    const isValid = await calimero.verifySignature(patientId, signature);
    if (!isValid) {
        return res.status(403).send('Unauthorized');
    }
    res.json(patientData.records);
});

// Endpoint to share records with a provider
app.post('/shareRecords', async (req, res) => {
    const { providerId } = req.body;
    // Update access using Calimero
    calimero.grantAccess(patientData.id, providerId);
    res.send('Records shared with provider');
});

// Endpoint to manage permissions
app.post('/managePermissions', async (req, res) => {
    const { providerId, accessLevel } = req.body;
    // Update permissions logic
    patientData.permissions[providerId] = accessLevel;
    res.send('Permissions updated');
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Patient Node running on port ${PORT}`);
});

```

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


### 1. **Bridging Fungible Tokens (bridging-fts)**
   - **Purpose**: This module allows the transfer of fungible tokens between the NEAR blockchain and Calimero shards.
   - **Application in SIGHTED**:
     - **Incentivizing Participation**: You can use fungible tokens as incentives for patients and healthcare providers to participate in the secure medical records sharing system. For example, patients could earn tokens for sharing their data securely or for participating in health studies.
     - **Payment for Services**: Allowing healthcare providers to receive payments in tokens for services rendered can streamline billing processes and enhance trust between patients and providers.
     - **Access Control**: You can implement a token-based access control mechanism where patients need to hold a specific token to grant healthcare providers access to their medical records, ensuring that only authorized personnel can view sensitive information.

### 2. **Calimero Login UI (calimero-login/ui)**
   - **Purpose**: This component provides a user interface for users to log into the Calimero platform using their wallets.
   - **Application in SIGHTED**:
     - **Secure Authentication**: The login UI allows patients and healthcare providers to securely authenticate their identities using blockchain wallets. This reduces the risk of unauthorized access to medical records.
     - **User-Friendly Experience**: A well-designed login interface can enhance user experience, making it easy for users to access their medical records without complicated processes.
     - **Integration with Decentralized Identity**: By leveraging the Calimero login, you can implement decentralized identity solutions that give users more control over their personal data and who can access it.

### 3. **Voting**
   - **Purpose**: This example demonstrates how to create a poll voting mechanism on the blockchain.
   - **Application in SIGHTED**:
     - **Consent Management**: You can use a voting system to allow patients to give consent for specific uses of their medical data. For example, patients could vote on whether to share their data for research purposes or with specific healthcare providers.
     - **Feedback Collection**: The voting mechanism can also be used to collect feedback from patients about their experiences with the SIGHTED platform, helping to improve services based on user input.
     - **Decision-Making Processes**: In a collaborative healthcare environment, voting can facilitate collective decision-making among healthcare providers when it comes to patient care strategies or treatment plans.
