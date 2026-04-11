import { push, ref, set, get } from 'firebase/database';
import { db } from './config';

export async function createProduct(product) {
  const productsRef = ref(db, 'products');
  const newProductRef = push(productsRef);
  await set(newProductRef, product);
  return newProductRef.key;
}

export async function getProducts() {
  const productsRef = ref(db, 'products');
  const snapshot = await get(productsRef);

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();
  return Object.keys(data).map((key) => ({
    id: key,
    ...data[key],
  }));
}