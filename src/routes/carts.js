const express = require('express');
const router = express.Router();
const Cart = require('../dao/models/CartModel');

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = req.body;
        const createdCart = await Cart.create(newCart);
        res.status(201).json(createdCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un carrito por su ID
router.get('/:cartId', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cartId);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agregar un producto a un carrito
router.post('/:cartId/products/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const cart = await Cart.findById(cartId);
        if (cart) {
            cart.products.push({ productId, quantity: 1 });
            await cart.save();
            res.status(201).json(cart);
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un producto de un carrito
router.delete('/:cartId/products/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const cart = await Cart.findById(cartId);
        if (cart) {
            cart.products = cart.products.filter(item => item.productId !== productId);
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
