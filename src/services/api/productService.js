import mockProducts from '@/services/mockData/products.json';

class ProductService {
  constructor() {
    this.products = [...mockProducts];
  }

  async getAll() {
    await this.delay();
    return [...this.products];
  }

  async getById(id) {
    await this.delay();
    const product = this.products.find(p => p.Id === parseInt(id));
    if (!product) {
      throw new Error('Product not found');
    }
    return { ...product };
  }

  async create(data) {
    await this.delay();
    const newProduct = {
      ...data,
      Id: this.getNextId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.products.push(newProduct);
    return { ...newProduct };
  }

  async update(id, data) {
    await this.delay();
    const index = this.products.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    const updated = {
      ...this.products[index],
      ...data,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    this.products[index] = updated;
    return { ...updated };
  }

  async delete(id) {
    await this.delay();
    const index = this.products.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    this.products.splice(index, 1);
    return { success: true };
  }

  getNextId() {
    return this.products.length > 0 
      ? Math.max(...this.products.map(p => p.Id)) + 1 
      : 1;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const productService = new ProductService();