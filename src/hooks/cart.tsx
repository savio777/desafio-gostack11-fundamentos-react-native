import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const getProducts = await AsyncStorage.getItem('GoMarketplace:products');

      if (getProducts) setProducts(JSON.parse(getProducts));
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const productExist = products.findIndex(p => p.id === product.id);

      if (productExist > -1) {
        const productsTemp = [...products];

        productsTemp[productExist].quantity += 1;

        setProducts(productsTemp);
      } else {
        setProducts([...products, { ...product, quantity: 1 }]);
      }

      await AsyncStorage.setItem(
        'GoMarketplace:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
      const productExist = products.findIndex(p => p.id === id);

      const productsTemp = [...products];

      productsTemp[productExist].quantity += 1;

      setProducts(productsTemp);

      await AsyncStorage.setItem(
        'GoMarketplace:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      const productExist = products.findIndex(p => p.id === id);

      const productsTemp = [...products];

      if (productsTemp[productExist].quantity > 1) {
        productsTemp[productExist].quantity -= 1;
      } else {
        productsTemp.splice(productExist, 1);
      }

      setProducts(productsTemp);

      await AsyncStorage.setItem(
        'GoMarketplace:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
