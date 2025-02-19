const btn = document.querySelector(".btn");

let ripple;

btn.addEventListener("mouseenter", e => {
const left = e.clientX - e.target.getBoundingClientRect().left;
const top = e.clientY - e.target.getBoundingClientRect().top;
// Create ripple element
ripple = document.createElement("div");
ripple.classList.add("ripple");
ripple.style.left = `${left}px`;
ripple.style.top = `${top}px`;
// Add ripple to button
btn.prepend(ripple);
})

btn.addEventListener("mouseleave", () => {
btn.removeChild(ripple);
})