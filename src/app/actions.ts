'use server';

import { revalidatePath } from 'next/cache';
import { collection, addDoc, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product, BannerSettings } from '@/lib/types';


// Product Actions
export async function addProduct(productData: Omit<Product, 'id'>) {
  try {
    const productsCollection = collection(db, 'products');
    await addDoc(productsCollection, productData);
    revalidatePath('/products');
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Could not add product.');
  }
}

export async function updateProduct(productId: string, productData: Partial<Product>) {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, productData);
    revalidatePath('/products');
    revalidatePath(`/shop/${productId}`);
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Could not update product.');
  }
}

export async function deleteProduct(productId: string) {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    revalidatePath('/products');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Could not delete product.');
  }
}

// Order Actions
export async function updateOrderTransactionId(orderId: string, transactionId: string) {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { transactionId });
    revalidatePath('/orders');
  } catch (error) {
    console.error('Error updating order:', error);
    throw new Error('Could not update order.');
  }
}

export async function deleteOrder(orderId: string) {
    try {
        const orderRef = doc(db, 'orders', orderId);
        await deleteDoc(orderRef);
        revalidatePath('/orders');
    } catch (error) {
        console.error('Error deleting order:', error);
        throw new Error('Could not delete order.');
    }
}

// Banner Actions
export async function updateBannerSettings(settings: BannerSettings) {
  try {
    const bannerRef = doc(db, 'settings', 'promoBanner');
    await setDoc(bannerRef, settings, { merge: true });
    revalidatePath('/shop'); // Revalidate shop to show/hide banner
  } catch (error) {
    console.error('Error updating banner settings:', error);
    throw new Error('Could not update banner settings.');
  }
}
