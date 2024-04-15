import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { CustomButton } from "./customButton";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import priceMap from "../config/priceMap.json";
import "react-toastify/dist/ReactToastify.css";
import Map from "./map";
import "leaflet/dist/leaflet.css";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomForm = (props) => {
  const { _id } = useSelector((state) => state.user);
  const { distance } = useSelector((state) => state.location);

  const [formStep, setFormStep] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleBackClick = () => {
    setFormStep(formStep - 1);
  };

  toast.success(JSON.stringify(props.orderLists));

  const itemSchema = Yup.object().shape({
    productName: Yup.string()
      .min(3, "Too Short!")
      .max(100, "Too Long!")
      .required("Required"),
    pickupDate: Yup.date().required("Required"),
    pickupTime: Yup.string().required("Required"),
    weight: Yup.string().required("Required"),

    receiverPhoneNo: Yup.string()
      .matches(/^[0-9]+$/, "Receiver phone number must contain only digits")
      .min(10, "Receiver phone number must be at least 10 digits")
      .max(10, "Receiver phone number must not exceed 10 digits"),
  });

  return (
    <Formik
      initialValues={props.orderList || {}}
      validationSchema={itemSchema}
      validateOnMount={true}
      onSubmit={async (values, { resetForm, setFieldValue }) => {
        const formattedDate = new Date(values.pickupDate).toLocaleDateString(
          "en-US",
          { year: "numeric", month: "2-digit", day: "2-digit" }
        );

        if (formStep <= 2) {
          setFormStep(formStep + 1);
        } else {
          values.minimumDeliveryPrice = props.basePrice;
          values.categoryName = props.categoryName;
          values.senderId = _id;
          values.totalPrice = totalPrice;
          values.distance = distance;
          // values.discount =  priceMap[props.categoryName].discountPerUnitPrice
          values.discount = priceMap[props.categoryName];
          values.orderStatus = "Pending";
          values.photo = props.photo;
          values.pickupDate = formattedDate;
          axios.post(
            `${process.env.REACT_APP_API_URL}/${props.endpoint}`,
            values
          );
          console.log(values);
        }
        const { weight, unitItems } = values;
        const finalPrice = weight * unitItems * props.basePrice * distance;
        setTotalPrice(
          finalPrice -
            (finalPrice * priceMap[props.categoryName].discountPerUnitPrice) /
              100
        );
      }}
    >
      {({ errors, touched, values, setFieldValue }) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Form>
            {formStep === 1 && (
              <>
                {props.itemDetails.map((item) => (
                  <div key={item}>
                    {item === "pickupDate" ? (
                      <DatePicker
                        name="pickupDate"
                        selected={values.pickupDate}
                        onChange={(date) => setFieldValue("pickupDate", date)}
                        minDate={new Date()}
                        defaultValue={new Date(Date.now() - 86400000)}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="pickupDate"
                      />
                    ): item === "pickupTime" ? (
                      <input
                        type="time"
                        id="pickupTime"
                        name="pickupTime"
                        value={values.pickupTime}
                        onChange={(e) => setFieldValue("pickupTime", e.target.value)}
                        required
                      />
                    )  : (
                      <Field
                        name={item}
                        placeholder={item}
                        type={item === "password" ? "password" : "text"}
                      />
                    )}
                    <ErrorMessage
                      name={item}
                      component="div"
                      className="validaton-message"
                    />
                  </div>
                ))}
              </>
            )}
            {formStep === 2 && (
              <>
                <Map />
                {/* <h2>Total distance is this: {distance} km
                </h2> */}
                <CustomButton name="Back" onClick={handleBackClick} />
              </>
            )}
            {formStep === 3 && (
              <>
                {props.senderDetails.map((item) => (
                  <div key={item}>
                    <Field
                      name={item}
                      placeholder={item}
                      type={item === "password" ? "password" : "text"}
                    />
                    <ErrorMessage
                      name={item}
                      component="div"
                      className="validaton-message"
                    />
                  </div>
                ))}
                <CustomButton name="Back" onClick={handleBackClick} />
              </>
            )}
            <CustomButton
              name={formStep <= 2 ? "Next" : "Submit"}
              type="submit"
            />
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default CustomForm;
