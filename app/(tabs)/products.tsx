import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { ShoppingCart, Star, Heart } from 'lucide-react-native';
import Colors from '@/constants/Colors';

const products = [
  {
    id: 1,
    name: 'Organic Turmeric Powder',
    description: 'Premium quality organic turmeric powder with high curcumin content',
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.8,
    reviews: 156,
    image: 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Herbs & Spices',
    inStock: true,
  },
  {
    id: 2,
    name: 'Ashwagandha Capsules',
    description: 'Natural stress relief and energy support supplement',
    price: 39.99,
    originalPrice: null,
    rating: 4.9,
    reviews: 203,
    image: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Supplements',
    inStock: true,
  },
  {
    id: 3,
    name: 'Herbal Tea Blend',
    description: 'Calming blend of chamomile, lavender, and holy basil',
    price: 18.99,
    originalPrice: 22.99,
    rating: 4.7,
    reviews: 89,
    image: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Teas',
    inStock: true,
  },
  {
    id: 4,
    name: 'Neem Oil',
    description: 'Pure cold-pressed neem oil for skin and hair care',
    price: 16.99,
    originalPrice: null,
    rating: 4.6,
    reviews: 124,
    image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Oils',
    inStock: false,
  },
  {
    id: 5,
    name: 'Triphala Powder',
    description: 'Traditional Ayurvedic digestive support formula',
    price: 21.99,
    originalPrice: 26.99,
    rating: 4.8,
    reviews: 167,
    image: 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Herbs & Spices',
    inStock: true,
  },
  {
    id: 6,
    name: 'Meditation Cushion',
    description: 'Comfortable organic cotton meditation cushion',
    price: 45.99,
    originalPrice: null,
    rating: 4.9,
    reviews: 78,
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Accessories',
    inStock: true,
  },
];

export default function ProductsScreen() {
  const [favorites, setFavorites] = useState(new Set());
  const [cart, setCart] = useState(new Set());

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const addToCart = (productId) => {
    const newCart = new Set(cart);
    newCart.add(productId);
    setCart(newCart);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Wellness Products</Text>
          <Text style={styles.subtitle}>Natural remedies and wellness essentials</Text>
        </View>

        <View style={styles.productsGrid}>
          {products.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <TouchableOpacity 
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(product.id)}
                >
                  <Heart 
                    size={20} 
                    color={favorites.has(product.id) ? Colors.primary : Colors.textSecondary} 
                    fill={favorites.has(product.id) ? Colors.primary : "none"}
                  />
                </TouchableOpacity>
                {!product.inStock && (
                  <View style={styles.outOfStockBadge}>
                    <Text style={styles.outOfStockText}>Out of Stock</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.productInfo}>
                <Text style={styles.category}>{product.category}</Text>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
                
                <View style={styles.ratingContainer}>
                  <Star size={14} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.rating}>{product.rating}</Text>
                  <Text style={styles.reviews}>({product.reviews})</Text>
                </View>
                
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>${product.price}</Text>
                  {product.originalPrice && (
                    <Text style={styles.originalPrice}>${product.originalPrice}</Text>
                  )}
                </View>
                
                <TouchableOpacity 
                  style={[
                    styles.addToCartButton,
                    !product.inStock && styles.disabledButton,
                    cart.has(product.id) && styles.addedToCartButton
                  ]}
                  onPress={() => addToCart(product.id)}
                  disabled={!product.inStock || cart.has(product.id)}
                >
                  <ShoppingCart size={16} color={
                    !product.inStock ? Colors.textMuted : 
                    cart.has(product.id) ? Colors.success : Colors.textInverse
                  } />
                  <Text style={[
                    styles.addToCartText,
                    !product.inStock && styles.disabledButtonText,
                    cart.has(product.id) && styles.addedToCartText
                  ]}>
                    {!product.inStock ? 'Out of Stock' : 
                     cart.has(product.id) ? 'Added to Cart' : 'Add to Cart'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: Colors.backgroundSecondary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  productsGrid: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    padding: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  outOfStockText: {
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: '600',
  },
  productInfo: {
    padding: 16,
  },
  category: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  productDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    marginLeft: 4,
    marginRight: 4,
  },
  reviews: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: Colors.border,
  },
  addedToCartButton: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  addToCartText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButtonText: {
    color: Colors.textMuted,
  },
  addedToCartText: {
    color: Colors.success,
  },
});