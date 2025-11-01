import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { Settings as SettingsIcon, Save, Upload } from 'lucide-react';

export const HotelSettings = ({ hotel, onUpdateSuccess }) => {
    const [formData, setFormData] = React.useState({
        name: hotel.name || '',
        description: hotel.description || '',
        contactNo: hotel.contactNo || '',
        managerName: hotel.managerName || '',
        fullAddress: hotel.fullAddress || '',
        price: hotel.price || 0,
        noRoom: hotel.noRoom || 0,
        website: hotel.website || '',
    });

    const [saving, setSaving] = React.useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // TODO: Implement update API call
            console.log('Updating hotel settings:', formData);
            // await updateHotel(hotel._id, formData);
            // onUpdateSuccess(updatedHotel);
        } catch (error) {
            console.error('Error updating hotel:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <SettingsIcon className="h-5 w-5" />
                        <CardTitle className="text-xl">Hotel Settings</CardTitle>
                    </div>
                    <CardDescription>Manage your hotel information and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Hotel Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter hotel name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="managerName">Manager Name</Label>
                                    <Input
                                        id="managerName"
                                        name="managerName"
                                        value={formData.managerName}
                                        onChange={handleChange}
                                        placeholder="Enter manager name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactNo">Contact Number</Label>
                                    <Input
                                        id="contactNo"
                                        name="contactNo"
                                        value={formData.contactNo}
                                        onChange={handleChange}
                                        placeholder="Enter contact number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        placeholder="https://yourhotel.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Description</h3>
                            <div className="space-y-2">
                                <Label htmlFor="description">Hotel Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your hotel..."
                                    rows={4}
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* Location */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Location</h3>
                            <div className="space-y-2">
                                <Label htmlFor="fullAddress">Full Address</Label>
                                <Textarea
                                    id="fullAddress"
                                    name="fullAddress"
                                    value={formData.fullAddress}
                                    onChange={handleChange}
                                    placeholder="Enter full address"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* Pricing & Capacity */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Pricing & Capacity</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price per Night (€)</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="noRoom">Number of Rooms</Label>
                                    <Input
                                        id="noRoom"
                                        name="noRoom"
                                        type="number"
                                        value={formData.noRoom}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="1"
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Media Upload */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Media</h3>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="logo">Hotel Logo</Label>
                                    <div className="mt-2 flex items-center gap-4">
                                        {hotel.logo && (
                                            <img
                                                src={hotel.logo}
                                                alt="Hotel logo"
                                                className="w-16 h-16 rounded-full object-cover border"
                                            />
                                        )}
                                        <Button type="button" variant="outline" size="sm">
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload New Logo
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <Label>Hotel Images</Label>
                                    <div className="mt-2">
                                        <Button type="button" variant="outline" size="sm">
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload Images
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={saving}>
                                <Save className="h-4 w-4 mr-2" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
