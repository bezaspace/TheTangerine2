import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { ShoppingCart, Star, Heart } from 'lucide-react-native';

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
                    color={favorites.has(product.id) ? "#FF8C42" : "#6B7280"} 
                    fill={favorites.has(product.id) ? "#FF8C42" : "none"}
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
                    !product.inStock ? "#9CA3AF" : 
                    cart.has(product.id) ? "#87A96B" : "#FFFFFF"
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
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  productsGrid: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  productInfo: {
    padding: 16,
  },
  category: {
    fontSize: 12,
    color: '#87A96B',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  productDescription: {
    fontSize: 14,
    color: '#6B7280',
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
    color: '#1F2937',
    fontWeight: '500',
    marginLeft: 4,
    marginRight: 4,
  },
  reviews: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF8C42',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF8C42',
    paddingVertical: 12,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
  },
  addedToCartButton: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#87A96B',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
  addedToCartText: {
    color: '#87A96B',
  },
});