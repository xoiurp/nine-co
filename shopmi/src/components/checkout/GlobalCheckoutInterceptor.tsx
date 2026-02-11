"use client";

import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';

// Intercepts generic checkout buttons in the DOM and redirects to Yampi checkout
export default function GlobalCheckoutInterceptor() {
  const { cart } = useCart();

  useEffect(() => {
    const selectors = [
      'button[name="checkout"]',
      'input[name="checkout"]',
      '[href="/checkout"]',
      'form[action="/cart"] input[type="submit"]',
      'form[action="/cart"] button[type="submit"]',
      '.w-button[value="Finalizar Compra"]',
      'input[value="Finalizar Compra"]',
      'button.button-6',
      '[data-value="Finalizar Compra"]',
      'button, a'
    ];

    const onClick = async (evt: Event) => {
      const target = evt.currentTarget as HTMLElement | null;
      const text = (target?.textContent || '').toLowerCase();
      const value = (target as HTMLInputElement)?.value?.toLowerCase?.() || '';
      const isCheckoutIntent =
        text.includes('finalizar compra') ||
        text.includes('checkout') ||
        value.includes('finalizar compra') ||
        value.includes('checkout');

      if (!isCheckoutIntent) return;
      if (!cart || cart.length === 0) {
        console.log('[Checkout Interceptor] Carrinho vazio, ignorando');
        return;
      }

      console.log('[Checkout Interceptor] Interceptando clique de checkout:', { text, value, cartItems: cart.length });

      evt.preventDefault();
      evt.stopPropagation();

      // Call Yampi checkout API
      try {
        const items = cart.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        }));

        const res = await fetch('/api/checkout/yampi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        });

        const data = await res.json();
        console.log('[Checkout Interceptor] Dooki response:', data);

        const redirectUrl =
          data.checkout_direct_url ||
          data.checkout_url ||
          data.redirect_url ||
          data.url ||
          data.data?.checkout_direct_url ||
          data.data?.checkout_url ||
          data.data?.url;

        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          console.error('[Checkout Interceptor] No redirect URL in response:', data);
        }
      } catch (error) {
        console.error('[Checkout Interceptor] Erro na requisição de checkout:', error);
      }
    };

    const attach = () => {
      const nodes = document.querySelectorAll(selectors.join(', '));
      nodes.forEach((node) => {
        const anyNode = node as any;
        if (anyNode.__checkoutAttached) return;
        node.addEventListener('click', onClick, { capture: true });
        anyNode.__checkoutAttached = true;
      });
    };

    attach();
    const t = setInterval(attach, 1000);
    return () => {
      clearInterval(t);
      const nodes = document.querySelectorAll(selectors.join(', '));
      nodes.forEach((node) => {
        node.removeEventListener('click', onClick, { capture: true } as any);
      });
    };
  }, [cart]);

  return null;
}
