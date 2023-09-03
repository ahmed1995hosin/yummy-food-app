// eng ahmed hosin
"use strict";
$(".search-section").html("");
// ready

$(document).ready(function () {
  searchMeals("", "s").then(() => {
    $(".preloading").fadeOut(1100);
    $("body").css("overflow", "visible");
  });
});

// menu items
// initialize
let menuWidth = $(".menu__left").innerWidth();
let navHeight = $(".nav").innerHeight();
animateNavLinksDown();
// console.log(navHeight);
// $(".nav-icon").removeClass("nav-icon-close");
$(".menu").css({ left: -menuWidth });

function toggleMenu() {
  if ($(".menu").css("left") == "0px") {
    // console.log($(".menu").css("left") == "0px");
    animateNavLinksDown();
    $(".nav-icon").removeClass("nav-icon-close");
    $(".menu").animate({ left: -menuWidth }, 600);
  } else {
    // animateNavLinksUp();
    $(".nav-icon").addClass("nav-icon-close");
    $(".menu").animate({ left: "0px" }, 400, animateNavLinksUp());
  }
}

// open or close menu click
$(".menu__icon").on("click", toggleMenu);

// escape key events
$(document).on("keydown", (e) => {
  if (e.key == "Escape") {
    if ($(".menu").css("left") == "0px") {
      // console.log($(".menu").css("left") == "0px");
      animateNavLinksDown();
      $(".nav-icon").removeClass("nav-icon-close");
      $(".menu").animate({ left: -menuWidth }, 600);
    }
  }
});

// animate nav-links
// down

function animateNavLinksDown() {
  $(".nav__item").each(function (e) {
    console.log(this);
    $(".nav__item")
      .eq(4 - e)
      .animate({ top: navHeight }, 150 * (1 + e));
  });
}
// up

function animateNavLinksUp() {
  $(".nav__item").each(function (e) {
    // console.log(this);
    $(this).animate({ top: "0px" }, 250 * (1 + e));
  });
}

// open the pages
$(".nav__item .nav__link").on("click", (e) => {
  // console.log($(e.target).html());
  $(e.target).addClass("active");
  $(".nav__item .nav__link").not(e.target).removeClass("active");
  toggleMenu();
});

// search links in the menu click handler
$(".nav__item .nav__link")
  .eq(0)
  .on("click", (e) => {
    let search = `  <div class="row ms-4 ms-sm-0 py-5 gx-4 gy-3">
    <div class="col-md-6">
      <input
        class="search-name form-control bg-transparent text-white w-100"
        type="text"
        placeholder="Search By Name"
      />
    </div>
    <div class="col-md-6">
      <input
        class="search-letter form-control bg-transparent text-white w-100"
        type="text"
        placeholder="Search By First Letter"
        maxlength="1"
      />
    </div>
  </div>`;
    $(".search-section").html(search);
    rowData.innerHTML = "";

    // search
    $(".search-letter").on("keyup", (event) => {
      let letter = event.target.value ? event.target.value : "a";
      searchMeals(letter, "f");
    });
    $(".search-name").on("keyup", (e) => {
      searchMeals(e.target.value, "s");
    });
  });
//
// search elements
const searchSection = $(".search-section");
const rowData = document.getElementById("rowData");
//

