import mockBillingModels from '@/services/mockData/billingModels.json';

class BillingModelService {
  constructor() {
    this.models = [...mockBillingModels];
  }

  async getAll() {
    await this.delay();
    return [...this.models];
  }

  async getById(id) {
    await this.delay();
    const model = this.models.find(m => m.Id === parseInt(id));
    if (!model) {
      throw new Error('Billing model not found');
    }
    return { ...model };
  }

  async create(data) {
    await this.delay();
    const newModel = {
      ...data,
      Id: this.getNextId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.models.push(newModel);
    return { ...newModel };
  }

async update(id, data) {
    await this.delay();
    const index = this.models.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Billing model not found');
    }
    
    const updated = {
      ...this.models[index],
      ...data,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    // Deep merge configuration if provided
    if (data.configuration) {
      updated.configuration = {
        ...this.models[index].configuration,
        ...data.configuration
      };
    }
    
    this.models[index] = updated;
    return { ...updated };
  }

  async updateConfiguration(id, configuration) {
    await this.delay();
    const index = this.models.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Billing model not found');
    }
    
    const updated = {
      ...this.models[index],
      configuration: {
        ...this.models[index].configuration,
        ...configuration
      },
      updatedAt: new Date().toISOString()
    };
    
    this.models[index] = updated;
    return { ...updated };
  }

  async delete(id) {
    await this.delay();
    const index = this.models.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Billing model not found');
    }
    
    this.models.splice(index, 1);
    return { success: true };
  }

  getNextId() {
    return this.models.length > 0 
      ? Math.max(...this.models.map(m => m.Id)) + 1 
      : 1;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 250));
  }
}

export const billingModelService = new BillingModelService();