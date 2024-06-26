////////////////////////////////////////////////////////////
// WARNING: AUTO GENERATED FILE
//
// DO NOT EDIT THIS FILE DIRECTLY
//
// Original source file exists in /shared_backend_code_source
// at the root of this repository
//
// Codegen command: bash commands/generate_shared_code.sh
//
////////////////////////////////////////////////////////////

const axios = require('axios');
const {
  getVaultNamespace,
  getVaultUrl,
} = require('./vaultUtils');

class VaultKeyManager {
  constructor({preventThrowingErrors}) {
    this.preventThrowingErrors = preventThrowingErrors;
  }

  getKVProviderName() {
    return "key_storage"
  }

  getKeyWriteReadUrl({
    secretKVDestinationName,
    secretName,
  }) {
    return `${getVaultUrl()}/v1/${secretKVDestinationName}/data/${secretName}`;
  }

  generateVaultHeaders({ vaultToken }) {
    return {
      'X-Vault-Request': true,
      'X-Vault-Namespace': getVaultNamespace(),
      'X-Vault-Token': vaultToken,
    };
  }

  async write({ secretName, data, vaultToken }) {
    try {
      const secretKVDestinationName = this.getKVProviderName();
      const url = this.getKeyWriteReadUrl({
        secretKVDestinationName,
        secretName,
      });
      const res = await axios({
        method: 'POST',
        url,
        headers: this.generateVaultHeaders({ vaultToken }),
        data: {
          data: {
            ...data,
          },
        },
      });
      return res;
    } catch (err) {
      const errMessage = "Error writing secrets to Vault"
      console.log(errMessage);
      if(!this.preventThrowingErrors) {
        throw new Error(errMessage);
      }
    }
  }

  async read({secretName, vaultToken}) {
    try {
      const secretKVDestinationName = this.getKVProviderName()
      const url = this.getKeyWriteReadUrl({
        secretKVDestinationName,
        secretName
      });
      const axiosParams = {
        method: 'GET',
        url,
        headers: this.generateVaultHeaders({ vaultToken }),
      };
      const res = await axios(axiosParams);
      if (res.status !== 200) {
        throw new Error('Vault received non 200 code while trying to retrive secret!');
      }
      const { data } = res.data.data;
      return data;
    } catch (err) {
      const errMessage = 'Error reading key from Vault';
      console.log(errMessage, err?.response?.statusText);
      if (!this.preventThrowingErrors) {
        throw new Error(errMessage);
      }
    }
  }
}

module.exports = {
  VaultKeyManager,
};
