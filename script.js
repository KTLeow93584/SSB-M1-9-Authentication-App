// =====================================
const formTitle = document.getElementById("form-title");
const submitButton = document.getElementById("submit");

const primaryDescriptionLink = document.getElementById("primary-description-link");
const primaryToggleLink = document.getElementById("primary-toggle-link");
const primaryGroup = document.getElementById("primary-group");

const secondaryDescriptionLink = document.getElementById("secondary-description-link");
const secondaryToggleLink = document.getElementById("secondary-toggle-link");
const secondaryGroup = document.getElementById("secondary-group");

const usernameGroup = document.getElementById("username-group");
const usernameInput = document.getElementById("username");

const successText = document.getElementById("success-text");
const warningText = document.getElementById("warning-text");

const passwordGroup = document.getElementById("password-group");
const passwordImg = document.getElementById("password-image");
const passwordInput = document.getElementById("password");

const newPasswordGroup = document.getElementById("new-password-group");
const newPasswordImg = document.getElementById("new-password-image");
const newPasswordInput = document.getElementById("new-password");

const passwordConfirmationGroup = document.getElementById("confirm-password-group");
const passwordConfirmationImg = document.getElementById("password-confirmation-image");
const passwordConfirmationInput = document.getElementById("confirm-password");

const registerGroup = document.getElementById("register-group");

const imageSources = [
  "eye-locked.svg",
  "eye-unlocked.svg",
];

const loginNavIdentifier = {
  category: "Login",
  title: "Login"
};
const registrationNavIdentifier = {
  category: "Register",
  title: "New Account Registration"
};
const forgotPasswordNavIdentifier = {
  category: "Forgot",
  title: "Recover Lost Password"
};

