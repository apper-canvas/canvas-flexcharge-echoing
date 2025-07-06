import mockOrganizations from '@/services/mockData/organizations.json';

class OrganizationService {
  constructor() {
    this.organizations = [...mockOrganizations];
  }

  async getAll() {
    await this.delay();
    return [...this.organizations];
  }

  async getById(id) {
    await this.delay();
    const organization = this.organizations.find(org => org.Id === parseInt(id));
    if (!organization) {
      throw new Error('Organization not found');
    }
    return { ...organization };
  }

  async create(data) {
    await this.delay();
    const newOrganization = {
      ...data,
      Id: this.getNextId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.organizations.push(newOrganization);
    return { ...newOrganization };
  }

  async update(id, data) {
    await this.delay();
    const index = this.organizations.findIndex(org => org.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Organization not found');
    }
    
    const updated = {
      ...this.organizations[index],
      ...data,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    this.organizations[index] = updated;
    return { ...updated };
  }

  async delete(id) {
    await this.delay();
    const index = this.organizations.findIndex(org => org.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Organization not found');
    }
    
    this.organizations.splice(index, 1);
    return { success: true };
  }

  getNextId() {
    return this.organizations.length > 0 
      ? Math.max(...this.organizations.map(org => org.Id)) + 1 
      : 1;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const organizationService = new OrganizationService();