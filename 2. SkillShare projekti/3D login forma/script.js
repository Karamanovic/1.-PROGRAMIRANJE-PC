const signUpBtn = document.querySelector(".signup-btn");
const signInBtn = document.querySelector(".signin-btn");
const formsWrapper = document.querySelector(".forms-wrapper");

// Event listener for Sign Up button
signUpBtn.addEventListener("click", (e) => {
    e.preventDefault();
    formsWrapper.classList.add("change");
});

// Event listener for Sign In button
signInBtn.addEventListener("click", (e) => {
    e.preventDefault();
    formsWrapper.classList.remove("change"); // Change to the sign-in form
});