const minimumPaswordCharacterCount = 8;
const regexUpperLetters = /[A-z]/;
const regexLowerLetters = /[a-z]/;
const regexNumbers = /[0-9]/;
const regexSymbols = /[^a-zA-z0-9]/;
// =====================================
const onPageLoaded = () => {
  // Preload Images
  for (var i = 0; i < imageSources.length; i++) {
    var img = new Image();
    img.src = imageSources[i];
  }

  // Pre-define functions of button's onclick callbacks.
  primaryToggleLink.onclick = () => toggleAuth("Register");
  secondaryToggleLink.onclick = () => toggleAuth("Forgot");

  passwordImg.onclick = () => togglePasswordView("password", passwordImg, passwordInput);
  newPasswordImg.onclick = () => togglePasswordView("new-password", newPasswordImg, newPasswordInput);
  passwordConfirmationImg.onclick = () => togglePasswordView("password-confirmation", passwordConfirmationImg, passwordConfirmationInput);
}
// =====================================
const toggleAuth = (navigation) => {
  // Debug
  //console.log("Navigate to: " + navigation);

  switch (navigation.toLowerCase()) {
    // =====================================
    // Login Page
    // Shows:
    // 1. Username Field
    // 2. Password Field
    // 3. Primary Group ("Don't have an account? Register")
    // 4. Secondary Group ("Forgot your password? Click Here")
    // Hides:
    // 1. New Password Field
    // 2. Password Confirmation Field
    case loginNavIdentifier.category.toLowerCase():
      // ================
      formTitle.textContent = loginNavIdentifier.title;
      submitButton.textContent = "Login";

      if (usernameGroup.classList.contains("hidden"))
        usernameGroup.classList.remove("hidden");

      if (passwordGroup.classList.contains("hidden"))
        passwordGroup.classList.remove("hidden");

      if (!newPasswordGroup.classList.contains("hidden"))
        newPasswordGroup.classList.add("hidden");

      if (!passwordConfirmationGroup.classList.contains("hidden"))
        passwordConfirmationGroup.classList.add("hidden");
      // ================
      primaryDescriptionLink.textContent = "Don't have an account?";
      primaryToggleLink.textContent = "Register";
      primaryToggleLink.onclick = () => toggleAuth("Register");
      // ================
      secondaryToggleLink.onclick = () => toggleAuth("Forgot");
      if (secondaryGroup.classList.contains("hidden"))
        secondaryGroup.classList.remove("hidden");
      // ================
      break;
    // =====================================
    // Registration Page
    // Shows:
    // 1. Username Field
    // 2. Password Field
    // 3. Password Confirmation Field
    // 4. Primary Group ("Already have an account? Login")
    // Hides:
    // 1. New Password Field
    // 2. Secondary Group
    case registrationNavIdentifier.category.toLowerCase():
      // ================
      formTitle.textContent = registrationNavIdentifier.title;
      submitButton.textContent = "Register";

      if (passwordConfirmationGroup.classList.contains("hidden"))
        passwordConfirmationGroup.classList.remove("hidden");
      // ================
      primaryDescriptionLink.textContent = "Already have an account?";
      primaryToggleLink.textContent = "Login";
      primaryToggleLink.onclick = () => toggleAuth("Login");
      // ================
      if (!secondaryGroup.classList.contains("hidden"))
        secondaryGroup.classList.add("hidden");
      // ================
      break;
    // =====================================
    // Forgot Password Page
    // Shows:
    // 1. Password Field
    // 2. Password Confirmation Field
    // 3. Primary Group ("Already remembered your password? Return to Login")
    // Hides:
    // 1. New Password Field
    // 2. Secondary Group
    case forgotPasswordNavIdentifier.category.toLowerCase():
      // ================
      formTitle.textContent = forgotPasswordNavIdentifier.title;
      submitButton.textContent = "Submit Request";

      if (usernameGroup.classList.contains("hidden"))
        usernameGroup.classList.remove("hidden");

      if (!passwordGroup.classList.contains("hidden"))
        passwordGroup.classList.add("hidden");

      if (newPasswordGroup.classList.contains("hidden"))
        newPasswordGroup.classList.remove("hidden");

      if (passwordConfirmationGroup.classList.contains("hidden"))
        passwordConfirmationGroup.classList.remove("hidden");
      // ================
      primaryDescriptionLink.textContent = "Already remembered your password?";
      primaryToggleLink.textContent = "Return to Login";
      primaryToggleLink.onclick = () => toggleAuth("Login");
      // ================
      if (!secondaryGroup.classList.contains("hidden"))
        secondaryGroup.classList.add("hidden");
      // ================
      break;
    // =====================================
  }

  usernameInput.value = "";
  passwordInput.value = "";
  newPasswordInput.value = "";
  passwordConfirmationInput.value = "";

  if (!successText.classList.contains("hidden"))
    successText.classList.add("hidden");

  if (!warningText.classList.contains("hidden"))
    warningText.classList.add("hidden");

  resetPasswordView();
}
// ======================================
// User Format:
// {
//   username: "username",
//   password: "password"
// }
const createNewUser = (username, password) => {
  return {
    username: username,
    password: password
  };
};
const registeredUsers = [];
var loggedUser = null;

