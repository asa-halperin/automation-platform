import { createConfig } from '@platform/test-core';

export default createConfig('http://localhost:3001', {
  storageState: '.auth/admin.json'
});