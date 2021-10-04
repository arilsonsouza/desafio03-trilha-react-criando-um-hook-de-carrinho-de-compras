import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const findProductInCart = (productId: number) => {
    return cart.find(product => product.id === productId)
  };

  const updateCart = (updatedCart: Product[]) => {
    setCart(updatedCart)
    localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart));
  };

  const addProduct = async (productId: number) => {
    try {
      const cartProduct = findProductInCart(productId)
      const cartProductAmount = cartProduct ? cartProduct.amount + 1 : 1;

      const { data: stock } = await api.get<Stock>(`/stock/${productId}`);

      if (cartProductAmount > stock.amount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      if (cartProduct) {
        const updatedCart: any = cart.map(product => {
          if (cartProduct.id === product.id) {
            return {
              ...product,
              amount: cartProductAmount
            }
          }

          return product;
        });

        updateCart(updatedCart)
      } else {
        const { data: product } = await api.get<Product>(`/products/${productId}`);
        updateCart([...cart, { ...product, amount: 1 }]);
      }
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
