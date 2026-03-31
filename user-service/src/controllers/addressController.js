import User from "../models/User.js";

// POST /api/users/address
export const addAddress = async (req, res) => {
  try {
    const { label, street, city, state, postalCode, country, isDefault } = req.body;

    if (!street || !city || !state || !postalCode) {
      return res.status(400).json({
        success: false,
        message: "Street, city, state, and postalCode are required.",
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // If new address is default, unset others
    if (isDefault) {
      user.addresses.forEach((addr) => { addr.isDefault = false; });
    }

    user.addresses.push({ label, street, city, state, postalCode, country, isDefault });
    await user.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully.",
      data: { addresses: user.addresses },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: "Server error adding address." });
  }
};

// GET /api/users/address
export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("addresses");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.status(200).json({
      success: true,
      data: { addresses: user.addresses },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching addresses." });
  }
};

// PUT /api/users/address/:addressId
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { label, street, city, state, postalCode, country, isDefault } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found." });
    }

    // If setting this address as default, unset others
    if (isDefault) {
      user.addresses.forEach((addr) => { addr.isDefault = false; });
    }

    if (label !== undefined) address.label = label;
    if (street !== undefined) address.street = street;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (postalCode !== undefined) address.postalCode = postalCode;
    if (country !== undefined) address.country = country;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully.",
      data: { addresses: user.addresses },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error updating address." });
  }
};

// DELETE /api/users/address/:addressId
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found." });
    }

    address.deleteOne();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully.",
      data: { addresses: user.addresses },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error deleting address." });
  }
};
