import DOMPurify from "../../utils/dompurifyConfig";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Login.module.css";

const useInput = (initialValue, externalError) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  const handleInputChange = (e) => {
    setValue(e.target.value);

    if (error) {
      setError(null);
    }
  };

  return {
    value,
    error,
    handleInputChange,
  };
};

const Login = () => {
  // Imports from useLogin hook
  const { login, error, isLoading, clearError } = useLogin();

  const emailInput = useInput("", error);
  const passwordInput = useInput("", error);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    const sanitizedValue = DOMPurify.sanitize(e.target.value);

    setEmail(sanitizedValue);
    emailInput.handleInputChange({ target: { value: sanitizedValue } });
    clearError();
  };

  const handlePasswordChange = (e) => {
    const sanitizedValue = DOMPurify.sanitize(e.target.value);

    setPassword(sanitizedValue);
    passwordInput.handleInputChange({ target: { value: sanitizedValue } });
    clearError();
  };

  const [isFormValid, setIsFormValid] = useState(false);
  const [trySubmit, setTrySubmit] = useState(false);

  // For aria-live region when switching between Login & Signup pages
  const [liveMessage, setLiveMessage] = useState("");

  // Update form validity
  useEffect(() => {
    if (email && password) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setTrySubmit(true);
      return;
    }

    await login(email, password);
  };

  const navigate = useNavigate();

  const goToSignup = () => {
    setLiveMessage("Now on the signup form.");
    setTimeout(() => {
      navigate("/Signup");
    }, 100);
  };

  // Set error display according to missing fields
  const missingFields = () => {
    let fields = [];
    if (!email) fields.push("Email");
    if (!password) fields.push("Password");
    return fields;
  };

  const loginIcon = <FontAwesomeIcon icon={faRightToBracket} />;
  const signupIcon = <FontAwesomeIcon icon={faUserPlus} />;

  return (
    <>
      <main className={styles.loginWrapper}>
        <form
          className={`${styles.loginForm} login-form`}
          onSubmit={handleSubmit}>
          <div aria-live="polite">
            {(trySubmit && !isFormValid) || error ? (
              <>
                {trySubmit && !isFormValid ? (
                  <div className="error">
                    Please fill in the following fields:{" "}
                    {missingFields().join(", ")}
                  </div>
                ) : (
                  <div className="error">{error}</div>
                )}
              </>
            ) : null}
          </div>

          <h2 id="formTitle" className="login-signup-title">
            Login here:
          </h2>

          <label htmlFor="email">Email*</label>
          <input
            aria-label="Login form. Email input."
            id="email"
            type="email"
            autoComplete="off"
            onChange={handleEmailChange}
            value={email}
            className={
              (trySubmit && !email) || emailInput.error ? "error" : "primary"
            }
            aria-required
          />

          <label htmlFor="password">Password*</label>
          <input
            aria-label="Login form. Password input."
            id="password"
            type="password"
            autoComplete="off"
            onChange={handlePasswordChange}
            value={password}
            className={
              (trySubmit && !password) || passwordInput.error
                ? "error"
                : "primary"
            }
            aria-required
          />

          <div>
            <button className="login-btn" disabled={isLoading}>
              {loginIcon} Login
            </button>
            {error && <div className="error">{error}</div>}
          </div>
        </form>
        <section className={`${styles.loginSwitchFormsBtns} switch-form-btns`}>
          <div
            aria-live="polite"
            aria-atomic="true"
            className="aria-live-hidden">
            {liveMessage}
          </div>
          <div className="switch-form-text-prompt">Need an account?</div>
          <button
            className="switch-form-btn"
            onClick={goToSignup}
            aria-label="Go to signup for account page">
            {signupIcon} Signup
          </button>
        </section>
      </main>
    </>
  );
};

export default Login;
