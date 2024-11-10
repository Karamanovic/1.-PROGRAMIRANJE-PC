const halfCircles = document.querySelectorAll(".half-circle");
const halfCircleTop = document.querySelector(".half-circle-top");
const progressBarCircle = document.querySelector(".progressbar-circle");
const progressBar = document.querySelector(".progressbar");

document.addEventListener("scroll", () => {
  const pageViewportHeight = window.innerHeight;
  const pageHeight = document.documentElement.scrollHeight;
  const scrolledPortion = window.scrollY;

  // Calculate the scroll percentage (0 to 100)
  const scrollPercentage = (scrolledPortion / (pageHeight - pageViewportHeight)) * 100;

  // Calculate the degree values for the progress bar rotation
  const scrolledPortionDegree = (scrollPercentage / 100) * 360;

  // Apply rotation for the left and right half-circles
  if (scrollPercentage <= 50) {
    halfCircles[0].style.transform = `rotate(${scrolledPortionDegree * 2}deg)`; // Left half-circle rotates based on scroll
    halfCircles[1].style.transform = `rotate(0deg)`; // Right half-circle stays at 0 degrees until 50%
  } else {
    halfCircles[0].style.transform = `rotate(180deg)`; // Left half-circle is at 180 degrees after 50%
    halfCircles[1].style.transform = `rotate(${(scrolledPortionDegree - 180)}deg)`; // Right half-circle rotates from 0 to 180 degrees
  }

  // Fade out the top circle when the scroll reaches 50% and above
  if (scrollPercentage >= 50) {
    halfCircleTop.style.opacity = "0";
  } else {
    halfCircleTop.style.opacity = "1";
  }

  // Update the percentage text in the center of the circle
  progressBarCircle.textContent = `${Math.round(scrollPercentage)}%`;
});
