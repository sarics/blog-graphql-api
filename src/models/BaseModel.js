import { Model } from 'objection';
import cuid from 'cuid';

class BaseModel extends Model {
  $beforeInsert() {
    this.id = cuid();
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  // $afterInsert() {
  //   if (this.createdAt) this.createdAt = this.createdAt.toISOString();
  //   if (this.updatedAt) this.updatedAt = this.updatedAt.toISOString();
  // }

  $beforeUpdate() {
    this.id = undefined;
    this.updatedAt = new Date().toISOString();
  }

  // $afterUpdate() {
  //   if (this.createdAt) this.createdAt = this.createdAt.toISOString();
  //   if (this.updatedAt) this.updatedAt = this.updatedAt.toISOString();
  // }

  // $afterGet() {
  //   if (this.createdAt) this.createdAt = this.createdAt.toISOString();
  //   if (this.updatedAt) this.updatedAt = this.updatedAt.toISOString();
  // }
}

export default BaseModel;
