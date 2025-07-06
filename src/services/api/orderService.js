import mockOrders from '@/services/mockData/orders.json';

class OrderService {
  constructor() {
    this.orders = [...mockOrders];
  }

  async getAll() {
    await this.delay();
    return [...this.orders];
  }

  async getById(id) {
    await this.delay();
    const order = this.orders.find(o => o.Id === parseInt(id));
    if (!order) {
      throw new Error('Order not found');
    }
    return { ...order };
  }

  async create(data) {
    await this.delay();
    const newOrder = {
      ...data,
      Id: this.getNextId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.orders.push(newOrder);
    return { ...newOrder };
  }

  async update(id, data) {
    await this.delay();
    const index = this.orders.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Order not found');
    }
    
    const updated = {
      ...this.orders[index],
      ...data,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    this.orders[index] = updated;
    return { ...updated };
  }

  async delete(id) {
    await this.delay();
    const index = this.orders.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Order not found');
    }
    
    this.orders.splice(index, 1);
    return { success: true };
  }

  getNextId() {
    return this.orders.length > 0 
      ? Math.max(...this.orders.map(o => o.Id)) + 1 
      : 1;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 350));
  }
}

export const orderService = new OrderService();