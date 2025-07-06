import mockCustomers from '@/services/mockData/customers.json';

class CustomerService {
  constructor() {
    this.customers = [...mockCustomers];
  }

  async getAll() {
    await this.delay();
    return [...this.customers];
  }

  async getById(id) {
    await this.delay();
    const customer = this.customers.find(c => c.Id === parseInt(id));
    if (!customer) {
      throw new Error('Customer not found');
    }
    return { ...customer };
  }

  async create(data) {
    await this.delay();
    const newCustomer = {
      ...data,
      Id: this.getNextId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.customers.push(newCustomer);
    return { ...newCustomer };
  }

  async update(id, data) {
    await this.delay();
    const index = this.customers.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Customer not found');
    }
    
    const updated = {
      ...this.customers[index],
      ...data,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    this.customers[index] = updated;
    return { ...updated };
  }

  async delete(id) {
    await this.delay();
    const index = this.customers.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Customer not found');
    }
    
    this.customers.splice(index, 1);
    return { success: true };
  }

  getNextId() {
    return this.customers.length > 0 
      ? Math.max(...this.customers.map(c => c.Id)) + 1 
      : 1;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const customerService = new CustomerService();