import React, { useState, useMemo } from 'react';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

interface FloatingCartProps {
  navigateToCard(): void;
}

const FloatingCart: React.FC<FloatingCartProps> = ({ navigateToCard }) => {
  const { products } = useCart();

  const cartTotal = useMemo(() => {
    let total = 0;
    products.forEach(p => {
      total = total + p.price * p.quantity;
    });

    return formatValue(total);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    // TODO RETURN THE SUM OF THE QUANTITY OF THE PRODUCTS IN THE CART
    let total = 0;

    products.forEach(p => {
      total += p.quantity;
    });

    return total;
  }, [products]);

  return (
    <Container>
      <CartButton testID="navigate-to-cart-button" onPress={navigateToCard}>
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