// search by name and search by first letter
async function searchMeals(e, choice) {
  $(".inner-preloader").fadeIn(200);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?${choice}=${e}`
  )
    .then((response) => response.json())
    .then((response) => response);
  response.meals ? displayMeals(response.meals) : displayMeals([]);
  $(".inner-preloader").fadeOut(200);
}

// display meals list
function displayMeals(results) {
  let carton = "";
  let lengthMeal = results.length > 20 ? 20 : results.length;
  for (let i = 0; i < lengthMeal; ++i) {
    carton += `<div class="col-lg-3 col-md-4 col-sm-6">
    <picture
      class="meal-detail rounded-2 overflow-hidden position-relative pointer"
      data-meal-id="${results[i].idMeal}"
    >
      <img src="${results[i].strMealThumb}" class="w-100" alt="" />
      <div
        class="bg-layout position-absolute rounded-2 d-flex justify-content-start align-items-center p-3"
      >
        <h3>${results[i].strMeal}</h3>
      </div>
    </picture>
  </div>`;
  }
  rowData.innerHTML = carton;

  // add event handlers for meals details
  $("picture.meal-detail").on("click", function () {
    let mealId = $(this).attr("data-meal-id");
    getMealId(mealId);
  });
}

// display meals info

//  get information about one meal
async function getMealId(mealId) {
  $(".inner-preloader").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  let data = await response.json();
  displayMealDetails(data.meals[0]);
  $(".inner-preloader").fadeOut(300);
}

// display  meal detail info by id
function displayMealDetails(data) {
  $(".search-section").html("");
  //  inIngredient
  let ingredient = "";
  for (let i = 1; i <= 20; i++) {
    if (data[`strIngredient${i}`] && data[`strMeasure${i}`]) {
      ingredient += `<li class="m-3 p-2 alert alert-info">${
        data[`strMeasure${i}`] + ` ` + data[`strIngredient${i}`]
      }</li>`;
    }
  }
  // tags
  let tags = "";
  if (data.strTags) {
    let tag = data.strTags.split(",");
    tags = tag
      .map(function (t) {
        return `<li class="m-3 p-2 alert alert-danger">${t}</li>`;
      })
      .join("");
  }

  rowData.innerHTML = `
  <div class="col-md-4">
  <div class="meal-img">
    <img
      src="${data.strMealThumb}"
      alt=""
      class="w-100 rounded-3 mb-3"
    />
    <h2 class="meal-headind2">${data.strMeal}</h2>
  </div>
</div>
<div class="col-md-8">
  <div class="meal-info">
    <h2 class="meal-headind2 mb-3">Instructions</h2>
    <p>
    ${data.strInstructions}
    </p>
    <h3 class="text-capitalize meal-headind3">
      <span class="fw-bolde">area : </span>${data.strArea}
    </h3>
    <h3 class="text-capitalize meal-headind3">
      <span class="fw-bolder">Category : </span>${data.strCategory}
    </h3>
    <h3 class="text-capitalize meal-headind3">Recipes :</h3>
    <ul class="list-unstyled d-flex flex-wrap mb-3">
      ${ingredient}
    </ul>
    <h3 class="text-capitalize meal-headind3">tag :</h3>
    <ul class="list-unstyled d-flex flex-wrap mb-3">
    ${tags}
      
    </ul>
    <a target="_blank" class="btn text-capitalize btn-success ms-2" href="${data.strSource}"
      >source
    </a>
    <a target="_blank" class="btn text-capitalize btn-danger ms-2" href="${data.strYoutube}">
      youtube
    </a>
  </div>
</div>`;
}

//
//

//get  categories specific links
$(".nav__item .nav__link")
  .eq(1)
  .on("click", (e) => {
    $(".search-section").html("");
    rowData.innerHTML = "";
    getCategories();
  });
async function getCategories() {
  $(".inner-preloader").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let data = await response.json();
  displayCategories(data["categories"]);
  $(".inner-preloader").fadeOut(300);
}

// display all categories
function displayCategories(data) {
  let carton = "";
  console.log(data.length);
  for (let i = 0; i < data.length; i++) {
    let categoryPara = data[i].strCategoryDescription;
    categoryPara = categoryPara.split(" ").slice(0, 19).join(" ");
    console.log(categoryPara);
    carton += `<div class="col-lg-3 col-md-4 col-sm-6">
    <picture
      class="meal-detail meal-category rounded-2 overflow-hidden position-relative pointer"
      data-meal-category="${data[i].strCategory}"
    >
      <img src="${data[i].strCategoryThumb}" class="w-100" alt="" />
      <div
        class="bg-layout flex-column position-absolute rounded-2 d-flex justify-content-center align-items-center p-3  overflow-hidden  text-black text-center"
      >
        <h3>${data[i].strCategory}</h3>
        <p class="">
        ${categoryPara}</p>
      </div>
    </picture>
  </div>`;
  }
  rowData.innerHTML = carton;
  $("picture.meal-category").on("click", function (e) {
    // console.log($(this).attr("data-meal-category"));
    getMealsFilter($(this).attr("data-meal-category"), "c");
  });
}
//
// Filter by one main ingredient
// Filter by one Category
// Filter by one Area
// get meals from specified filter
async function getMealsFilter(filter, choice) {
  $(".inner-preloader").fadeIn(300);
  $(".search-section").html("");
  let data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?${choice}=${filter}`
  )
    .then((response) => response.json())
    .then((response) => response);
  // console.log(data);
  displayMeals(data.meals);
  $(".inner-preloader").fadeOut(300);
}

