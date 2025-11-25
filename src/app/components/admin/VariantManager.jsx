'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import ImageUploader from './ImageUploader';
import { toast } from 'react-toastify';

const VariantChip = ({ variant, onRemove }) => (
    <div className="bg-gray-100 rounded-lg p-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
            <span className="font-semibold">{variant?.colorName}</span>
            <span className="text-gray-500">(Qty: {variant?.quantity})</span>
            {variant.images.length > 0 && 
                <div className="flex items-center gap-1 text-gray-500">
                    <ImageIcon className="w-4 h-4" />
                    <span>{variant.images.length}</span>
                </div>
            }
        </div>
        <button onClick={onRemove} className="text-gray-400 hover:text-red-500">
            <X className="w-4 h-4" />
        </button>
    </div>
);


export default function VariantManager({ variants, setVariants }) {
    const [colorName, setColorName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [variantImages, setVariantImages] = useState([]);

    const handleAddVariant = () => {
        if (!colorName) {
            toast.warning('Please enter a color name.');
            return;
        }
        setVariants([...variants, { colorName, quantity, images: variantImages }]);
        setColorName('');
        setQuantity(1);
        setVariantImages([]);
    };
    
    const removeVariant = (indexToRemove) => {
        setVariants(variants.filter((_, index) => index !== indexToRemove));
    };

    const handleVariantImageUpload = (urls) => {
        setVariantImages(prev => [...prev, ...urls]);
    };

    const removeVariantImage = (indexToRemove) => {
        setVariantImages(variantImages.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Color Variants</h3>

            <div className="space-y-4 p-4 border rounded-lg">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="colorName">Color Name</Label>
                        <Input
                            id="colorName"
                            placeholder="e.g., Rose Gold"
                            value={colorName?colorName :""}
                            onChange={(e) => setColorName(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                            id="quantity"
                            type="number"
                            placeholder="1"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                            min="1"
                        />
                    </div>
                </div>

                <div>
                    <Label>Variant Images</Label>
                     <ImageUploader 
                        onUploadComplete={handleVariantImageUpload}
                        uploadedImages={variantImages}
                        onRemoveImage={removeVariantImage}
                        maxFiles={3}
                        uploaderId={`variant-uploader-${variants.length}`}
                    />
                </div>
               
                <Button onClick={handleAddVariant} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Variant
                </Button>
            </div>
            
            {variants.length > 0 && (
                <div className="space-y-2">
                    <Label>Added Variants</Label>
                    <div className="flex flex-wrap gap-2">
                        {variants.map((variant, index) => (
                            <VariantChip key={index} variant={variant} onRemove={() => removeVariant(index)} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}