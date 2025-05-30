import { getItemById } from '../../Api/item.api';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Navbar } from '../../components/Navbar'
import StarRating from '../../components/StarRating'
import { ArrowLeft, ShoppingCart, Package, CreditCard, Banknote, Plus, Minus } from 'lucide-react'
import { toast } from 'sonner'

export const ItemPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedOption, setSelectedOption] = useState('purchase');

    const fetchItemById = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getItemById(productId);
            // Handle the API response structure where item data is in res.data.message
            setItem(res.data.message || res.data);
        } catch (err) {
            setError("Failed to load product");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (productId) {
            fetchItemById();
        }
    }, [productId])

    const handleAddToCart = () => {
        const action = selectedOption === 'rent' ? 'rent' : 'purchase';
        const message = `Added ${quantity} ${item.name} to cart (${action})`;
        toast.success(message);
        // TODO: Integrate with cart context
    }

    const handleBuyNow = () => {
        const action = selectedOption === 'rent' ? 'rent' : 'purchase';
        const message = `Proceeding to checkout for ${quantity} ${item.name} (${action})`;
        toast.success(message);
        // TODO: Navigate to checkout
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading product...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Card className="max-w-md mx-auto">
                        <CardContent className="p-6 text-center">
                            <div className="text-red-500 mb-4">
                                <Package className="h-12 w-12 mx-auto" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Not Found</h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <Button onClick={() => navigate('/shop')} variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Shop
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!item) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/shop')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Shop
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <Card className="overflow-hidden rounded-xl">
                            <CardContent className="p-0">
                                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                    {item.images && item.images.length > 0 ? (
                                        <img
                                            src={item.images[selectedImage]}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/placeholder-image.jpg';
                                            }}
                                        />
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <Package className="h-16 w-16 mx-auto mb-2" />
                                            <p>No image available</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Thumbnail Gallery */}
                        {item.images && item.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {item.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index
                                            ? 'border-blue-500'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${item.name} view ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/placeholder-image.jpg';
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">
                                        {item.category}
                                    </Badge>
                                    {item.stock <= 5 && (
                                        <Badge variant="destructive" className="text-xs">
                                            Low Stock
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.name}</h1>
                            <div className="flex items-center gap-4 mb-4">
                                <StarRating rating={item.avgRating || 0} />
                                <span className="text-gray-600">
                                    ({item.totalReviews || 0} {item.totalReviews === 1 ? 'review' : 'reviews'})
                                </span>
                            </div>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {item.description || 'This is a high-quality adventure gear item perfect for your outdoor adventures.'}
                            </p>
                        </div>

                        {/* Price */}
                        <Card className="rounded-xl">
                            <CardContent className="p-6">
                                <div className="text-3xl font-bold text-gray-900 mb-4">
                                    ${selectedOption === 'rent' ? Math.round(item.price * 0.3) : item.price}
                                    {selectedOption === 'rent' && <span className="text-base font-normal text-gray-500">/day</span>}
                                </div>
                                {selectedOption === 'rent' && (
                                    <p className="text-sm text-gray-500 mb-4">Purchase price: ${item.price}</p>
                                )}

                                {/* Purchase/Rent Options */}
                                <div className="flex gap-2 mb-4">
                                    {item.purchase && (
                                        <Badge variant={selectedOption === 'purchase' ? 'default' : 'outline'} className="flex items-center gap-1 cursor-pointer" onClick={() => setSelectedOption('purchase')}>
                                            <CreditCard className="h-3 w-3" />
                                            Purchase
                                        </Badge>
                                    )}
                                    {item.rent && (
                                        <Badge variant={selectedOption === 'rent' ? 'default' : 'outline'} className="flex items-center gap-1 cursor-pointer" onClick={() => setSelectedOption('rent')}>
                                            <Banknote className="h-3 w-3" />
                                            Rent
                                        </Badge>
                                    )}
                                </div>

                                {/* Stock Status */}
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600">
                                        Stock: <span className="font-semibold">{item.stock} available</span>
                                    </p>
                                </div>

                                {/* Quantity Selector */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantity
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-12 text-center font-medium">{quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setQuantity(Math.min(item.stock, quantity + 1))}
                                            disabled={quantity >= item.stock}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <Button
                                        className="w-full"
                                        size="lg"
                                        onClick={handleBuyNow}
                                        disabled={item.stock === 0}
                                    >
                                        {item.stock === 0 ? 'Out of Stock' : 'Buy Now'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        size="lg"
                                        onClick={handleAddToCart}
                                        disabled={item.stock === 0}
                                    >
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Add to Cart
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Info */}
                        <Card className="rounded-xl">
                            <CardHeader>
                                <h3 className="text-lg font-semibold">Product Information</h3>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Category:</span>
                                    <span className="font-medium">{item.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Available for:</span>
                                    <div className="flex gap-2">
                                        {item.purchase && <Badge variant="outline">Purchase</Badge>}
                                        {item.rent && <Badge variant="outline">Rent</Badge>}
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Stock:</span>
                                    <span className="font-medium">{item.purchaseStock} units</span>
                                        <span className="font-medium">{item.rentalStock} units</span>
                                </div>
                                {item.adventures && item.adventures.length > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Related Adventures:</span>
                                        <span className="font-medium">{item.adventures.length}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