//
//
//
// area links in menu  events click handlers
$(".nav__item .nav__link")
  .eq(2)
  .on("click", async (e) => {
    rowData.innerHTML = "";
    $(".inner-preloader").fadeIn(300);
    $(".search-section").html("");
    let data = await getList("a");
    displayAllArea(data.meals);
    $(".inner-preloader").fadeOut(300);
  });

// ingredients links in menu  events click handlers
$(".nav__item .nav__link")
  .eq(3)
  .on("click", async (e) => {
    rowData.innerHTML = "";
    $(".inner-preloader").fadeIn(300);
    $(".search-section").html("");
    let data = await getList("i");
    displayAllIngredients(data.meals);
    $(".inner-preloader").fadeOut(300);
  });

// List all Area, Ingredients
// this function get list of  Areas or  ingredients
async function getList(choice) {
  let data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?${choice}=list`
  )
    .then((response) => response.json())
    .then((result) => result);
  return data;
}
// display All Area
function displayAllArea(data) {
  $(".search-section").html("");
  let carton = "";
  for (let i = 0; i < data.length; i++) {
    carton += `<div class="col-lg-3 col-md-4 col-sm-6">
    <div
      class="area__box text-center p-5 rounded-3 pointer"
      data-area="${data[i].strArea}"
    >
      <i class="fa-solid fa-house fa-4x"></i>
      <h3 class="meal-headind3 mt-4 fw-bolder text-capitalize">
       ${data[i][`strArea`]}
      </h3>
    </div>
  </div>`;
  }
  rowData.innerHTML = carton;
  $(".area__box").on("click", function (e) {
    // filler by which area meals (get Meals Of one Area)
    getMealsFilter($(this).attr("data-area"), "a");
  });
}

// display All ingredients
function displayAllIngredients(data) {
  $(".search-section").html("");
  let carton = "";
  let ingredientsLength = data.length > 20 ? 20 : data.length;
  for (let i = 0; i < ingredientsLength; i++) {
    let ingredientDesc = data[i].strDescription
      .split(" ")
      .slice(0, 20)
      .join(" ");
    carton += ` <div class="col-lg-3 col-md-4 col-sm-6"> <div
    class="ingredient__box text-center p-3 rounded-3 pointer"
    data-ingredient="${data[i].strIngredient}"
  >
    <i class="fas fa-drumstick-bite fa-4x"></i>
    <h3 class="meal-headind3 mt-4 mb-2 fw-bolder text-capitalize">
      ${data[i].strIngredient}
    </h3>
    <p>
      ${ingredientDesc}
    </p>
  </div>
  </div>`;
  }
  rowData.innerHTML = carton;
  $(".ingredient__box").on("click", function (e) {
    // filler by which area meals (get Meals Of one Area)
    getMealsFilter($(this).attr("data-ingredient"), "i");
  });
}

// page contact

$(".nav__item .nav__link")
  .eq(4)
  .on("click", (e) => {
    $(".search-section").html("");
    $(".inner-preloader").fadeIn(300);

    displayContactPage();
    $(".inner-preloader").fadeOut(300);
  });

// function display Contact Page()
// submitBtn btn
let submitBtn;
function displayContactPage() {
  rowData.innerHTML = ` <form class="contact w-75 mx-auto   row py-5 g-4 justify-content-center">
  <div class="col-md-6">
    <input
      class="user-name form-control  text-white w-100"
      type="text"
      placeholder="Enter your Name"
      name="userName"
    />
    <p class="mt-2 text-danger text-small mb-0 "></p>
  </div>
  <div class="col-md-6">
    <input
      class="user-email form-control  text-white w-100"
      type="email"
      placeholder="Enter your Email"
      name="userEmail"
    />
    <p class="mt-2 text-danger text-small mb-0"></p>
  </div>
  <div class="col-md-6">
    <input
      class="user-phone form-control  text-white w-100"
      type="text"
      placeholder="Enter your Phone"
      name="userPhone"
    />
    <p class="mt-2 text-danger text-small mb-0 "></p>
  </div>
  <div class="col-md-6">
    <input
      class="user-age form-control  text-white w-100"
      type="number"
      placeholder="Enter your Age"
      name="userAge"
    />
    <p class="mt-2 text-danger text-small mb-0"></p>
  </div>
  <div class="col-md-6 position-relative">
    <input
      class="user-Password form-control  text-white w-100"
      type="password"
      placeholder="Enter your password"
      name="userPassword"
    />
    <p class="mt-2 text-danger text-small mb-0"></p>
    <i class="toggle-pass fa-solid fa-eye-slash position-absolute text-black pointer  " ></i>
  </div>
  <div class="col-md-6 position-relative">
    <input
      class="user-Repassword form-control  text-white w-100 "
      type="password"
      placeholder="Re-password"
      name="userPassword"
    />
    <p class="mt-2 text-danger text-small mb-0"></p>
    <i class="toggle-pass fa-solid fa-eye-slash position-absolute text-black pointer  " ></i>
  </div>
  <div class="col-md-6">
    <button id="submitBtn" disabled class="btn mt-2 btn-outline-danger px-4 py-2 text-capitalize d-block mx-md-auto ">submit</button>
  </div>
  
</form>
    `;

  // prevent defaults the submit button of form
  $("form").on("click", function (e) {
    e.preventDefault();
  });
  //submitBtn
  submitBtn = document.getElementById("submitBtn");
  // event handlers name
  $(".user-name").on("input", function (event) {
    checkName($(this).val());
  });
  // event handlers email
  $(".user-email").on("input", function (event) {
    // console.log($(this).val());
    checkEmail(event);
  });
  // event handlers phone
  $(".user-phone").on("input", function (event) {
    checkPhone(event);
  });
  // event handlers age
  $(".user-age").on("input", function (event) {
    checkAge(event);
  });
  // event handlers Password
  $(".user-Password").on("input", function (event) {
    checkPass(event);
  });
  // event handlers re-Password
  $(".user-Repassword").on("input", function (event) {
    let matches = $(this).val() == $(".user-Password").val() ? 1 : 0;
    checkRePass(event, matches);
  });

  // show password and hide password number one
  $(".toggle-pass")
    .eq(0)
    .on("click", function () {
      $(this).toggleClass("fa-eye");
      if ($(this).hasClass("fa-eye")) {
        $(this).siblings(".user-Password").attr("type", "text");
      } else $(this).siblings(".user-Password").attr("type", "password");
    });
  // show password and hide password number two (re-password)
  $(".toggle-pass")
    .eq(1)
    .on("click", function () {
      $(this).toggleClass("fa-eye");
      if ($(this).hasClass("fa-eye")) {
        $(this).siblings(".user-Repassword").attr("type", "text");
      } else $(this).siblings(".user-Repassword").attr("type", "password");
    });
}

const nameRegex = /^([a-zA-Z]{2,}\s*)+$/;
const emailRegex = /^(([a-zA-Z]d*)+(_|-|.)*)+@[a-zA-Z]+.[a-zA-Z]{2,4}$/;
// age from 1 to 200 ex:
// /^(([1-9])|([1-9][0-9])|([1][0-9]{2})|200)$/

// age from 18 to 100 ex:
const ageRegex = /^(([1][8-9])|([2-9][0-9])|100)$/;
// At least one upper ,one lower,one digit ,Password with min 8 characters
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
// phone regex
let phoneRegex = /^(((\+|00)[0-9]{3})|0)[0-9]{10}$/;

// function regexExpression true of false
function regexEXP(str, regex) {
  return regex.test(str);
}

// we will cerate flags for all truthy inputs
let userName = false;
let userEmail = false;
let userPhone = false;
let userAge = false;
let userPassword = false;
let userRePassword = false;

// function check Name regexExpression true
function checkName(value) {
  if (value == "") {
    // console.log($("user-name").next());
    $(".user-name").next().fadeOut(200);
    userName = false;
  } else {
    if (regexEXP(value, nameRegex)) {
      $(".user-name").next().fadeOut(200);
      userName = true;
    } else {
      $(".user-name").next().text("Special characters and numbers not allowed");
      $(".user-name").next().fadeIn(200);
      userName = false;
    }
  }
  checkerForm();
}
// function check email user regexExpression true
function checkEmail(value) {
  let val = $(value.target).val();
  if (val == "") {
    $(value.target).next().fadeOut(200);
    userEmail = false;
  } else {
    if (regexEXP(val, emailRegex)) {
      $(value.target).next().fadeOut(200);
      userEmail = true;
    } else {
      $(value.target).next().text("Email not valid *exemple@yyy.zzz");
      $(value.target).next().fadeIn(200);
      userEmail = false;
    }
  }
  checkerForm();
}
// function check phone user regexExpression true
function checkPhone(value) {
  let val = $(value.target).val();
  if (val == "") {
    $(value.target).next().fadeOut(200);
    userPhone = false;
  } else {
    if (regexEXP(val, phoneRegex)) {
      $(value.target).next().fadeOut(200);
      userPhone = true;
    } else {
      $(value.target).next().text("Enter valid Phone Number");
      $(value.target).next().fadeIn(200);
      userPhone = false;
    }
  }
  checkerForm();
}
// function check Age user regexExpression true
function checkAge(value) {
  let val = $(value.target).val();
  if (val == "") {
    $(value.target).next().fadeOut(200);
    userAge = false;
  } else {
    if (regexEXP(val, ageRegex)) {
      $(value.target).next().fadeOut(200);
      userAge = true;
    } else {
      $(value.target).next().text("Enter valid age (18 to 100)");
      $(value.target).next().fadeIn(200);
      userAge = false;
    }
  }
  checkerForm();
}
// function check Age password regexExpression true
function checkPass(value) {
  let val = $(value.target).val();
  if (val == "") {
    $(".toggle-pass").eq(0).fadeOut(100);
    $(value.target).next().fadeOut(200);
    userPassword = false;
  } else {
    $(".toggle-pass").eq(0).fadeIn(100);
    if (regexEXP(val, passwordRegex)) {
      $(value.target).next().fadeOut(200);
      userPassword = true;
    } else {
      $(value.target)
        .next()
        .text(
          "At least one upper ,one lower,one digit ,Password with min 8 characters"
        );
      $(value.target).next().fadeIn(200);
      userPassword = false;
    }
  }
  checkerForm();
}
// function check Age Re-password regexExpression true
function checkRePass(value, targetPassword) {
  let val = $(value.target).val();
  if (val == "") {
    $(".toggle-pass").eq(1).fadeOut(100);
    $(value.target).next().fadeOut(200);
    userRePassword = false;
  } else {
    $(".toggle-pass").eq(1).fadeIn(100);
    if (targetPassword) {
      $(value.target).next().fadeOut(200);
      userRePassword = true;
    } else {
      $(value.target).next().text("match your re-password (confirm)");
      $(value.target).next().fadeIn(200);
      userRePassword = false;
    }
    checkerForm();
  }
}

// function checker Form  to making the submit visible
function checkerForm() {
  if (
    userName &&
    userEmail &&
    userPassword &&
    userRePassword &&
    userPhone &&
    userAge
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", "");
  }
}
