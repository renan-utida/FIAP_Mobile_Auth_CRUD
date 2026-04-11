import { push, ref, set } from 'firebase/database';
import { db } from './config';

export async function createProduct(product) {
  const productsRef = ref(db, 'products');
  const newProductRef = push(productsRef);
  await set(newProductRef, product);
  return newProductRef.key;
}