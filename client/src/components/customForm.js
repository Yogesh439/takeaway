import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { CustomButton } from "./customButton";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import priceMap from "../config/priceMap.json";
import "react-toastify/dist/ReactToastify.css";
import Map from "./map";
import "leaflet/dist/leaflet.css";
import * as Yup from 'yup';


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

      pickupDate: Yup.string()
      .required("Required"),

      pickupTime: Yup.string()
      .required("Required"),

      weight: Yup.string()
      .required("Required"),


    
  });

  return (
    <Formik
    
      initialValues={props.orderList || {}}
      validationSchema={itemSchema}
      validateOnMount={true}
      onSubmit={async (values, { resetForm }) => {
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
      {({ errors, touched }) => (
        <div
          style={{
            display: "flex",
            alignItem: "center",
            justifyContent: "center",
          }}
        >
          
          <Form>
            {formStep === 1 ? (
              <>
                {props.itemDetails.map((item) => {
                  return (
                    <div>
                      <Field
                        name={item}
                        key={item}
                        placeholder={item}
                        type={
                          item === "password"
                            ? "password"
                            : item === "pickupDate"
                            ? "date"
                            : item === "pickupTime"
                            ? "time"
                            : "text"
                        }
                      />
                      {errors[item] && touched[item] ? (
                        <div className="validaton-message">{errors[item]}</div>
                      ) : null}
                    </div>
                  );
                })}
              </>
            ) : null}
            {formStep === 2 && (
              <>
                <Map />
                <h2>
                  Total distance is: {distance} km Rs. {totalPrice || 0}
                </h2>
                <CustomButton name="Back" onClick={handleBackClick} />
              </>
            )}
            {formStep === 3 && (
              <>
                {props.senderDetails.map((item) => {
                  return (
                    <div>
                      <Field
                        name={item}
                        key={item}
                        placeholder={item}
                        type={item === "password" ? "password" : "text"}
                      />
                      {errors[item] && touched[item] ? (
                        <div className="validaton-message">{errors[item]}</div>
                      ) : null}
                    </div>
                  );
                })}
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
