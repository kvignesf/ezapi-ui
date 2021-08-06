import React from "react";
import { ErrorMessage, Field, Form, Formik, useFormik } from "formik";
import { MenuItem, Select, TextField } from "@material-ui/core";
import countryList from "react-select-country-list";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import billingDetailsSchema from "./billingDetailsSchema";
import { PrimaryButton } from "../shared/components/AppButton";

const BillingDetailsForm = ({ disabled = false, formRef }) => {
  return (
    <div className='mb-8'>
      <p className='text-subtitle1 mb-3'>Billing Details</p>

      <Formik
        initialValues={{
          fullName: "",
          company: "",
          country: "",
          addressLine1: "",
          addressLine2: "",
          zip: "",
          city: "",
          state: "",
          email: "",
          phone: "",
        }}
        validationSchema={billingDetailsSchema}
        innerRef={formRef}
      >
        {({ values, errors, touched }) => {
          return (
            <Form>
              <div className='mb-4'>
                <p className='text-overline2 mb-2'>Full Name</p>

                <Field
                  id='fullName'
                  name='fullName'
                  fullWidth
                  color='primary'
                  variant='outlined'
                  disabled={disabled}
                  error={touched.fullName && Boolean(errors.fullName)}
                  helperText={<ErrorMessage name='fullName' />}
                  onKeyUp={(e) => {}}
                  inputProps={{
                    style: {
                      height: "6px",
                    },
                  }}
                  as={TextField}
                />
              </div>

              <div className='mb-4'>
                <p className='text-overline2 mb-2'>
                  Company Name
                  <span className='text-overline2 text-neutral-gray4 ml-1'>
                    (optional)
                  </span>
                </p>

                <Field
                  id='company'
                  name='company'
                  fullWidth
                  color='primary'
                  variant='outlined'
                  disabled={disabled}
                  error={touched.company && Boolean(errors.company)}
                  helperText={<ErrorMessage name='company' />}
                  onKeyUp={(e) => {}}
                  inputProps={{
                    style: {
                      height: "6px",
                    },
                  }}
                  as={TextField}
                />
              </div>

              <div className='mb-4'>
                <p className='text-overline2 mb-2'>Country</p>

                <Field
                  labelId='country-select-label'
                  id='country'
                  name='country'
                  value={values.country}
                  disabled={disabled}
                  variant='outlined'
                  error={touched.country && Boolean(errors.country)}
                  helperText={<ErrorMessage name='country' />}
                  style={{ width: "100%" }}
                  defaultValue={"India"}
                  as={Select}
                >
                  {countryList()
                    .getData()
                    ?.map((country) => {
                      return (
                        <MenuItem value={country?.label}>
                          {country?.label}
                        </MenuItem>
                      );
                    })}
                </Field>
                {touched?.country && Boolean(errors?.country) && (
                  <p
                    className='py-1'
                    style={{
                      fontSize: "0.75rem",
                      marginLeft: "1rem",
                      color: "#f44336",
                    }}
                  >
                    {errors?.country}
                  </p>
                )}
              </div>

              <div className='mb-4'>
                <p className='text-overline2 mb-2'>Address Line 1</p>

                <Field
                  id='addressLine1'
                  name='addressLine1'
                  fullWidth
                  color='primary'
                  variant='outlined'
                  disabled={disabled}
                  error={touched.addressLine1 && Boolean(errors.addressLine1)}
                  helperText={<ErrorMessage name='addressLine1' />}
                  onKeyUp={(e) => {}}
                  inputProps={{
                    style: {
                      height: "6px",
                    },
                  }}
                  as={TextField}
                />
              </div>

              <div className='mb-4'>
                <p className='text-overline2 mb-2'>Address Line 2</p>

                <Field
                  id='addressLine2'
                  name='addressLine2'
                  fullWidth
                  color='primary'
                  variant='outlined'
                  disabled={disabled}
                  error={touched.addressLine2 && Boolean(errors.addressLine2)}
                  helperText={<ErrorMessage name='addressLine2' />}
                  onKeyUp={(e) => {}}
                  inputProps={{
                    style: {
                      height: "6px",
                    },
                  }}
                  as={TextField}
                />
              </div>

              <div className='flex flex-row mb-3'>
                <div className='mr-3'>
                  <p className='text-overline2 mb-2'>Zipcode</p>

                  <Field
                    id='zip'
                    name='zip'
                    fullWidth
                    color='primary'
                    variant='outlined'
                    disabled={disabled}
                    error={touched.zip && Boolean(errors.zip)}
                    helperText={<ErrorMessage name='zip' />}
                    onKeyUp={(e) => {}}
                    inputProps={{
                      style: {
                        height: "6px",
                      },
                    }}
                    as={TextField}
                  />
                </div>

                <div className='mr-3'>
                  <p className='text-overline2 mb-2'>City</p>

                  <Field
                    id='city'
                    name='city'
                    fullWidth
                    color='primary'
                    variant='outlined'
                    disabled={disabled}
                    error={touched.city && Boolean(errors.city)}
                    helperText={<ErrorMessage name='city' />}
                    onKeyUp={(e) => {}}
                    inputProps={{
                      style: {
                        height: "6px",
                      },
                    }}
                    as={TextField}
                  />
                </div>

                <div className=''>
                  <p className='text-overline2 mb-2'>State</p>

                  <Field
                    id='state'
                    name='state'
                    fullWidth
                    color='primary'
                    variant='outlined'
                    disabled={disabled}
                    error={touched.state && Boolean(errors.state)}
                    helperText={<ErrorMessage name='state' />}
                    onKeyUp={(e) => {}}
                    inputProps={{
                      style: {
                        height: "6px",
                      },
                    }}
                    as={TextField}
                  />
                </div>
              </div>

              <div className='flex flex-row'>
                <div className='mr-3 w-full'>
                  <p className='text-overline2 mb-2'>Email Address</p>

                  <Field
                    id='email'
                    name='email'
                    fullWidth
                    color='primary'
                    variant='outlined'
                    disabled={disabled}
                    error={touched.email && Boolean(errors.email)}
                    helperText={<ErrorMessage name='email' />}
                    onKeyUp={(e) => {}}
                    inputProps={{
                      style: {
                        height: "6px",
                      },
                    }}
                    as={TextField}
                  />
                </div>

                <div className='w-full'>
                  <p className='text-overline2 mb-2'>
                    Phone Number
                    <span className='text-overline2 text-neutral-gray4 ml-1'>
                      (optional)
                    </span>
                  </p>

                  <Field
                    id='phone'
                    name='phone'
                    fullWidth
                    color='primary'
                    variant='outlined'
                    disabled={disabled}
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={<ErrorMessage name='phone' />}
                    onKeyUp={(e) => {}}
                    inputProps={{
                      style: {
                        height: "42px",
                        width: "100%",
                      },
                    }}
                    value={values?.phone}
                    country={"us"}
                    // disabled={isLoading || isSuccess}
                    // disableDropdown={isLoading || isSuccess}
                    as={PhoneInput}
                  />
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default BillingDetailsForm;