const handleSubmit = () => {
  // Logout
  if (loggedUser !== null) {
    loggedUser = null;

    submitButton.textContent = "Login";
    successText.textContent = "Successfully logged out.";

    if (usernameGroup.classList.contains("hidden"))
      usernameGroup.classList.remove("hidden");

    if (passwordGroup.classList.contains("hidden"))
      passwordGroup.classList.remove("hidden");

    if (primaryGroup.classList.contains("hidden"))
      primaryGroup.classList.remove("hidden");

    if (secondaryGroup.classList.contains("hidden"))
      secondaryGroup.classList.remove("hidden");
  }
  // Login/Register or Forget Password
  else {
    // ==========================
    const username = usernameInput.value;
    const password = formTitle.textContent.toLowerCase() === "recover lost password" ? newPasswordInput.value : passwordInput.value;
    const passwordConfirmation = passwordConfirmationInput.value;
    // ==========================
    const emptyFields = [];
    if (username.trim().length === 0)
      emptyFields.push("Username");
    if (password.trim().length === 0)
      emptyFields.push("Password");

    if (emptyFields.length > 0) {
      showWarning(`Please fill the following required fields. [${emptyFields.join(", ")}]`);
      return;
    }
    // ==========================
    // Login
    if (formTitle.textContent.toLowerCase() === loginNavIdentifier.title.toLowerCase()) {
      const user = registeredUsers.find((element) => element.username === username);

      if (user === null || user === undefined) {
        showWarning(`User not found. Please sign up first.`);
        return;
      }
      else {
        if (user.password !== password) {
          showWarning(`Incorrect username and password combination.`);
          return;
        }

        successText.textContent = `Successfully logged in. Welcome, ${user.username}!`;

        loggedUser = user;
        submitButton.textContent = "Logout";

        if (!usernameGroup.classList.contains("hidden"))
          usernameGroup.classList.add("hidden");

        if (!passwordGroup.classList.contains("hidden"))
          passwordGroup.classList.add("hidden");

        if (!primaryGroup.classList.contains("hidden"))
          primaryGroup.classList.add("hidden");

        if (!secondaryGroup.classList.contains("hidden"))
          secondaryGroup.classList.add("hidden");
      }
    }
    // ==========================
    // Register or Forgot Password
    else if (formTitle.textContent.toLowerCase() === registrationNavIdentifier.title.toLowerCase() ||
      formTitle.textContent.toLowerCase() === forgotPasswordNavIdentifier.title.toLowerCase()) {
      if (passwordConfirmation != password) {
        showWarning(`Password does not much with confirmation.`);
        return;
      }
      const passwordFilter = regexUpperLetters.test(password) & regexLowerLetters.test(password) &
        regexNumbers.test(password) & regexSymbols.test(password);

      // Less than minimum number of characters (Password).
      if (password.length < minimumPaswordCharacterCount) {
        showWarning(`Password cannot be less than ${minimumPaswordCharacterCount} characters.`);
        return;
      }
      // Password Filter (Must meet the conditions - 1 symbol, number, lowercase letter and uppcase letter)
      else if (!passwordFilter) {
        showWarning(`Password must contain at least 1 symbol, number, upper case letter and lower case letter.`);
        return;
      }

      // Registration
      if (formTitle.textContent.toLowerCase() === registrationNavIdentifier.title.toLowerCase()) {
        const existingUser = registeredUsers.find((element) => element.username === username);

        // User already existed in the registered list.
        if (existingUser !== null && existingUser !== undefined) {
          showWarning(`User (${username}) already exists. Please log in instead.`);
          return;
        }

        successText.textContent = "Successfully registered!";
        registeredUsers.push(createNewUser(username, password));
      }
      // Forgot Password
      else {
        successText.textContent = "Successfully handled the the password change request! If your user exist, you can try logging in with your new password.";

        const existingUserIndex = registeredUsers.findIndex((element) => element.username === username);
        if (existingUserIndex !== -1)
          registeredUsers[existingUserIndex].password = password;
      }
      toggleAuth("Login")
    }
    // ==========================
    hideWarning();
    // ==========================
  }
}
// =====================================
const showWarning = (description) => {
  warningText.textContent = description;

  if (warningText.classList.contains("hidden"))
    warningText.classList.remove("hidden");

  if (!successText.classList.contains("hidden"))
    successText.classList.add("hidden");
}

const hideWarning = () => {
  if (!warningText.classList.contains("hidden"))
    warningText.classList.add("hidden");

  if (successText.classList.contains("hidden"))
    successText.classList.remove("hidden");
}
// =====================================
const lockedPasswordImage = "eye-locked.svg";
const unlockedPasswordImage = "eye-unlocked.svg";
const isLockedStateDict = {
  "password": true,
  "passwordConfirmation": true
};

const togglePasswordView = (key, imgComponent, input) => {
  isLockedStateDict[key] = !isLockedStateDict[key];

  imgComponent.src = isLockedStateDict[key] ? lockedPasswordImage : unlockedPasswordImage;
  input.type = isLockedStateDict[key] ? "password" : "text";
}

const resetPasswordView = () => {
  for (passwordElement in isLockedStateDict) {
    isLockedStateDict[passwordElement] = true;
    switch (passwordElement) {
      case "password":
        passwordImg.src = lockedPasswordImage;
        passwordInput.type = "password";
      case "passwordConfirmation":
        passwordConfirmationImg.src = lockedPasswordImage;
        passwordConfirmationInput.type = "password";
    }
  }

  newPasswordImg.src = lockedPasswordImage;
  newPasswordInput.type = "password";
}
// =====================================