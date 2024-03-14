import { React, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

import Navbar from "../../nav/Navbar";
import vector from "../../../assets/3.svg";
import google from "../../../assets/google.svg";
import "./sass/signup.css";

const SignUp = () => {
  const [isChecked, setIsChecked] = useState(false);

  const navigate = useNavigate();

  let initialValues = {
    username: "",
    email: "",
    password: "",
  };

  const Formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values, actions) => {
      console.log(values);
      actions.resetForm();
    },
    validate: (values) => {
      const errors = {};

      if (!values.username) {
        errors.username = "Please enter your username";
      }

      if (!values.email) {
        errors.email = "Please enter your email";
      }

      if (values.password.length <= 7) {
        errors.password = "Password must be 8 character long";
      }

      if (values.password.length == 0) {
        errors.password = "Please enter your password";
      }
      return errors;
    },
  });

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <Navbar />
      <div id="signup">
        <div className="img">
          <img src={vector} alt="" />
        </div>
        <div className="sign-up-form">
          <form onSubmit={Formik.handleSubmit}>
            <h2>Sign up</h2>
            <div className="username">
              <input
                type="text"
                placeholder="Username"
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
                value={Formik.values.username}
                name="username"
                required
              />
              {Formik.touched.username && Formik.errors.username && (
                <span className="error">{Formik.errors.username}</span>
              )}
            </div>
            <div className="email">
              <input
                type="email"
                placeholder="Email Address"
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
                value={Formik.values.email}
                name="email"
                required
              />
              {Formik.touched.email && Formik.errors.email && (
                <span className="error">{Formik.errors.email}</span>
              )}
            </div>
            <div className="pass">
              <input
                type={isChecked ? "text" : "password"}
                placeholder="Password"
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
                value={Formik.values.password}
                name="password"
                required
              />
              {Formik.touched.password && Formik.errors.password && (
                <span className="error">{Formik.errors.password}</span>
              )}
            </div>
            <label className="check-box">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <span>Show password</span>
            </label>
            <button
              className={`sign-up-button ${
                Formik.values.email.length !== 0 &&
                Formik.values.email.includes("@") &&
                Formik.values.password.length !== 0 &&
                "sign-up-button-active"
              } `}
              disabled={
                Formik.values.email.length !== 0 &&
                Formik.values.email.includes("@") &&
                Formik.values.password.length !== 0 &&
                false
              }
              type="submit"
            >
              Sign up
            </button>
            <div className="or-sign-up-with">
              <hr />
              <span>Or sign up with</span>
              <hr />
            </div>
            <div className="google-login-button">
              <img src={google} />
            </div>
            <div className="already-have-an-account">
              <p>
                Already have an account?{" "}
                <span onClick={() => navigate("/signin")}>Sign in</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
