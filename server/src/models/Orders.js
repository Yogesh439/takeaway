const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
  {
    productName: { type: String },
    maxLength: { type: String },
    pickupDate: { type: String },
    pickupTime: { type: String },
    senderId: { type: String },
    senderName: { type: String },
    receiverName: { type: String },
    receiverPhoneNo: { type: Number },
    unitItems: { type: String },
    weight: { type: Number },
    categoryName: { type: String },
    orderStatus: { type: String },
    orderStatusId: { type: Number, default: 1 },
    minimumDeliveryPrice: { type: Number },
    distance:{type: Number},
    discount:{type: Number},
    photo:{type: String}, 
  },
  { collection: "orders" }
);


module.exports = mongoose.model("Orders", ordersSchema);